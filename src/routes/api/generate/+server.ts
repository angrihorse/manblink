import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDb, adminStorage } from '$lib/server/firebase';
import { GoogleGenAI } from '@google/genai';
import { GEMINI_API_KEY } from '$env/static/private';
import { FieldValue } from 'firebase-admin/firestore';

const ALWAYS_ON_SPRINKLES = [
	'shot by a photographer',
];

const DEFAULT_SPRINKLES = [
	{ group: 'Framing', text: 'upper body shot' },
	{ group: 'Framing', text: 'full body shot' },

	{ group: 'Lens', text: 'wide angle lens' },
	{ group: 'Lens', text: 'telephoto lens' },

	{ group: 'Angle', text: 'low angle' },
	{ group: 'Angle', text: 'eye-level' },

	{ group: 'Light', text: 'golden hour light' },
	{ group: 'Light', text: 'overcast light' },

	{ group: 'Pose', text: 'side profile looking away' },
	{ group: 'Pose', text: 'front facing with direct gaze' },
	{ group: 'Pose', text: 'leaning to the left' },
	{ group: 'Pose', text: 'leaning to the right' },
	{ group: 'Pose', text: 'open chest posture' },
	{ group: 'Pose', text: 'slight head tilt' },

	{ group: 'Mood', text: 'focused' },
	{ group: 'Mood', text: 'laughing' },
	{ group: 'Mood', text: 'relaxed' },

	{ group: 'Composition', text: 'use rule of thirds' },
	{ group: 'Composition', text: 'centered composition' },
	{ group: 'Composition', text: 'off-center composition' },
	{ group: 'Composition', text: 'asymmetrical composition' },

	{ group: 'ISO', text: 'slightly overexposed' },
	{ group: 'ISO', text: 'underexposed' },

	{ group: 'Depth of field', text: 'blurry background' },
	{ group: 'Depth of field', text: 'background in focus' },

	{ group: 'Shutter speed', text: 'slight motion blur' },
];

function fisherYates<T>(arr: T[]): T[] {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

function applySprinkles(promptText: string): { augmented: string; sprinkles: string[] } {
	const groups = [...new Set(DEFAULT_SPRINKLES.map((s) => s.group))];

	const numGroups = Math.floor(Math.random() * 3) + 1; // 1-3
	const shuffled = fisherYates(groups);
	const selectedGroups = shuffled.slice(0, numGroups);

	const picks = selectedGroups.map((group) => {
		const options = DEFAULT_SPRINKLES.filter((s) => s.group === group);
		const pick = options[Math.floor(Math.random() * options.length)];
		return pick.text;
	});

	const pairLog = selectedGroups.map((g, i) => `${g} - ${picks[i]}`).join(', ');
	console.log(`[sprinkles] ${numGroups} groups: ${pairLog}`);

	const allSprinkles = [...picks, ...ALWAYS_ON_SPRINKLES];
	return {
		augmented: [promptText, ...allSprinkles].join(', '),
		sprinkles: allSprinkles,
	};
}

const MOCK_GEMINI = false;

const ai = new GoogleGenAI({
	apiKey: GEMINI_API_KEY,
	location: 'us-central1',
});

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthenticated' }, { status: 401 });
	}

	const { prompts, selfieBase64, selfieUrl } = await request.json();

	if (!prompts || !Array.isArray(prompts) || prompts.length === 0) {
		return json({ error: 'Invalid prompts' }, { status: 400 });
	}

	if (!selfieBase64 && !selfieUrl) {
		return json({ error: 'Missing selfie image' }, { status: 400 });
	}

	const userId = locals.user.id;
	const userRef = adminDb.collection('users').doc(userId);
	const userDoc = await userRef.get();

	if (!userDoc.exists) {
		return json({ error: 'User not found' }, { status: 404 });
	}

	const userData = userDoc.data();
	const creditsNeeded = prompts.length;
	const currentCredits = userData?.credits || 0;

	if (currentCredits < creditsNeeded) {
		return json({ error: 'Insufficient credits' }, { status: 402 });
	}

	let selfieBuffer: Buffer;
	if (selfieBase64) {
		const base64Data = selfieBase64.split(',')[1] || selfieBase64;
		selfieBuffer = Buffer.from(base64Data, 'base64');
	} else {
		const res = await fetch(selfieUrl);
		if (!res.ok) return json({ error: 'Failed to fetch selfie image' }, { status: 400 });
		selfieBuffer = Buffer.from(await res.arrayBuffer());
	}

	const model = 'gemini-3-pro-image-preview';
	const bucket = adminStorage.bucket();

	generateImages(prompts, selfieBuffer, ai, model, bucket, userId);

	return json({ success: true });
};

async function uploadPhotoToStorage(bucket: any, userId: string, imageBuffer: Buffer) {
	const photoId = adminDb.collection('photos').doc().id;
	const filePath = `users/${userId}/photos/${photoId}.jpg`;
	const file = bucket.file(filePath);

	await file.save(imageBuffer, {
		metadata: { contentType: 'image/jpeg' }
	});

	await file.makePublic();

	const url = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

	return { photoId, url };
}

function parseGeminiError(error: any): { title: string; message: string } {
	try {
		const outer = JSON.parse(error.message);
		const inner = JSON.parse(outer.error.message);
		return {
			title: `${outer.error.code} ${outer.error.status}`,
			message: inner.error.message,
		};
	} catch {
		return {
			title: 'Generation failed',
			message: error?.message ?? 'Please try again.',
		};
	}
}

function ms(t0: number) { return `+${Date.now() - t0}ms`; }

async function generateImages(
	prompts: { text: string; isCustom?: boolean }[],
	selfieBuffer: Buffer,
	ai: any,
	model: string,
	bucket: any,
	userId: string
) {
	const t0 = Date.now();
	console.log(`[generate] start — user:${userId} ${prompts.length} prompt(s), selfie ${(selfieBuffer.length / 1024).toFixed(0)} KB`);

	try {
		const t1 = Date.now();
		const { photoId: inputPhotoId, url: inputPhotoUrl } = await uploadPhotoToStorage(bucket, userId, selfieBuffer);
		console.log(`[generate] ${ms(t0)} selfie uploaded (${ms(t1)})`);

		await adminDb.collection('photos').doc(inputPhotoId).set({
			userId,
			action: 'input',
			url: inputPhotoUrl,
			createdAt: Date.now(),
		});
		console.log(`[generate] ${ms(t0)} input doc written`);

		const generationPromises = prompts.map((prompt, i) => {
			const { text, isCustom } = prompt;
			const { augmented, sprinkles } = isCustom
				? { augmented: text, sprinkles: [] as string[] }
				: applySprinkles(text);
			console.log(`[generate] ${ms(t0)} starting image ${i + 1}/${prompts.length}${isCustom ? ' [custom]' : ''}: "${augmented}"`);
			return generateSingleImage(augmented, text, sprinkles, !!isCustom, selfieBuffer, ai, model, bucket, userId, inputPhotoId, inputPhotoUrl, i + 1, t0);
		});

		const results = await Promise.allSettled(generationPromises);

		const successful = results.filter(r => r.status === 'fulfilled').length;
		const failed = results.filter(r => r.status === 'rejected').length;
		console.log(`[generate] ${ms(t0)} all done — ${successful} ok, ${failed} failed`);

		if (failed > 0) {
			results.forEach((result, index) => {
				if (result.status === 'rejected') {
					console.error(`[generate] ${ms(t0)} image ${index + 1} failed:`, result.reason);
				}
			});
		}

		if (successful === 0) {
			const firstError = results.find(r => r.status === 'rejected') as PromiseRejectedResult | undefined;
			const { title, message } = parseGeminiError(firstError?.reason);
			await adminDb.collection('photos').add({
				userId,
				action: 'error',
				title,
				message,
				createdAt: Date.now(),
			});
		}
	} catch (error: any) {
		console.error(`[generate] ${ms(t0)} fatal error:`, error);
		const { title, message } = parseGeminiError(error);
		await adminDb.collection('photos').add({
			userId,
			action: 'error',
			title,
			message,
			createdAt: Date.now(),
		});
	}
}

async function generateSingleImage(
	promptText: string,
	originalPrompt: string,
	sprinkles: string[],
	isCustom: boolean,
	selfieBuffer: Buffer,
	ai: any,
	model: string,
	bucket: any,
	userId: string,
	inputPhotoId: string,
	inputPhotoUrl: string,
	idx: number,
	t0global: number
) {
	const t0 = Date.now();
	try {
		const imageBuffer = MOCK_GEMINI ? selfieBuffer : await callGeminiAPI(selfieBuffer, promptText, ai, model);
		console.log(`[generate] ${ms(t0global)} image ${idx} gemini done (${ms(t0)})`);

		if (!imageBuffer) {
			return;
		}

		const t1 = Date.now();
		const { photoId: outputPhotoId, url: outputPhotoUrl } = await uploadPhotoToStorage(bucket, userId, imageBuffer);
		console.log(`[generate] ${ms(t0global)} image ${idx} uploaded (${ms(t1)}) - ${outputPhotoId}`);

		const t2 = Date.now();
		await adminDb.collection('photos').doc(outputPhotoId).set({
			userId,
			action: null,
			originalPrompt,
			sprinkles,
			promptText,
			isCustom,
			inputPhotoId,
			inputPhotoUrl,
			url: outputPhotoUrl,
			createdAt: Date.now()
		});
		console.log(`[generate] ${ms(t0global)} image ${idx} firestore written (${ms(t2)}) - ${outputPhotoId}`);

		const userRef = adminDb.collection('users').doc(userId);
		await userRef.update({
			credits: FieldValue.increment(-1)
		});

	} catch (err) {
		console.error(`Error generating image for "${promptText}":`, err);
		throw err;
	}
}

async function callGeminiAPI(
	selfieBuffer: Buffer,
	promptText: string,
	ai: any,
	model: string
): Promise<Buffer | null> {
	const contents = [
		{
			role: 'user',
			parts: [
				{
					inlineData: {
						mimeType: 'image/jpeg',
						data: selfieBuffer.toString('base64')
					}
				},
				{
					text: promptText
				}
			]
		}
	];

	const config = {
		responseModalities: ['IMAGE', 'TEXT'],
		imageConfig: {
			aspectRatio: '4:5',
			imageSize: '1K',
		}
	};

	const response = await ai.models.generateContentStream({
		model,
		config,
		contents
	});

	for await (const chunk of response) {
		if (!chunk.candidates?.[0]?.content?.parts) {
			console.log('Gemini chunk with no parts:', JSON.stringify(chunk, null, 2));
			continue;
		}
		for (const part of chunk.candidates[0].content.parts) {
			if (part.inlineData) {
				return Buffer.from(part.inlineData.data || '', 'base64');
			}
			if (part.text) {
				console.log('Gemini text response:', part.text);
			}
		}
	}

	console.error(`No image data from Gemini for: "${promptText}"`);
	return null;
}
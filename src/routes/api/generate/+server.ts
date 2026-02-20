import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDb, adminStorage } from '$lib/server/firebase';
import { GoogleGenAI } from '@google/genai';
import { GEMINI_API_KEY } from '$env/static/private';
import { FieldValue } from 'firebase-admin/firestore';

const ALWAYS_ON_SPRINKLES = [
	'everything in focus',
];

const DEFAULT_SPRINKLES = [
	{ group: 'Camera', text: 'close-up shot' },
	{ group: 'Camera', text: 'wide angle shot' },
	{ group: 'Camera', text: 'low angle shot' },

	{ group: 'Light', text: 'golden hour light' },
	{ group: 'Light', text: 'overcast light' },

	{ group: 'Pose', text: 'side profile looking away' },
	{ group: 'Pose', text: 'front facing with direct gaze' },

	{ group: 'Posture', text: 'shoulders relaxed' },
	{ group: 'Posture', text: 'open chest posture' },

	{ group: 'Mood', text: 'focused mood' },
	{ group: 'Mood', text: 'laughing' },
	{ group: 'Mood', text: 'relaxed mood' },

	{ group: 'Composition', text: 'rule of thirds composition' },
	{ group: 'Composition', text: 'centered composition' },
];

function applySprinkles(promptText: string): string {
	const groups = [...new Set(DEFAULT_SPRINKLES.map((s) => s.group))];

	const numGroups = Math.floor(Math.random() * 3) + 1; // 1-3
	const shuffled = groups.sort(() => Math.random() - 0.5);
	const selectedGroups = shuffled.slice(0, numGroups);

	const picks = selectedGroups.map((group) => {
		const options = DEFAULT_SPRINKLES.filter((s) => s.group === group);
		const pick = options[Math.floor(Math.random() * options.length)];
		return pick.text;
	});

	return [promptText, ...picks, ...ALWAYS_ON_SPRINKLES].join(', ');
}

const ai = new GoogleGenAI({
	apiKey: GEMINI_API_KEY
});

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthenticated' }, { status: 401 });
	}

	const { promptTexts, selfieBase64, selfieUrl } = await request.json();

	if (!promptTexts || !Array.isArray(promptTexts) || promptTexts.length === 0) {
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
	const creditsNeeded = promptTexts.length;
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

	generateImages(promptTexts, selfieBuffer, ai, model, bucket, userId);

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

	console.log('URL generated:', { photoId, url, hasUrl: !!url });

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

async function generateImages(
	promptTexts: string[],
	selfieBuffer: Buffer,
	ai: any,
	model: string,
	bucket: any,
	userId: string
) {
	try {
		const { photoId: inputPhotoId, url: inputPhotoUrl } = await uploadPhotoToStorage(bucket, userId, selfieBuffer);

		await adminDb.collection('photos').doc(inputPhotoId).set({
			userId,
			action: 'input',
			url: inputPhotoUrl,
			createdAt: Date.now(),
		});

		const generationPromises = promptTexts.map((promptText) => {
			const augmented = applySprinkles(promptText);
			return generateSingleImage(augmented, selfieBuffer, ai, model, bucket, userId, inputPhotoId, inputPhotoUrl);
		});

		const results = await Promise.allSettled(generationPromises);

		const successful = results.filter(r => r.status === 'fulfilled').length;
		const failed = results.filter(r => r.status === 'rejected').length;

		if (failed > 0) {
			console.error(`Generation complete - Success: ${successful}, Failed: ${failed}`);
			results.forEach((result, index) => {
				if (result.status === 'rejected') {
					console.error(`Generation ${index + 1} failed:`, result.reason);
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
		console.error('Fatal error in generateImages:', error);
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
	selfieBuffer: Buffer,
	ai: any,
	model: string,
	bucket: any,
	userId: string,
	inputPhotoId: string,
	inputPhotoUrl: string
) {
	try {
		const imageBuffer = await callGeminiAPI(selfieBuffer, promptText, ai, model);

		if (!imageBuffer) {
			return;
		}

		const { photoId: outputPhotoId, url: outputPhotoUrl } = await uploadPhotoToStorage(bucket, userId, imageBuffer);

		await adminDb.collection('photos').doc(outputPhotoId).set({
			userId,
			action: null,
			promptText,
			inputPhotoId,
			inputPhotoUrl,
			url: outputPhotoUrl,
			createdAt: Date.now()
		});

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
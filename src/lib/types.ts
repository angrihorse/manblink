export type PhotoAction = 'saved' | 'discarded';

export interface Photo {
	id: string;
	userId: string;
	action: PhotoAction | null;
	promptText: string;
	inputPhotoId: string;
	inputPhotoUrl: string;
	url: string;
	parentId?: string;
	createdAt: number;
}

export interface UserData {
	email: string;
	credits: number;
	avatars: string[];
	activeAvatar: string;
	createdAt: number;
}
export type Prompt = {
	id: string;
	text: string;
	label: string;
	isCustom?: boolean;
};

export const DEFAULT_PROMPTS: Prompt[] = [
	{ id: 'party', label: '🥳 Party', text: 'A group of friends laughing together at a Project X party' },
	{ id: 'hiking', label: '🏔️ Hiking', text: 'Hiking along a rugged mountain trail with a view' },
	{ id: 'cooking', label: '🍳 Cooking', text: 'Cooking steak at the stove in a clean modern kitchen' },
	{ id: 'volleyball', label: '🏐 Volleyball', text: 'Receiving a serve on a sandy beach volleyball court' },
	{ id: 'football', label: '⚽ Football', text: 'Playing in a football match on a green grass field' },
	{ id: 'gym', label: '💪 Gym', text: 'Performing barbell bicep curls inside a modern gym' },
	{ id: 'dog', label: '🐕 Dog', text: 'Petting a golden retriever on a patch of grass in a park' },
	{ id: 'cat', label: '🐈 Cat', text: 'Sitting on a sofa petting a cat in a cozy apartment' },
	{ id: 'wedding', label: '👔 Wedding', text: 'Standing in a sharp formal look at an outdoor wedding' },
	{ id: 'cafe', label: '☕ Cafe', text: 'Sitting at a small wooden table in a cafe' },
	{ id: 'city', label: '🏙️ City', text: 'Walking along a sidewalk in a busy city street' },
	{ id: 'park', label: '🌳 Park', text: 'Walking along a paved path in a public park' },
	{ id: 'handstand', label: '🤸 Handstand', text: 'Performing a straight handstand in a gymnastic hall' },
	{ id: 'ocean', label: '🌊 Ocean', text: 'Standing in waist-deep clear blue ocean water at the beach' },
	{ id: 'laptop', label: '💻 Laptop', text: 'Working on a laptop at a window seat in a cafe' },
	{ id: 'sauna', label: '🧖 Sauna', text: 'Standing inside a wood-paneled sauna with a towel on the back' },
	{ id: 'bike', label: '🏍️ Bike', text: 'Sitting on a red Kawasaki motorcycle in an asphalt parking lot' },
	{ id: 'run', label: '🏃 Run', text: 'Warming up for a run on a suburban street with a group of people' }
];

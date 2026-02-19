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
	{ id: 'party', label: '🥳 Party', text: 'Night out, subtle colored lights' },
	{ id: 'hiking', label: '🏔️ Hiking', text: 'Hiking a mountain trail' },
	{ id: 'cooking', label: '🍳 Cooking', text: 'Cooking in a clean modern kitchen' },
	{ id: 'volleyball', label: '🏐 Volleyball', text: 'Beach volleyball game' },
	{ id: 'tennis', label: '🎾 Tennis', text: 'Tennis rally, focused' },
	{ id: 'football', label: '⚽ Football', text: 'Football match on grass field' },
	{ id: 'gym', label: '💪 Gym', text: 'Training session in a modern gym' },
	{ id: 'dog', label: '🐕 Dog', text: 'Walking a dog outdoors' },
	{ id: 'cat', label: '🐈 Cat', text: 'Calm indoor moment with a cat' },
	{ id: 'wedding', label: '👔 Wedding', text: 'Sharp formal look at a wedding' },
	{ id: 'cafe', label: '☕ Cafe', text: 'Cafe table, natural daylight' },
	{ id: 'city', label: '🏙️ City', text: 'City street, confident walk' },
	{ id: 'park', label: '🌳 Park', text: 'Sunny park, relaxed posture' },
	{ id: 'handstand', label: '🤸 Handstand', text: 'Straight handstand in a room lit by sun from a window' }
];

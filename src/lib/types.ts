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
	{ id: 'party', label: '🥳 Party', text: 'Laughing with friends at a Project X party' },
	{ id: 'hiking', label: '🏔️ Hiking', text: 'Hiking a mountain trail' },
	{ id: 'cooking', label: '🍳 Cooking', text: 'Cooking steak in a clean modern kitchen' },
	{ id: 'volleyball', label: '🏐 Volleyball', text: 'Receiving a serve in a beach volleyball game' },
	{ id: 'football', label: '⚽ Football', text: 'Football match on grass field' },
	{ id: 'gym', label: '💪 Gym', text: 'Barbell bicep curls in a modern gym' },
	{ id: 'dog', label: '🐕 Dog', text: 'Petting a golden retriever in a park' },
	{ id: 'cat', label: '🐈 Cat', text: 'Petting a cat' },
	{ id: 'wedding', label: '👔 Wedding', text: 'Sharp formal look at a wedding' },
	{ id: 'cafe', label: '☕ Cafe', text: 'Sitting across a cafe table with coffee in hand' },
	{ id: 'city', label: '🏙️ City', text: 'Walking in a busy city street' },
	{ id: 'park', label: '🌳 Park', text: 'Walking in a park' },
	{ id: 'handstand', label: '🤸 Handstand', text: 'Straight handstand in a gymnastic hall lit by sun from a window' },
	{ id: 'ocean', label: '🌊 Ocean', text: 'Standing in waist-deep clear blue ocean water topless' },
	{ id: 'laptop', label: '💻 Laptop', text: 'Sitting behind a laptop in a cafe' },
	{ id: 'sauna', label: '🧖 Sauna', text: 'After sauna with a towel on the back' },
	{ id: 'bike', label: '🏍️ Bike', text: 'Sitting on a black motorcycle in a parking lot' },
	{ id: 'run', label: '🏃 Run', text: 'Warming up for a morning run with a group of people' }
];

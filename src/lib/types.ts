export type PhotoAction = 'saved' | 'discarded';

export interface Photo {
	id: string;
	userId: string;
	action: PhotoAction | null;
	originalPrompt: string;
	sprinkles: string[];
	promptText: string;
	isCustom?: boolean;
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
	{ id: 'party', label: '🥳 Party', text: 'A group of friends laughing together at a New Years Eve party' },
	{ id: 'hiking', label: '🏔️ Hiking', text: 'Hiking along a rugged mountain trail with a view' },
	{ id: 'cooking', label: '🍳 Cooking', text: 'Cooking steak at the stove in a clean modern kitchen' },
	{ id: 'volleyball', label: '🏐 Volleyball', text: 'Receiving a serve on a sandy beach volleyball court' },
	{ id: 'gym', label: '💪 Gym', text: 'Performing barbell bicep curls inside a modern gym' },
	{ id: 'dog', label: '🐕 Dog', text: 'Petting a golden retriever in a park' },
	{ id: 'wedding', label: '👔 Wedding', text: 'Standing at an outdoor wedding in a well-fitted suit' },
	{ id: 'cafe', label: '☕ Cafe', text: 'Sitting at a small wooden table in a cafe' },
	{ id: 'city', label: '🏙️ City', text: 'Walking along a sidewalk in a busy city street' },
	{ id: 'park', label: '🌳 Park', text: 'Walking along a paved path in a public park' },
	{ id: 'handstand', label: '🤸 Handstand', text: 'Performing a straight handstand in a gymnastic hall' },
	{ id: 'laptop', label: '💻 Laptop', text: 'Working on a laptop at a window seat in a cafe' },
	{ id: 'bike', label: '🏍️ Bike', text: 'Sitting on a red Kawasaki motorcycle in an asphalt parking lot' },
	{ id: 'run', label: '🏃 Run', text: 'Warming up for a run on a suburban street with a group of people' }
];

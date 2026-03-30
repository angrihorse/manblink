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
export const PROMPT_CATEGORIES = ['Sports', 'Animals', 'Nature', 'Date ideas', 'Going out', 'At home', 'Self-care'] as const;
export const FEATURED_IDS = ['dog', 'park', 'cafe', 'wedding', 'gym', 'cooking'] as const;
export type PromptCategory = typeof PROMPT_CATEGORIES[number];

export type Prompt = {
	id: string;
	text: string;
	label: string;
	emoji: string;
	category?: PromptCategory;
	isCustom?: boolean;
};

export const DEFAULT_PROMPTS: Prompt[] = [
	// Sports
	{ id: 'volleyball', category: 'Sports', emoji: '🏐', label: 'Volleyball', text: 'Receiving a serve on a sandy beach volleyball court in full sun, wearing board shorts, sand flying, slightly overexposed' },
	{ id: 'gym', category: 'Sports', emoji: '💪', label: 'Gym', text: 'Working out at an outdoor calisthenics park, doing pull-ups on a metal bar, wearing a fitted workout shirt, golden hour light' },
	{ id: 'bike', category: 'Sports', emoji: '🏍️', label: 'Bike', text: 'Sitting on a red Kawasaki motorcycle in an asphalt parking lot, wearing a leather jacket, slightly underexposed' },
	{ id: 'run', category: 'Sports', emoji: '🏃', label: 'Run', text: 'Warming up for a run on a suburban street with a group of people, wearing running gear, overcast light' },
	{ id: 'skiing', category: 'Sports', emoji: '⛷️', label: 'Ski', text: 'Carving a clean turn through fresh powder on a wide open run, wearing ski gear, mountains stretching behind them, slightly overexposed' },
	{ id: 'snowboarding', category: 'Sports', emoji: '🏂', label: 'Snowboard', text: 'Holding a jump in a terrain park, wearing snowboard gear, board grabbed mid-air, a small crowd watching from the side, slightly overexposed' },
	{ id: 'football', category: 'Sports', emoji: '⚽', label: 'Football', text: 'Breaking past a defender with the ball on a grass pitch, wearing a football kit, teammates calling for the pass, overcast light' },
	{ id: 'basketball', category: 'Sports', emoji: '🏀', label: 'Basketball', text: 'Pulling up for a mid-range jumper in a pickup game, wearing basketball shorts and a jersey, defenders closing fast, slightly overexposed' },
	{ id: 'tennis', category: 'Sports', emoji: '🎾', label: 'Tennis', text: 'Setting up for a backhand at a clay court, wearing tennis whites, mid-rally with the sun behind them, golden hour light' },
	{ id: 'badminton', category: 'Sports', emoji: '🏸', label: 'Badminton', text: 'Reaching up for a smash on a backyard badminton court at dusk, wearing athletic wear, partner scrambling to cover, golden hour light' },
	{ id: 'swimming', category: 'Sports', emoji: '🏊', label: 'Swim', text: 'Pushing off the wall at the start of a lap in an outdoor pool, wearing swimwear and goggles, slightly overexposed' },
	{ id: 'cycling', category: 'Sports', emoji: '🚴', label: 'Cycling', text: 'Leaning into a turn on a winding mountain road, wearing a cycling jersey, slightly overexposed' },
	{ id: 'boxing', category: 'Sports', emoji: '🥊', label: 'Boxing', text: 'Sparring at an outdoor boxing ring, wearing boxing shorts and hand wraps, golden hour light' },
	{ id: 'rugby', category: 'Sports', emoji: '🏉', label: 'Rugby', text: 'Breaking a tackle on a muddy pitch in the rain, wearing a rugby kit, ball tucked tight under their arm, overcast light' },
	{ id: 'table_tennis', category: 'Sports', emoji: '🏓', label: 'Ping Pong', text: 'Returning a wicked spin serve at an outdoor table tennis table in a park, wearing clean casual sporty clothes, opponent scrambling to recover, slightly overexposed' },
	{ id: 'baseball', category: 'Sports', emoji: '⚾', label: 'Baseball', text: 'In the batter\'s box at a stadium, wearing a baseball uniform, watching the pitch come in, golden hour light' },
	{ id: 'hockey', category: 'Sports', emoji: '🏒', label: 'Hockey', text: 'Playing pond hockey on a frozen lake, wearing hockey gear, breath visible in the cold air, overcast light' },
	{ id: 'padel', category: 'Sports', emoji: '🎾', label: 'Padel', text: 'Hitting a lob off the back glass wall of a padel court, wearing athletic wear, doubles partner covering the net, slightly overexposed' },
	{ id: 'archery', category: 'Sports', emoji: '🏹', label: 'Archery', text: 'At full draw on a recurve bow at an outdoor range, wearing clean casual outdoor clothes, arrow nocked, overcast light' },

	// Food and Drink
	{ id: 'cooking', category: 'At home', emoji: '🍳', label: 'Cooking', text: 'Cooking steak on a wood-fired grill in a sunny backyard, wearing a clean casual t-shirt, golden hour light' },
	{ id: 'cafe', category: 'Date ideas', emoji: '☕', label: 'Cafe', text: 'Sitting at an outdoor café terrace in the sun, stirring a flat white, half-reading a book, wearing a clean casual linen shirt, slightly overexposed' },
	{ id: 'cocktails', category: 'Date ideas', emoji: '🍸', label: 'Cocktails', text: 'Leaning against the railing of a rooftop bar at dusk, mid-conversation, negroni in hand, wearing a fitted shirt, city skyline behind them, golden hour light' },
	{ id: 'beer', category: 'Date ideas', emoji: '🍺', label: 'Beer', text: 'Clinking beer bottles with friends around a fire pit, wearing a clean casual clothes, golden hour light' },
	{ id: 'tea', category: 'Date ideas', emoji: '🍵', label: 'Tea', text: 'Sitting in a garden chair cradling a mug of tea on a quiet sunny morning, wearing a knit sweater, surrounded by greenery, slightly overexposed' },
	{ id: 'wine', category: 'Date ideas', emoji: '🍷', label: 'Wine', text: 'Pouring wine for someone across a table on a warm outdoor restaurant terrace, wearing a smart clean casual shirt, golden hour light' },
	{ id: 'baking', category: 'At home', emoji: '🍞', label: 'Baking', text: 'Pulling a tray of fresh bread from a home oven, wearing a clean casual t-shirt and apron, flour on their hands and forearms, slightly overexposed' },
	// Animals
	{ id: 'dog', category: 'Animals', emoji: '🐕', label: 'Dog', text: 'Petting a golden retriever in a park, wearing jeans and a clean casual shirt, golden hour light' },
	{ id: 'cat', category: 'Animals', emoji: '🐱', label: 'Cat', text: 'Sitting on a sunny park bench with a tabby cat in their lap, wearing clean casual clothes, golden hour light' },
	{ id: 'horse', category: 'Animals', emoji: '🐴', label: 'Horse', text: 'Standing beside a chestnut horse in a sunlit paddock, hand resting on its neck, wearing jeans and a casual shirt, golden hour light' },

	// Nature
	{ id: 'hiking', category: 'Nature', emoji: '🏔️', label: 'Hike', text: 'Hiking along a rugged mountain trail with a view, wearing outdoor gear and a fleece, golden hour light' },
	{ id: 'park', category: 'Nature', emoji: '🌳', label: 'Park', text: 'Walking along a paved path in a public park, wearing clean casual clothes, golden hour light' },
	{ id: 'camping', category: 'Nature', emoji: '🏕️', label: 'Camp', text: 'Sitting on a log by a crackling campfire, wearing an outdoor jacket, mug in hand, stars starting to appear overhead, slightly underexposed' },

	// City
	{ id: 'city', category: 'Date ideas', emoji: '🏙️', label: 'City', text: 'Walking along a sidewalk in a busy city street, wearing jeans and a clean jacket, overcast light' },
	{ id: 'museum', category: 'Date ideas', emoji: '🏛️', label: 'Museum', text: 'Standing in the sun-filled courtyard of a modern museum, a large sculpture behind them, hands in pockets, wearing a clean minimal outfit, slightly overexposed' },
	{ id: 'art_gallery', category: 'Date ideas', emoji: '🖼️', label: 'Art Gallery', text: 'Moving through an outdoor art fair on a sunny afternoon, glass of wine in hand, wearing a blazer, golden hour light' },
	{ id: 'aquarium', category: 'Date ideas', emoji: '🐠', label: 'Aquarium', text: 'Looking through an aquarium glass wall, blue-lit, wearing clean casual clothes, slightly underexposed' },
	{ id: 'thrifting', category: 'Date ideas', emoji: '🧥', label: 'Thrifting', text: 'Flipping through vinyl records at a weekend vintage market, wearing a sharp thrifted jacket, overcast light' },
	{ id: 'shopping', category: 'Date ideas', emoji: '🛍️', label: 'Shopping', text: 'Trying on sunglasses at an open-air market, wearing clean casual clothes, laughing with someone beside them, overcast light' },
	// Travel → Sports
	{ id: 'sailing', category: 'Sports', emoji: '⛵', label: 'Sailing', text: 'At the helm of a sailboat on open water, wearing a nautical jacket, wind in their hair, slightly overexposed' },
	{ id: 'surfing', category: 'Sports', emoji: '🏄', label: 'Surfing', text: 'Popping up cleanly on a wave at a beach break, wearing boardshorts, spray kicking off the lip behind them, slightly overexposed' },
	{ id: 'diving', category: 'Sports', emoji: '🤿', label: 'Diving', text: 'Descending through clear blue water on a scuba dive, wearing a wetsuit, coral reef spreading out below, slightly underexposed' },
	{ id: 'rock_climbing', category: 'Sports', emoji: '🧗', label: 'Climbing', text: 'Chalking hands mid-route on a sun-warmed rock face, wearing a climbing harness and athletic shirt, clipped in, golden hour light' },
	{ id: 'skydiving', category: 'Sports', emoji: '🪂', label: 'Skydiving', text: 'In freefall above open fields, wearing a jumpsuit, arms wide, grinning, slightly overexposed' },

	// Going out
	{ id: 'party', category: 'Going out', emoji: '🥳', label: 'Party', text: 'Dancing on a rooftop terrace at a summer party, dressed up, string lights behind them, golden hour fading to dusk' },
	{ id: 'wedding', category: 'Going out', emoji: '👔', label: 'Wedding', text: 'Standing at an outdoor wedding in a well-fitted suit, golden hour light' },
	{ id: 'rave', category: 'Going out', emoji: '🎵', label: 'Rave', text: 'In the middle of a crowd at an outdoor music festival at dusk, wearing dark streetwear, stage lights and last sunlight mixing, slightly underexposed' },
	{ id: 'concert', category: 'Going out', emoji: '🎤', label: 'Concert', text: 'Watching a live band from a few rows back at an outdoor concert, wearing a clean casual t-shirt, arm around a friend, slightly underexposed' },
	{ id: 'clubbing', category: 'Going out', emoji: '🕺', label: 'Club', text: 'On the dance floor of an outdoor beach club, wearing a going-out outfit, laughing with friends, warm evening light, slightly underexposed' },
	{ id: 'shisha', category: 'Going out', emoji: '💨', label: 'Shisha', text: 'Sitting cross-legged on cushions at an outdoor shisha bar at night, wearing clean casual clothes, smoke curling in the lamplight, slightly underexposed' },

	// Staying in
	{ id: 'laptop', category: 'At home', emoji: '💻', label: 'Laptop', text: 'Working on a laptop at an outdoor café terrace, wearing a clean casual sweater, golden hour light' },
	{ id: 'reading', category: 'At home', emoji: '📚', label: 'Reading', text: 'Stretched out on a blanket in the park with a novel, wearing clean casual clothes, golden hour light' },
	{ id: 'board_games', category: 'At home', emoji: '🎲', label: 'Board Games', text: 'Leaning over a board game at a picnic table in a sunny backyard, wearing clean casual clothes, mid-argument about the rules, laughing, golden hour light' },
	{ id: 'yoga', category: 'Self-care', emoji: '🙏', label: 'Yoga', text: 'Holding a warrior pose on a mat at sunrise on a rooftop, wearing fitted activewear, city skyline stretching behind them, golden hour light' },
	{ id: 'sauna', category: 'Self-care', emoji: '🧖', label: 'Sauna', text: 'Sitting on the steps of an outdoor lakeside sauna, towel around the waist, steam rising around them, trees and still water behind them, golden hour light' },
	{ id: 'meditation', category: 'Self-care', emoji: '🧘', label: 'Meditation', text: 'Seated cross-legged on a yoga mat in an open field at dawn, wearing comfortable loungewear, morning mist on the grass, slightly overexposed' }
];

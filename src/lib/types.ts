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
	emoji: string;
	isCustom?: boolean;
};

export const DEFAULT_PROMPTS: Prompt[] = [
	{ id: 'party', emoji: '🥳', label: 'Party', text: 'A group of friends laughing together at a New Years Eve house party, dressed up, camera flash' },
	{ id: 'hiking', emoji: '🏔️', label: 'Hiking', text: 'Hiking along a rugged mountain trail with a view, wearing outdoor gear and a fleece, golden hour light' },
	{ id: 'cooking', emoji: '🍳', label: 'Cooking', text: 'Cooking steak at the stove in a clean modern kitchen, wearing a clean casual t-shirt, slightly overexposed' },
	{ id: 'volleyball', emoji: '🏐', label: 'Volleyball', text: 'Receiving a serve on a sandy beach volleyball court in full sun, wearing board shorts, sand flying, slightly overexposed' },
	{ id: 'gym', emoji: '💪', label: 'Gym', text: 'Performing barbell bicep curls inside a modern gym, wearing a fitted workout shirt, slightly underexposed' },
	{ id: 'dog', emoji: '🐕', label: 'Dog', text: 'Petting a golden retriever in a park, wearing jeans and a clean casual shirt, golden hour light' },
	{ id: 'wedding', emoji: '👔', label: 'Wedding', text: 'Standing at an outdoor wedding in a well-fitted suit, golden hour light' },
	{ id: 'cafe', emoji: '☕', label: 'Cafe', text: 'Stirring a flat white at a sunlit café table, half-reading a book, wearing a clean casual linen shirt, slightly overexposed' },
	{ id: 'city', emoji: '🏙️', label: 'City', text: 'Walking along a sidewalk in a busy city street, wearing jeans and a clean jacket, overcast light' },
	{ id: 'park', emoji: '🌳', label: 'Park', text: 'Walking along a paved path in a public park, wearing clean casual clothes, golden hour light' },
	{ id: 'laptop', emoji: '💻', label: 'Laptop', text: 'Working on a laptop at a window seat in a cafe, wearing a clean casual sweater, slightly overexposed' },
	{ id: 'bike', emoji: '🏍️', label: 'Bike', text: 'Sitting on a red Kawasaki motorcycle in an asphalt parking lot, wearing a leather jacket, slightly underexposed' },
	{ id: 'run', emoji: '🏃', label: 'Run', text: 'Warming up for a run on a suburban street with a group of people, wearing running gear, overcast light' },

	// Drinks
	{ id: 'cocktails', emoji: '🍸', label: 'Cocktails', text: 'Leaning against the bar at a dimly lit cocktail lounge, mid-conversation, negroni in hand, wearing a fitted shirt, slightly underexposed' },
	{ id: 'beer', emoji: '🍺', label: 'Beer', text: 'Clinking beer bottles with friends around a fire pit, wearing a clean casual clothes, golden hour light' },
	{ id: 'tea', emoji: '🍵', label: 'Tea', text: 'Cradling a mug of tea on a rainy window seat, wearing a knit sweater, watching the street below, overcast light' },
	{ id: 'wine', emoji: '🍷', label: 'Wine', text: 'Pouring wine for someone across a candlelit dinner table in a cozy restaurant, wearing a smart clean casual shirt, slightly underexposed' },

	// Culture
	{ id: 'museum', emoji: '🏛️', label: 'Museum', text: 'Standing in front of a large painting at a modern art museum, hands in pockets, wearing a clean minimal outfit, slightly overexposed' },
	{ id: 'art_gallery', emoji: '🖼️', label: 'Art Gallery', text: 'Moving slowly through a gallery opening at night, glass of wine in hand, wearing a blazer, surrounded by guests, slightly underexposed' },
	{ id: 'aquarium', emoji: '🐠', label: 'Aquarium', text: 'Looking through an aquarium glass wall, blue-lit, wearing clean casual clothes, slightly underexposed' },

	// Nightlife & Social
	{ id: 'rave', emoji: '🎵', label: 'Rave', text: 'In the middle of a crowd at an underground rave, wearing dark streetwear, red lights strobing, slightly underexposed' },
	{ id: 'thrifting', emoji: '🧥', label: 'Thrifting', text: 'Flipping through vinyl records at a weekend vintage market, wearing a sharp thrifted jacket, overcast light' },
	{ id: 'concert', emoji: '🎤', label: 'Concert', text: 'Watching a live band from a few rows back at an outdoor concert, wearing a clean casual t-shirt, arm around a friend, slightly underexposed' },
	{ id: 'clubbing', emoji: '🕺', label: 'Clubbing', text: 'On the dance floor of a packed nightclub, wearing a going-out outfit, laughing with friends under neon lights, slightly underexposed' },

	// Entertainment
	{ id: 'shopping', emoji: '🛍️', label: 'Shopping', text: 'Trying on sunglasses at an open-air market, wearing clean casual clothes, laughing with someone beside them, overcast light' },
	{ id: 'bowling', emoji: '🎳', label: 'Bowling', text: 'Mid-throw at a neon-lit bowling alley, wearing clean casual clothes, friends cheering in the background, slightly underexposed' },
	{ id: 'shisha', emoji: '💨', label: 'Shisha', text: 'Sitting cross-legged on cushions at an outdoor shisha bar at night, wearing clean casual clothes, smoke curling in the lamplight, slightly underexposed' },

	// Outdoor & Adventure
	{ id: 'diving', emoji: '🤿', label: 'Diving', text: 'Descending through clear blue water on a scuba dive, wearing a wetsuit, coral reef spreading out below, slightly underexposed' },
	{ id: 'rock_climbing', emoji: '🧗', label: 'Climbing', text: 'Chalking hands mid-route on a sun-warmed rock face, wearing a climbing harness and athletic shirt, clipped in, golden hour light' },
	{ id: 'sailing', emoji: '⛵', label: 'Sailing', text: 'At the helm of a sailboat on open water, wearing a nautical jacket, wind in their hair, slightly overexposed' },
	{ id: 'road_trip', emoji: '🚗', label: 'Road Trip', text: 'Arm hanging out the window of a moving car on a long desert highway, wearing a clean casual shirt, golden hour light' },
	{ id: 'camping', emoji: '🏕️', label: 'Camping', text: 'Sitting on a log by a crackling campfire, wearing an outdoor jacket, mug in hand, stars starting to appear overhead, slightly underexposed' },
	{ id: 'surfing', emoji: '🏄', label: 'Surfing', text: 'Popping up cleanly on a wave at a beach break, wearing boardshorts, spray kicking off the lip behind them, slightly overexposed' },
	{ id: 'skydiving', emoji: '🪂', label: 'Skydiving', text: 'In freefall above open fields, wearing a jumpsuit, arms wide, grinning, slightly overexposed' },
	{ id: 'skiing', emoji: '⛷️', label: 'Skiing', text: 'Carving a clean turn through fresh powder on a wide open run, wearing ski gear, mountains stretching behind them, slightly overexposed' },
	{ id: 'snowboarding', emoji: '🏂', label: 'Snowboarding', text: 'Holding a jump in a terrain park, wearing snowboard gear, board grabbed mid-air, a small crowd watching from the side, slightly overexposed' },
	{ id: 'skating', emoji: '⛸️', label: 'Skating', text: 'Gliding on an outdoor ice rink at night, wearing a winter coat, city lights reflected across the ice, camera flash, slightly underexposed' },

	// Sports
	{ id: 'football', emoji: '⚽', label: 'Football', text: 'Breaking past a defender with the ball on a grass pitch, wearing a football kit, teammates calling for the pass, overcast light' },
	{ id: 'basketball', emoji: '🏀', label: 'Basketball', text: 'Pulling up for a mid-range jumper in a pickup game, wearing basketball shorts and a jersey, defenders closing fast, slightly overexposed' },
	{ id: 'tennis', emoji: '🎾', label: 'Tennis', text: 'Setting up for a backhand at a clay court, wearing tennis whites, mid-rally with the sun behind them, golden hour light' },
	{ id: 'badminton', emoji: '🏸', label: 'Badminton', text: 'Reaching up for a smash on a backyard badminton court at dusk, wearing athletic wear, partner scrambling to cover, golden hour light' },
	{ id: 'swimming', emoji: '🏊', label: 'Swimming', text: 'Pushing off the wall at the start of a lap in an outdoor pool, wearing swimwear and goggles, slightly overexposed' },
	{ id: 'cycling', emoji: '🚴', label: 'Cycling', text: 'Leaning into a turn on a winding mountain road, wearing a cycling jersey, slightly overexposed' },
	{ id: 'crossfit', emoji: '🏋️', label: 'CrossFit', text: 'In the middle of a box workout, wearing athletic wear, rope in hand, others pushing hard around them, slightly overexposed' },
	{ id: 'boxing', emoji: '🥊', label: 'Boxing', text: 'Working the heavy bag in a real boxing gym, wearing boxing shorts, hands wrapped, slightly underexposed' },
	{ id: 'rugby', emoji: '🏉', label: 'Rugby', text: 'Breaking a tackle on a muddy pitch in the rain, wearing a rugby kit, ball tucked tight under their arm, overcast light' },
	{ id: 'table_tennis', emoji: '🏓', label: 'Ping Pong', text: 'Returning a wicked spin serve at a table tennis club, wearing clean casual sporty clothes, opponent scrambling to recover, slightly overexposed' },
	{ id: 'baseball', emoji: '⚾', label: 'Baseball', text: 'In the batter\'s box at a stadium, wearing a baseball uniform, watching the pitch come in, golden hour light' },
	{ id: 'hockey', emoji: '🏒', label: 'Hockey', text: 'Battling for the puck along the boards in a fast local ice hockey game, wearing full hockey gear, slightly underexposed' },
	{ id: 'padel', emoji: '🎾', label: 'Padel', text: 'Hitting a lob off the back glass wall of a padel court, wearing athletic wear, doubles partner covering the net, slightly overexposed' },
	{ id: 'skateboarding', emoji: '🛹', label: 'Skating', text: 'Dropping into a bowl at a skatepark, wearing streetwear, a few people watching from the edge, overcast light' },
	{ id: 'archery', emoji: '🏹', label: 'Archery', text: 'At full draw on a recurve bow at an outdoor range, wearing clean casual outdoor clothes, arrow nocked, overcast light' },

	// Hobbies
	{ id: 'reading', emoji: '📚', label: 'Reading', text: 'Stretched out on a blanket in the park with a novel, wearing clean casual clothes, golden hour light' },
	{ id: 'board_games', emoji: '🎲', label: 'Board Games', text: 'Leaning over a board game at a table full of friends, wearing clean casual clothes, mid-argument about the rules, laughing, slightly overexposed' },

	// Food
	{ id: 'baking', emoji: '🍞', label: 'Baking', text: 'Pulling a tray of fresh bread from a home oven, wearing a clean casual t-shirt and apron, flour on their hands and forearms, slightly overexposed' },
	{ id: 'bbq', emoji: '🥩', label: 'BBQ', text: 'Managing a full grill at a backyard cookout, wearing clean casual summer clothes, tongs in hand, smoke rising, friends gathered around, golden hour light' },

	// Wellness
	{ id: 'yoga', emoji: '🙏', label: 'Yoga', text: 'Holding a warrior pose on a mat at sunrise on a rooftop, wearing fitted activewear, city skyline stretching behind them, golden hour light' },
	{ id: 'sauna', emoji: '🧖', label: 'Sauna', text: 'Sitting back in a wood-paneled sauna, towel around the waist, eyes closed, steam rising slowly around them, slightly underexposed' },
	{ id: 'meditation', emoji: '🧘', label: 'Meditation', text: 'Seated cross-legged on a cushion by a large window at dawn, wearing comfortable loungewear, slightly overexposed' }
];

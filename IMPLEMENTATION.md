# AI Photo Generation App - Implementation Guide

## Overview
Full implementation of the AI photo generation feature for Manblink using Google Gemini API, Firebase, and SvelteKit.

## Features Implemented

### 1. Prompt Selection Screen
- **File**: `src/routes/app/PromptSelector.svelte`
- Grid of 13 default prompt cards with emoji icons
- Custom prompt creation with modal
- Selected prompts displayed in a list
- Continue button (disabled until at least 1 prompt selected)

### 2. Photo Upload Screen
- **File**: `src/routes/app/PhotoUploadScreen.svelte`
- Drag & drop photo upload
- Preview uploaded selfie
- Upload to Firebase Storage with unique photoId
- Two buttons: "Update" (gray) and "Get Photos" (rose-500)

### 3. Generation & Review Screen
- **File**: `src/routes/app/GenerationView.svelte`
- Countdown timer (59 seconds)
- Real-time Firestore listener for new photos
- Single-column scrollable photo list
- Each photo has 4 action buttons:
  - ❌ Discard
  - 🔄 Retry
  - ✏️ Edit
  - ⬇️ Download

### 4. History View
- **File**: `src/routes/app/HistoryView.svelte`
- Two tabs: Liked (saved) and Disliked (discarded/retry/edit)
- Paginated results (20 photos per page)
- Back button to return to generation view

### 5. Photo Card Component
- **File**: `src/lib/components/PhotoCard.svelte`
- Loads images from Firebase Storage
- Displays "Retry" badge for Retryd photos
- Action buttons with proper handlers
- Auto-hides when status changes

### 6. Edit Prompt Modal
- **File**: `src/lib/components/EditPromptModal.svelte`
- Edit existing prompt text
- Creates new photo doc with edited prompt
- Marks original photo as 'edit' status

## Database Schema

### Firestore Collections

```typescript
users/{userId}
  - email: string
  - credits: number
  - sessionCreditsUsed: number
  - avatars: string[] // photoIds only
  - activeAvatar: string // photoId
  - createdAt: number

photos/{photoId}
  - userId: string
  - status: 'new' | 'retry' | 'edit' | 'saved' | 'discarded' | 'failed'
  - promptText: string
  - inputPhotoId: string // photoId of selfie
  - outputPhotoId?: string // photoId of generated image
  - parentId?: string // for retries/edits
  - createdAt: number
  - generatedAt?: number
```

### Firebase Storage

```
photos/
  {photoId}.jpg // both selfies AND generated images
```

## API Routes

### POST `/api/generate`
- **File**: `src/routes/api/generate/+server.ts`
- Validates user credits
- Decrements credits atomically
- Creates photo documents
- Calls Google Gemini API
- Uploads generated images to Storage
- Updates photo docs with outputPhotoId

## State Management

### Global State
- **File**: `src/lib/stores/app.svelte.ts`
- Uses Svelte 5 runes ($state)
- Manages:
  - Selected prompts
  - Uploaded selfie ID and preview
  - Current screen
  - Generating photos list
  - History state
  - Edit modal state

## Credit Display

### Layout Integration
- **File**: `src/routes/+layout.svelte`
- Real-time credit balance in header
- Shows: "{credits} credits • {sessionUsed} used"
- Updates automatically via Firestore listener

## Environment Variables

Create a `.env` file with:

```env
FB_PROJECT_ID=your-project-id
FB_CLIENT_EMAIL=your-client-email
FB_PRIVATE_KEY=your-private-key
GEMINI_API_KEY=your-gemini-api-key
```

## Design System Consistency

All components follow existing design patterns:

### Colors
- Primary: `bg-rose-500`, `text-rose-500`
- Secondary: `bg-stone-200`, `bg-stone-300`
- Text: `text-stone-700`, `text-stone-800`
- Accent: `bg-stone-700` (for action buttons)

### Typography
- Headings: `text-3xl font-bold`
- Body: ` font-bold`
- Small: ``

### Buttons
- Height: `h-16`
- Border radius: `rounded-xl`
- Full width or flex-1
- Hover states on all interactive elements

### Spacing
- Gap: `gap-4`, `gap-8`
- Space-y: `space-y-2`, `space-y-4`, `space-y-8`
- Padding: `p-3`, `p-4`, `p-8`

### Layout
- Full screen: `h-dvh` for main screens
- Photo aspect ratio: `aspect-3/4`
- Single column on mobile
- Scrollable lists: `overflow-y-auto`

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Usage Flow

1. User navigates to `/app`
2. **Screen 1**: Select prompts (default or custom)
3. **Screen 2**: Upload selfie
4. Click "Get Photos" - Calls API - Credits deducted
5. **Screen 3**: Timer counts down while photos generate
6. Real-time updates as photos are generated
7. Review photos and take actions (discard/Retry/edit/download)
8. View history of liked/disliked photos

## Key Features

### Real-time Updates
- Firestore `onSnapshot` listeners for:
  - User credits (in layout)
  - Generating photos (in generation view)

### Photo Actions
- **Discard**: Sets status to 'discarded', hides from list
- **Retry**: Sets status to 'retry', creates new generation with same prompt
- **Edit**: Opens modal, creates new photo with edited prompt
- **Download**: Triggers browser download, sets status to 'saved'

### Credit System
- 1 credit per photo generation
- Atomic decrements prevent race conditions
- Session tracking for "X used" display
- Insufficient credits returns 402 error

## Gemini API Integration

Uses Google Gemini 2.0 Flash Exp model:
- Input: Base64 encoded selfie + text prompt
- Output: Generated image as base64
- Config: IMAGE response modality, 1K image size
- Streaming response for efficiency

## Error Handling

- Invalid prompts - 400 error
- Missing selfie - 400 error
- Insufficient credits - 402 error
- Failed generations - Photo status set to 'failed'
- Storage errors logged to console

## Notes

- Photos are stored by photoId (not full paths)
- Both selfies and generated images use same storage structure
- History view loads 20 photos at a time
- Timer is cosmetic (generation time varies)
- Edit creates new photo doc, doesn't modify original

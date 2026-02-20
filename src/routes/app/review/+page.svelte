<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import type { Photo } from '$lib/types';
	import { db } from '$lib/client/firebase';
	import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { X, RefreshCw, Download, Pencil } from '@lucide/svelte';
	import Balls from '$lib/components/Balls.svelte';
	import TextInputModal from '$lib/components/TextInputModal.svelte';
	import { Spring } from 'svelte/motion';
	import { screenTitle, generationStartTime, photosInCount, fullSreen } from '$lib/stores/app';

	screenTitle.set('Loading...');
	afterNavigate(() => {
		fullSreen.set(true);
	});

	// Local state
	let photoQueue = $state<Photo[]>([]);
	let currentPhoto = $state<Photo | null>(null);
	let currentImageLoaded = $state(false);

	// Track animating cards separately
	let animatingCards = $state<
		Array<{
			photo: Photo;
			coords: Spring<{ x: number; y: number }>;
			direction: 'left' | 'right';
		}>
	>([]);

	// Get the next photo in queue (for preview behind current card)
	let nextPhoto = $derived(photoQueue.length > 0 ? photoQueue[photoQueue.length - 1] : null);

	// Swipe state
	let isDragging = $state(false);
	let startX = $state(0);
	let startY = $state(0);

	// Spring for smooth card movement
	const coords = new Spring({ x: 0, y: 0 }, { stiffness: 0.1, damping: 0.9 });

	// Swipe threshold (pixels)
	const SWIPE_THRESHOLD = 100;

	// Derived rotation based on x position
	let rotation = $derived(coords.current.x * 0.1);

	// Icon opacity based on swipe distance (0 to 1)
	let swipeOpacity = $derived(Math.min(1, Math.abs(coords.current.x) / SWIPE_THRESHOLD));

	function goToError(title: string, message: string) {
		goto(`/error?title=${encodeURIComponent(title)}&message=${encodeURIComponent(message)}`);
	}

	onMount(() => {
		const timeout = setTimeout(() => {
			if (!currentPhoto) {
				goToError('Timed out', 'Generation took too long. Please try again.');
			}
		}, 120_000);

		const errorQ = query(
			collection(db, 'photos'),
			where('userId', '==', page.data.user.id),
			where('action', '==', 'error')
		);
		const unsubscribeError = onSnapshot(errorQ, (snapshot) => {
			for (const change of snapshot.docChanges()) {
				if (change.type === 'added') {
					const data = change.doc.data();
					if (data.createdAt >= $generationStartTime && !currentPhoto) {
						goToError(data.title ?? 'Generation failed', data.message ?? 'Please try again.');
					}
				}
			}
		});

		const q = query(
			collection(db, 'photos'),
			where('userId', '==', page.data.user.id),
			where('action', '==', null)
		);
		const unsubscribe = onSnapshot(q, async (snapshot) => {
			const changes = snapshot.docChanges();

			for (const change of changes) {
				if (change.type === 'added') {
					const photoData = {
						id: change.doc.id,
						...change.doc.data()
					} as Photo;

					if (photoData.createdAt < $generationStartTime) {
						$photosInCount++;
					}

					// Preload image
					const img = new Image();
					img.src = photoData.url;

					if (!currentPhoto) {
						currentPhoto = photoData;
						currentImageLoaded = false;
					} else {
						photoQueue.push(photoData);
					}
					screenTitle.set('Review photos');
				}
			}
		});

		return () => {
			clearTimeout(timeout);
			unsubscribe();
			unsubscribeError();
		};
	});

	function moveToNextPhoto() {
		// Reset spring position instantly for new card
		coords.set({ x: 0, y: 0 }, { instant: true });
		currentImageLoaded = false;
		currentPhoto = photoQueue.pop() ?? null;

		if ($photosInCount <= 0 && currentPhoto === null) {
			goto('/app');
		}
	}

	function savePhotoAction(photo: Photo, action: 'saved' | 'discarded') {
		updateDoc(doc(db, 'photos', photo.id), { action });
	}

	function downloadPhotoFile(photo: Photo) {
		const xhr = new XMLHttpRequest();
		xhr.responseType = 'blob';
		xhr.onload = () => {
			const blob = xhr.response;
			const blobUrl = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = blobUrl;
			link.download = `manblink-${photo.id}.jpg`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(blobUrl);
		};
		xhr.open('GET', photo.url);
		xhr.send();
	}

	let showEditModal = $state(false);
	let showRetryModal = $state(false);
	let retryValue = $state(''); // captured when Retry is tapped, before modal mounts

	async function handleEdit(prompt: string) {
		if (!currentPhoto) return;
		const photoUrl = currentPhoto.url;
		$photosInCount++;
		animateSwipe('left');
		await fetch('/api/generate', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ promptTexts: [prompt], selfieUrl: photoUrl })
		});
	}

	async function handleRetry(prompt: string) {
		if (!currentPhoto) return;
		const selfieUrl = currentPhoto.inputPhotoUrl;
		$photosInCount++;
		animateSwipe('left');
		await fetch('/api/generate', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ promptTexts: [prompt], selfieUrl })
		});
	}

	// Swipe with animation - now non-blocking
	async function animateSwipe(direction: 'left' | 'right') {
		if (!currentPhoto) return;

		// Capture the photo and current position before moving to next
		const photoToProcess = currentPhoto;
		const animatingSpring = new Spring(
			{ x: coords.current.x, y: coords.current.y },
			{ stiffness: 0.1, damping: 3 }
		);

		// Add to animating cards array
		const animatingCard = {
			photo: photoToProcess,
			coords: animatingSpring,
			direction
		};
		animatingCards.push(animatingCard);

		// Process the photo immediately
		$photosInCount--;
		if (direction === 'right') {
			savePhotoAction(photoToProcess, 'saved');
			downloadPhotoFile(photoToProcess);
		} else {
			savePhotoAction(photoToProcess, 'discarded');
		}

		// Move to next photo immediately (buttons become available)
		moveToNextPhoto();

		// Animate the old card off-screen in the background
		const distance = Math.max(window.innerWidth, window.innerHeight);
		const targetX = direction === 'left' ? -distance : distance;
		await animatingSpring.set({ x: targetX, y: 0 });

		// Remove from animating cards after animation completes
		animatingCards = animatingCards.filter((card) => card !== animatingCard);
	}

	// Touch handlers
	function handleTouchStart(e: TouchEvent) {
		if (!currentPhoto) return;
		isDragging = true;
		startX = e.touches[0].clientX;
		startY = e.touches[0].clientY;
	}

	function handleTouchMove(e: TouchEvent) {
		if (!isDragging) return;

		const currentX = e.touches[0].clientX;
		const currentY = e.touches[0].clientY;
		const deltaX = currentX - startX;
		const deltaY = currentY - startY;

		// Prevent page scroll when swiping horizontally
		if (Math.abs(deltaX) > Math.abs(deltaY) && e.cancelable) {
			e.preventDefault();
		}

		// Always update position to follow finger
		coords.set({ x: deltaX, y: deltaY * 0.3 }, { instant: true });
	}

	function handleTouchEnd() {
		if (!isDragging) return;
		isDragging = false;

		const currentX = coords.current.x;

		if (currentX > SWIPE_THRESHOLD) {
			// Swipe right - save
			animateSwipe('right');
		} else if (currentX < -SWIPE_THRESHOLD) {
			// Swipe left - discard
			animateSwipe('left');
		} else {
			// Snap back
			coords.set({ x: 0, y: 0 });
		}
	}

	// Action to attach non-passive touch event
	function swipeable(node: HTMLElement) {
		node.addEventListener('touchmove', handleTouchMove, { passive: false });

		return {
			destroy() {
				node.removeEventListener('touchmove', handleTouchMove);
			}
		};
	}
</script>

<TextInputModal
	bind:show={showEditModal}
	placeholder="What do you want to edit?"
	submitLabel="Edit"
	onsubmit={(prompt) => handleEdit(prompt)}
/>

<TextInputModal
	bind:show={showRetryModal}
	bind:value={retryValue}
	placeholder="Describe the scene"
	submitLabel="Retry"
	onsubmit={(prompt) => handleRetry(prompt)}
/>

<div class="flex justify-center">
	<div class="flex w-full max-w-md flex-col space-y-8 text-center">
		{#if currentPhoto}
			<div class="w-full space-y-4">
				<!-- Card stack container -->
				<div class="relative aspect-3/4 w-full">
					<!-- Next photo (behind) -->
					{#if nextPhoto}
						<div class="absolute inset-0 overflow-hidden rounded-xl bg-stone-100">
							<img
								src={nextPhoto.url}
								alt="Next"
								class="pointer-events-none h-full w-full rounded-xl object-cover select-none"
								draggable="false"
							/>
						</div>
					{/if}

					<!-- Animating cards (flying off screen) -->
					{#each animatingCards as card (card.photo.id)}
						<div
							class="pointer-events-none absolute inset-0 overflow-hidden rounded-xl bg-stone-100"
							style="transform: translateX({card.coords.current.x}px) translateY({card.coords
								.current.y}px) rotate({card.coords.current.x * 0.1}deg); z-index: 10;"
						>
							<img
								src={card.photo.url}
								alt="Animating"
								class="h-full w-full rounded-xl object-cover select-none"
								draggable="false"
							/>

							<!-- Swipe indicators on animating cards -->
							{#if card.direction === 'right'}
								<div class="absolute top-4 left-4">
									<Download class="size-32 text-rose-500" strokeWidth={3} />
								</div>
							{:else}
								<div class="absolute top-4 right-4">
									<X class="size-32 text-rose-500" strokeWidth={3} />
								</div>
							{/if}
						</div>
					{/each}

					<!-- Current swipeable card -->
					<div
						use:swipeable
						ontouchstart={handleTouchStart}
						ontouchend={handleTouchEnd}
						class="absolute inset-0 touch-pan-y overflow-hidden rounded-xl bg-stone-100"
						style="transform: translateX({coords.current.x}px) translateY({coords.current
							.y}px) rotate({rotation}deg);"
					>
						<img
							src={currentPhoto.url}
							alt="Generated"
							class="pointer-events-none h-full w-full rounded-xl object-cover transition-opacity duration-200 select-none"
							onload={() => (currentImageLoaded = true)}
							class:opacity-0={!currentImageLoaded}
							class:opacity-100={currentImageLoaded}
							draggable="false"
						/>

						<!-- Swipe indicators -->
						{#if coords.current.x > 0}
							<div class="absolute top-4 left-4" style="opacity: {swipeOpacity};">
								<Download class="size-32 text-rose-500" strokeWidth={3} />
							</div>
						{:else if coords.current.x < 0}
							<div class="absolute top-4 right-4" style="opacity: {swipeOpacity};">
								<X class="size-32 text-rose-500" strokeWidth={3} />
							</div>
						{/if}
					</div>
				</div>

				<!-- Action buttons -->
				<div class="flex w-full space-x-4">
					<button
						onclick={() => animateSwipe('left')}
						class="flex h-16 grow cursor-pointer items-center justify-center rounded-xl bg-stone-200 hover:bg-stone-300"
						title="Discard"
					>
						<X class="size-6" strokeWidth={3} />
					</button>

					<button
						onclick={() => {
							retryValue = currentPhoto?.promptText ?? '';
							showRetryModal = true;
						}}
						class="flex h-16 grow cursor-pointer items-center justify-center rounded-xl bg-stone-200 hover:bg-stone-300"
						title="Retry"
					>
						<RefreshCw class="size-6" strokeWidth={3} />
					</button>

					<button
						onclick={() => (showEditModal = true)}
						class="flex h-16 grow cursor-pointer items-center justify-center rounded-xl bg-stone-200 hover:bg-stone-300"
						title="Edit"
					>
						<Pencil class="size-6" strokeWidth={3} />
					</button>

					<button
						onclick={() => animateSwipe('right')}
						class="flex h-16 grow cursor-pointer items-center justify-center rounded-xl bg-rose-500 text-white hover:bg-rose-600"
						title="Download"
					>
						<Download class="size-6" strokeWidth={3} />
					</button>
				</div>
			</div>
		{:else}
			<div class="flex h-64 items-center justify-center">
				<Balls />
			</div>
		{/if}
	</div>
</div>

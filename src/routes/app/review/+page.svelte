<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import type { Photo } from '$lib/types';
	import { db } from '$lib/client/firebase';
	import { doc, updateDoc, getDoc } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { X, RefreshCw, Download, Pencil } from '@lucide/svelte';
	import TextInputModal from '$lib/components/TextInputModal.svelte';
	import { Spring } from 'svelte/motion';
	import { screenTitle, fullSreen, bottomBar, generatedPhotoIds } from '$lib/stores/app';

	screenTitle.set('Review');

	afterNavigate(() => {
		fullSreen.set(true);
	});

	let photoQueue = $state<Photo[]>([]);
	let currentPhoto = $state<Photo | null>(null);
	let currentImageLoaded = $state(false);

	let animatingCards = $state<
		Array<{
			id: number;
			photo: Photo;
			coords: Spring<{ x: number; y: number }>;
			direction: 'left' | 'right';
		}>
	>([]);

	let nextPhoto = $derived(photoQueue.length > 0 ? photoQueue[photoQueue.length - 1] : null);

	let isDragging = $state(false);
	let startX = $state(0);
	let startY = $state(0);

	const coords = new Spring({ x: 0, y: 0 }, { stiffness: 0.1, damping: 0.9 });

	const SWIPE_THRESHOLD = 100;

	let rotation = $derived(coords.current.x * 0.1);
	let swipeOpacity = $derived(Math.min(1, Math.abs(coords.current.x) / SWIPE_THRESHOLD));

	onMount(async () => {
		const ids = $generatedPhotoIds;
		if (!ids.length) {
			goto('/app');
			return;
		}

		generatedPhotoIds.set([]);

		const snapshots = await Promise.all(ids.map((id) => getDoc(doc(db, 'photos', id))));
		const photos = snapshots
			.filter((snap) => snap.exists())
			.map((snap) => ({ id: snap.id, ...snap.data() } as Photo));

		if (!photos.length) {
			goto('/app');
			return;
		}

		currentPhoto = photos[0];
		currentImageLoaded = false;
		// reverse so pop() gives photos in original order
		photoQueue = photos.slice(1).reverse();
	});

	function moveToNextPhoto() {
		coords.set({ x: 0, y: 0 }, { instant: true });
		currentImageLoaded = false;
		const next = photoQueue.pop();
		if (next === undefined) {
			goto('/app');
			return;
		}
		currentPhoto = next;
	}

	function savePhoto(photo: Photo) {
		updateDoc(doc(db, 'photos', photo.id), { action: 'saved' });
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
	let retryValue = $state('');

	async function handleEdit(prompt: string) {
		if (!currentPhoto) return;
		// const photoUrl = currentPhoto.url;
		animateSwipe('left');
		// TODO: await fetch('/api/generate', {
		// 	method: 'POST',
		// 	headers: { 'Content-Type': 'application/json' },
		// 	body: JSON.stringify({ prompts: [{ text: prompt, isCustom: true }], selfieUrl: photoUrl })
		// }); then getDoc new IDs and push to queue
	}

	async function handleRetrySubmit(prompt: string) {
		if (!currentPhoto) return;
		// const selfieUrl = currentPhoto.inputPhotoUrl;
		animateSwipe('left');
		// TODO: await fetch('/api/generate', {
		// 	method: 'POST',
		// 	headers: { 'Content-Type': 'application/json' },
		// 	body: JSON.stringify({ prompts: [{ text: prompt, isCustom: true }], selfieUrl })
		// }); then getDoc new IDs and push to queue
	}

	function handleRetry() {
		if (!currentPhoto) return;
		if (currentPhoto.isCustom) {
			retryValue = currentPhoto.originalPrompt ?? currentPhoto.promptText;
			showRetryModal = true;
			return;
		}
		// const selfieUrl = currentPhoto.inputPhotoUrl;
		// const prompt = currentPhoto.originalPrompt ?? currentPhoto.promptText;
		animateSwipe('left');
		// TODO: fetch('/api/generate', {
		// 	method: 'POST',
		// 	headers: { 'Content-Type': 'application/json' },
		// 	body: JSON.stringify({ prompts: [{ text: prompt, isCustom: false }], selfieUrl })
		// }); then getDoc new IDs and push to queue
	}

	async function animateSwipe(direction: 'left' | 'right') {
		if (!currentPhoto) return;

		const photoToProcess = currentPhoto;
		const animatingSpring = new Spring(
			{ x: coords.current.x, y: coords.current.y },
			{ stiffness: 0.1, damping: 3 }
		);

		const cardId = Math.random();
		animatingCards.push({
			id: cardId,
			photo: photoToProcess,
			coords: animatingSpring,
			direction
		});

		if (direction === 'right') {
			savePhoto(photoToProcess);
			downloadPhotoFile(photoToProcess);
		}
		// swipe left: action stays null (treated as discarded in history)

		moveToNextPhoto();

		const distance = Math.max(window.innerWidth, window.innerHeight);
		const targetX = direction === 'left' ? -distance : distance;
		await animatingSpring.set({ x: targetX, y: 0 });

		animatingCards = animatingCards.filter((card) => card.id !== cardId);
	}

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
		if (Math.abs(deltaX) > Math.abs(deltaY) && e.cancelable) {
			e.preventDefault();
		}
		coords.set({ x: deltaX, y: deltaY * 0.3 }, { instant: true });
	}

	function handleTouchEnd() {
		if (!isDragging) return;
		isDragging = false;
		const currentX = coords.current.x;
		if (currentX > SWIPE_THRESHOLD) {
			animateSwipe('right');
		} else if (currentX < -SWIPE_THRESHOLD) {
			animateSwipe('left');
		} else {
			coords.set({ x: 0, y: 0 });
		}
	}

	function swipeable(node: HTMLElement) {
		node.addEventListener('touchmove', handleTouchMove, { passive: false });
		return {
			destroy() {
				node.removeEventListener('touchmove', handleTouchMove);
			}
		};
	}

	$effect(() => {
		bottomBar.set([
			{
				label: 'Discard',
				onclick: () => animateSwipe('left'),
				variant: 'secondary'
			},
			{
				label: 'Save',
				onclick: () => animateSwipe('right')
			}
		]);
		return () => bottomBar.set(null);
	});
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
	onsubmit={(prompt) => handleRetrySubmit(prompt)}
/>

<div class="flex justify-center">
	<div class="flex w-full max-w-md flex-col space-y-8">
		{#if currentPhoto}
			<div class="w-full space-y-4">
				<div class="relative aspect-3/4 w-full">
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

					{#each animatingCards as card (card.id)}
						<div
							class="pointer-events-none absolute inset-0 overflow-hidden rounded-xl bg-stone-100"
							style="transform: translateX({card.coords.current.x}px) translateY({card.coords.current.y}px) rotate({card.coords.current.x * 0.1}deg); z-index: 10;"
						>
							<img
								src={card.photo.url}
								alt="Animating"
								class="h-full w-full rounded-xl object-cover select-none"
								draggable="false"
							/>
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

					<div
						use:swipeable
						role="button"
						tabindex="0"
						aria-label="Photo card"
						ontouchstart={handleTouchStart}
						ontouchend={handleTouchEnd}
						class="absolute inset-0 touch-pan-y overflow-hidden rounded-xl bg-stone-100"
						style="transform: translateX({coords.current.x}px) translateY({coords.current.y}px) rotate({rotation}deg);"
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
			</div>
		{/if}
	</div>
</div>

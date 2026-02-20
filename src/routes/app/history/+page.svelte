<script lang="ts">
	import type { Photo } from '$lib/types';
	import { db } from '$lib/client/firebase';
	import {
		collection,
		query,
		where,
		orderBy,
		limit,
		getDocs,
		startAfter,
		type QueryDocumentSnapshot
	} from 'firebase/firestore';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { X, Download } from '@lucide/svelte';
	import Balls from '$lib/components/Balls.svelte';
	import { fixedBar, screenTitle } from '$lib/stores/app';
	import { afterNavigate, beforeNavigate } from '$app/navigation';

	screenTitle.set('History');
	afterNavigate(() => {
		fixedBar.set(true);
	});

	let historyTab = $state<'saved' | 'discarded'>('saved');

	let savedPhotos = $state<Photo[]>([]);
	let discardedPhotos = $state<Photo[]>([]);

	let savedLastDoc = $state<QueryDocumentSnapshot | null>(null);
	let discardedLastDoc = $state<QueryDocumentSnapshot | null>(null);

	let savedHasMore = $state(false);
	let discardedHasMore = $state(false);

	let loading = $state(true);
	let loadingMore = $state(false);

	const PAGE_SIZE = 20;

	async function loadInitialPhotos() {
		// Load saved photos
		const savedQuery = query(
			collection(db, 'photos'),
			where('userId', '==', page.data.user.id),
			where('action', '==', 'saved'),
			orderBy('createdAt', 'desc'),
			limit(PAGE_SIZE)
		);

		const savedSnapshot = await getDocs(savedQuery);
		savedPhotos = savedSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Photo[];
		savedLastDoc = savedSnapshot.docs[savedSnapshot.docs.length - 1] || null;
		savedHasMore = savedSnapshot.docs.length === PAGE_SIZE;

		// Load discarded photos
		const discardedQuery = query(
			collection(db, 'photos'),
			where('userId', '==', page.data.user.id),
			where('action', '==', 'discarded'),
			orderBy('createdAt', 'desc'),
			limit(PAGE_SIZE)
		);

		const discardedSnapshot = await getDocs(discardedQuery);
		discardedPhotos = discardedSnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data()
		})) as Photo[];
		discardedLastDoc = discardedSnapshot.docs[discardedSnapshot.docs.length - 1] || null;
		discardedHasMore = discardedSnapshot.docs.length === PAGE_SIZE;

		loading = false;
	}

	async function loadMore() {
		loadingMore = true;

		const lastDoc = historyTab === 'saved' ? savedLastDoc : discardedLastDoc;

		const q = query(
			collection(db, 'photos'),
			where('userId', '==', page.data.user.id),
			where('action', '==', historyTab),
			orderBy('createdAt', 'desc'),
			limit(PAGE_SIZE),
			startAfter(lastDoc)
		);

		const snapshot = await getDocs(q);
		const newPhotos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Photo[];

		if (historyTab === 'saved') {
			savedPhotos = [...savedPhotos, ...newPhotos];
			savedLastDoc = snapshot.docs[snapshot.docs.length - 1] || null;
			savedHasMore = snapshot.docs.length === PAGE_SIZE;
		} else {
			discardedPhotos = [...discardedPhotos, ...newPhotos];
			discardedLastDoc = snapshot.docs[snapshot.docs.length - 1] || null;
			discardedHasMore = snapshot.docs.length === PAGE_SIZE;
		}

		loadingMore = false;
	}

	onMount(() => {
		loadInitialPhotos();
	});

	// Derived values based on current tab
	let displayedPhotos = $derived(historyTab === 'saved' ? savedPhotos : discardedPhotos);
	let hasMore = $derived(historyTab === 'saved' ? savedHasMore : discardedHasMore);

	function handleDownload(photo: Photo) {
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

	console.log('History page mounted');
</script>

<div class="flex justify-center">
	<div class="flex w-full max-w-md flex-col space-y-8">
		<div class="flex gap-8">
			<button
				onclick={() => (historyTab = 'saved')}
				class="flex h-16 flex-1 cursor-pointer items-center justify-center rounded-xl font-bold outline-8"
				class:outline={historyTab === 'saved'}
				class:outline-rose-500={historyTab === 'saved'}
				class:outline-stone-200={historyTab !== 'saved'}
				class:hover:outline-stone-300={historyTab !== 'saved'}
			>
				<Download class="size-6" strokeWidth={3} />
			</button>
			<button
				onclick={() => (historyTab = 'discarded')}
				class="flex h-16 flex-1 cursor-pointer items-center justify-center rounded-xl font-bold outline-8"
				class:outline={historyTab === 'discarded'}
				class:outline-rose-500={historyTab === 'discarded'}
				class:outline-stone-200={historyTab !== 'discarded'}
				class:hover:outline-stone-300={historyTab !== 'discarded'}
			>
				<X class="size-6" strokeWidth={3} />
			</button>
		</div>

		{#if loading}
			<div class="flex h-64 items-center justify-center">
				<Balls />
			</div>
		{:else}
			<div class="space-y-8">
				{#each displayedPhotos as photo (photo.id)}
					<div class="space-y-2">
						<button
							onclick={() => handleDownload(photo)}
							class="aspect-3/4 w-full cursor-pointer overflow-hidden rounded-xl outline-8 outline-transparent hover:outline-stone-300"
						>
							<img
								src={photo.url}
								alt="Generated"
								class="h-full w-full bg-stone-100 object-cover"
							/>
						</button>
						{#if photo.promptText}
							<p class="">{photo.promptText}</p>
						{/if}
					</div>
				{:else}
					<div class="flex h-64 items-center justify-center text-center">
						<div class="text-3xl font-bold text-stone-300">Empty</div>
					</div>
				{/each}
			</div>
		{/if}

		{#if hasMore}
			<button
				onclick={loadMore}
				disabled={loadingMore}
				class="h-16 w-full cursor-pointer rounded-xl bg-stone-200 px-4 font-bold text-stone-700 hover:bg-stone-300 disabled:cursor-default disabled:bg-stone-100 disabled:text-stone-300"
			>
				More
			</button>
		{/if}
	</div>
</div>

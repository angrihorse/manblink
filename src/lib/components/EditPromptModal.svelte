<script lang="ts">
	import type { Photo } from '$lib/types';
	import { X } from '@lucide/svelte';
	import { db } from '$lib/client/firebase';
	import { doc, updateDoc, addDoc, collection } from 'firebase/firestore';
	import { page } from '$app/state';

	// Props
	let {
		show = $bindable(),
		photo,
		onClose
	}: {
		show: boolean;
		photo: Photo | null;
		onClose: () => void;
	} = $props();

	let editedPromptText = $state('');
	let submitting = $state(false);

	// Initialize with current prompt when modal opens
	$effect(() => {
		if (show && photo) {
			editedPromptText = photo.promptText;
		}
	});

	async function handleSave() {
		if (!editedPromptText.trim() || !photo) return;

		submitting = true;

		// Update current photo to 'edit' status (will hide it)
		await updateDoc(doc(db, 'photos', photo.id), { status: 'edit' });

		// Create new photo doc with edited prompt
		await addDoc(collection(db, 'photos'), {
			userId: page.data.user.id,
			status: 'new',
			promptText: editedPromptText.trim(),
			inputPhotoId: photo.inputPhotoId,
			parentId: photo.id,
			createdAt: Date.now()
		});

		// Close modal
		show = false;
		onClose();
	}

	function handleClose() {
		show = false;
		onClose();
	}
</script>

{#if show && photo}
	<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
		<div class="w-full max-w-md space-y-4 rounded-xl bg-white p-8">
			<div class="flex items-center justify-between">
				<div class="text-3xl font-bold">Edit prompt</div>
				<button onclick={handleClose} class="text-stone-400 hover:text-stone-600">
					<X class="size-6" />
				</button>
			</div>

			<textarea
				bind:value={editedPromptText}
				class="h-48 w-full rounded-xl bg-stone-200 p-4 font-bold outline-none focus:ring-4 focus:ring-rose-500"
				placeholder="Edit your prompt..."
			></textarea>

			<div class="flex space-x-4">
				<button
					onclick={handleClose}
					disabled={submitting}
					class="h-16 flex-1 rounded-xl bg-stone-200 font-bold hover:bg-stone-300 disabled:bg-stone-200"
				>
					Cancel
				</button>
				<button
					onclick={handleSave}
					disabled={!editedPromptText.trim() || submitting}
					class="h-16 flex-1 rounded-xl bg-rose-500 font-bold text-white hover:bg-rose-600 disabled:bg-stone-300"
				>
					{submitting ? 'Saving...' : 'Retry'}
				</button>
			</div>
		</div>
	</div>
{/if}

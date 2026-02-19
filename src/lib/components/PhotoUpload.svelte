<script lang="ts">
	import { User } from '@lucide/svelte';
	import type { Writable } from 'svelte/store';

	// Props
	let {
		uploadedSelfieBase64
	}: {
		uploadedSelfieBase64: Writable<string | null>;
	} = $props();

	let isDragging = $state(false);
	let fileInput: HTMLInputElement;
	let activeAvatarUrl = $state<string | null>(null);

	async function processFile(file: File) {
		if (file && file.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const dataUrl = e.target?.result as string;
				$uploadedSelfieBase64 = dataUrl;
			};
			reader.readAsDataURL(file);
		}
	}

	function handleFileSelect(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) processFile(file);
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		const file = e.dataTransfer?.files[0];
		if (file) processFile(file);
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
	}

	function triggerFileInput() {
		fileInput.click();
	}
</script>

<button
	type="button"
	onclick={triggerFileInput}
	ondrop={handleDrop}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	class="flex w-full max-w-md cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl bg-stone-200 outline-8 outline-stone-700 outline-dotted hover:bg-stone-300"
	class:py-8={!$uploadedSelfieBase64}
	class:aspect-square={$uploadedSelfieBase64}
	class:bg-stone-300={isDragging}
>
	<input
		bind:this={fileInput}
		type="file"
		accept="image/*"
		class="hidden"
		onchange={handleFileSelect}
	/>
	{#if $uploadedSelfieBase64}
		<img src={$uploadedSelfieBase64} alt="Uploaded selfie" class="h-full w-full object-cover" />
	{:else if activeAvatarUrl}
		<img src={activeAvatarUrl} alt="Active avatar" class="h-full w-full object-cover" />
	{:else}
		<div class="flex flex-col items-center space-y-2 select-none">
			<User class="size-8" strokeWidth={3} />
			<span class="font-bold">Upload Selfie</span>
		</div>
	{/if}
</button>

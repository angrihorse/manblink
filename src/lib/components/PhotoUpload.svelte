<script lang="ts">
	import { User } from '@lucide/svelte';

	let {
		uploadedImage = $bindable<string | null>(null)
	}: {
		uploadedImage?: string | null;
	} = $props();

	let isDragging = $state(false);
	let fileInput: HTMLInputElement;

	function processFile(file: File) {
		if (file && file.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onload = (e) => {
				uploadedImage = e.target?.result as string;
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
	class="flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-4 border-stone-700 bg-stone-200 hover:bg-stone-300"
	class:border-dotted={!uploadedImage}
	class:p-8={!uploadedImage}
	class:bg-stone-300={isDragging}
>
	<input
		bind:this={fileInput}
		type="file"
		accept="image/*"
		class="hidden"
		onchange={handleFileSelect}
	/>
	{#if uploadedImage}
		<img src={uploadedImage} alt="Uploaded selfie" class="h-full w-full object-cover" />
	{:else}
		<div class="flex flex-col items-center space-y-2 select-none">
			<User class="size-8" />
			<span class="font-bold">Upload Selfie</span>
		</div>
	{/if}
</button>

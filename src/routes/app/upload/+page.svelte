<script lang="ts">
	import { goto } from '$app/navigation';
	import { User } from '@lucide/svelte';
	import {
		screenTitle,
		selectedPrompts,
		uploadedSelfieBase64,
		generationStartTime,
		photosInCount
	} from '$lib/stores/app';

	screenTitle.set('Upload selfie');

	let isDragging = $state(false);
	let fileInput: HTMLInputElement;

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

	async function handleGetPhotos() {
		if (!$uploadedSelfieBase64 || $selectedPrompts.length === 0) return;

		$generationStartTime = Date.now();
		$photosInCount = $selectedPrompts.length;

		const res = await fetch('/api/generate', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				promptTexts: $selectedPrompts.map((p) => p.text),
				selfieBase64: $uploadedSelfieBase64
			})
		});

		if (!res.ok) {
			const body = await res.json();
			const title = `${res.status} ${res.statusText}`;
			const message = body.error ?? 'Something went wrong. Please try again.';
			goto(`/error?title=${encodeURIComponent(title)}&message=${encodeURIComponent(message)}`);
			return;
		}

		goto('/app/review');
	}
</script>

<div class="flex justify-center">
	<div class="flex w-full max-w-md flex-col space-y-8 text-center">
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
			{:else}
				<div class="flex flex-col items-center space-y-2 select-none">
					<User class="size-8" strokeWidth={3} />
					<span class="font-bold">Upload Selfie</span>
				</div>
			{/if}
		</button>

		<div class="flex max-w-md flex-wrap gap-4">
			<button
				onclick={handleGetPhotos}
				disabled={!$uploadedSelfieBase64}
				class="h-16 grow cursor-pointer rounded-xl bg-rose-500 px-4 font-bold text-white hover:bg-rose-600 disabled:cursor-default disabled:bg-stone-100 disabled:text-stone-300"
			>
				Launch
			</button>
		</div>

	</div>
</div>

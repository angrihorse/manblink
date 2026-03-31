<script lang="ts">
	import { goto } from '$app/navigation';
	import { User } from '@lucide/svelte';
	import {
		selectedPrompts,
		uploadedSelfieBase64,
		userCredits,
		navStepsTotal,
		navCurrentStep,
		navDirection,
		bottomBar
	} from '$lib/stores/app';

	$effect(() => {
		if ($navStepsTotal !== null) navCurrentStep.set($navStepsTotal - 1);
	});

	$effect(() => {
		bottomBar.set([
			{
				label: 'Launch',
				onclick: handleGetPhotos,
				disabled: !$uploadedSelfieBase64,
				variant: 'primary'
			}
		]);
	});

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

	function handleGetPhotos() {
		if (!$uploadedSelfieBase64 || $selectedPrompts.length === 0) return;

		if (($userCredits ?? 0) < $selectedPrompts.length) {
			navDirection.set('forward');
			goto('/app/topup');
			return;
		}

		navDirection.set('forward');
		goto('/app/loading');
	}
</script>

<div class="flex justify-center">
	<div class="flex w-full max-w-md flex-col space-y-4">
		<div class="space-y-2">
			<div class="text-3xl font-bold">Upload selfie</div>
			<div class="grid grid-cols-2">
				<ul class="list-disc pl-5">
					<li>Face the camera</li>
					<li>Good lighting</li>
				</ul>
				<ul class="list-disc pl-5">
					<li>No sunglasses</li>
					<li>No filters</li>
				</ul>
			</div>
		</div>
		<button
			type="button"
			onclick={triggerFileInput}
			ondrop={handleDrop}
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			class="flex w-full max-w-md cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-8 border-dotted border-stone-700 bg-stone-200 hover:bg-stone-300"
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
					<User class="size-6" strokeWidth={3} />
					<span class="font-bold">Upload Selfie</span>
				</div>
			{/if}
		</button>
	</div>
</div>

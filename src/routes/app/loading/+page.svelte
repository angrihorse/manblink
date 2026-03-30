<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import {
		selectedPrompts,
		uploadedSelfieBase64,
		navStepsTotal,
		navCurrentStep,
		generatedPhotoIds,
		bottomBar,
		screenTitle
	} from '$lib/stores/app';

	bottomBar.set(null);

	screenTitle.set('Loading');

	onMount(async () => {
		const prompts = $selectedPrompts;
		const selfie = $uploadedSelfieBase64;

		if (!prompts.length || !selfie) {
			goto('/app');
			return;
		}

		selectedPrompts.set([]);
		navStepsTotal.set(null);
		navCurrentStep.set(null);

		const res = await fetch('/api/generate', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				prompts: prompts.map((p) => ({ text: p.text, isCustom: p.isCustom ?? false })),
				selfieBase64: selfie
			})
		});

		if (!res.ok) {
			goto('/app');
			return;
		}

		const { photoIds } = await res.json();
		generatedPhotoIds.set(photoIds ?? []);
		goto('/app/review');
	});
</script>

<div class="flex justify-center">
	<div class="flex w-full max-w-md flex-col space-y-8">
		<div class="space-y-2">
			<div class="text-3xl font-bold">Your photos are being generated</div>
			<p class="text-stone-500">
				This takes 3–7 minutes. You'll be taken to your photos when ready.
			</p>
		</div>
	</div>
</div>

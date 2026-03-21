<script lang="ts">
	import { goto } from '$app/navigation';
	import { DEFAULT_PROMPTS } from '$lib/types';
	import type { Prompt } from '$lib/types';
	import { customRender, authLoading } from '$lib/client/firebase';

	import { screenTitle, selectedPrompts } from '$lib/stores/app';
	import TextInputModal from '$lib/components/TextInputModal.svelte';

	screenTitle.set('Pick scenes');

	let availablePrompts = $state<Prompt[]>(DEFAULT_PROMPTS);
	let showCustomInput = $state(false);

	function addCustomPrompt(text: string) {
		const newPrompt: Prompt = {
			id: Date.now().toString(),
			label: text.slice(0, 20),
			text,
			isCustom: true
		};
		$selectedPrompts = [...$selectedPrompts, newPrompt];
		availablePrompts = [...availablePrompts, newPrompt];
	}

	function isPromptSelected(index: number): boolean {
		const prompt = availablePrompts[index];
		return $selectedPrompts.some((p: Prompt) => p.id === prompt.id);
	}

	function toggleDefaultPrompt(index: number) {
		const prompt = availablePrompts[index];
		const existingIndex = $selectedPrompts.findIndex((p: Prompt) => p.id === prompt.id);
		if (existingIndex >= 0) {
			$selectedPrompts = $selectedPrompts.filter((_, i) => i !== existingIndex);
		} else {
			$selectedPrompts = [...$selectedPrompts, prompt];
		}
	}
</script>

<TextInputModal
	bind:show={showCustomInput}
	placeholder="Describe the scene"
	onsubmit={(text) => {
		addCustomPrompt(text);
		customRender.set(false);
	}}
	oncancel={() => {
		customRender.set(false);
	}}
/>

<div class="space-y-4">
	<div class="flex flex-col items-center space-y-4">
		<div class="grid w-full max-w-md grid-cols-3 gap-4">
			{#each availablePrompts as prompt, index}
				<button
					onclick={() => toggleDefaultPrompt(index)}
					class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl py-3 text-center font-bold"
					class:bg-stone-700={isPromptSelected(index)}
					class:text-white={isPromptSelected(index)}
					class:bg-stone-200={!isPromptSelected(index)}
					class:hover:bg-stone-300={!isPromptSelected(index)}
				>
					<div class="text-5xl">{prompt.emoji}</div>
					<div>{prompt.label ?? prompt.text}</div>
				</button>
			{/each}
		</div>
	</div>
</div>

<div
	class="fixed right-0 bottom-0 left-0 flex justify-center bg-white px-4 pt-4 pb-4 sm:px-8 md:px-12 lg:px-16 xl:px-32 2xl:px-64"
>
	<div class="flex w-full max-w-md flex-row gap-4">
		<button
			onclick={() => {
				showCustomInput = true;
				customRender.set(true);
			}}
			class="h-16 flex-1 cursor-pointer rounded-xl bg-stone-200 px-4 font-bold hover:bg-stone-300"
		>
			Add
		</button>
		<button
			onclick={() => goto('/app/upload')}
			disabled={$selectedPrompts.length === 0}
			class="h-16 flex-1 cursor-pointer rounded-xl bg-rose-500 px-4 font-bold text-white hover:bg-rose-600 disabled:cursor-default disabled:bg-stone-100 disabled:text-stone-300"
		>
			Next
		</button>
	</div>
</div>

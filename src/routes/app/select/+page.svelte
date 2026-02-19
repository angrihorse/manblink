<script lang="ts">
	import { goto } from '$app/navigation';
	import { DEFAULT_PROMPTS } from '$lib/types';
	import type { Prompt } from '$lib/types';
	import { customRender } from '$lib/client/firebase';
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
	onsubmit={(text) => { addCustomPrompt(text); customRender.set(false); }}
	oncancel={() => { customRender.set(false); }}
/>

<div class="space-y-8">
	<div class="flex flex-col items-center space-y-8">
		<div class="grid w-full max-w-md grid-cols-2 gap-8">
			{#each availablePrompts as prompt, index}
				<button
					onclick={() => toggleDefaultPrompt(index)}
					class="cursor-pointer rounded-xl p-2 text-left font-bold outline-8 sm:p-4"
					class:outline={isPromptSelected(index)}
					class:outline-rose-500={isPromptSelected(index)}
					class:hover:outline-rose-600={isPromptSelected(index)}
					class:outline-stone-200={!isPromptSelected(index)}
					class:hover:outline-stone-300={!isPromptSelected(index)}
				>
					{prompt.label ?? prompt.text}
				</button>
			{/each}
		</div>

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
</div>

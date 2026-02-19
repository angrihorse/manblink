<script lang="ts">
	import { goto } from '$app/navigation';
	import { DEFAULT_PROMPTS } from '$lib/types';
	import type { Prompt } from '$lib/types';
	import { customRender } from '$lib/client/firebase';
	import { screenTitle, selectedPrompts } from '$lib/stores/app';

	screenTitle.set('Pick scenes');

	// Local state
	let availablePrompts = $state<Prompt[]>(DEFAULT_PROMPTS);
	let customPromptText = $state('');
	let showCustomInput = $state(false);

	// Disable scroll when modal is open
	$effect(() => {
		if (showCustomInput) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	});

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

	function handleAddCustom() {
		if (customPromptText.trim()) {
			addCustomPrompt(customPromptText.trim());
			customPromptText = '';
		}
		showCustomInput = false;
		customRender.set(false);
	}

	function handleCancelCustom() {
		customPromptText = '';
		showCustomInput = false;
		customRender.set(false);
	}

	function handleTextInput(e: Event) {
		const target = e.target as HTMLTextAreaElement;
		customPromptText = target.value;
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

{#if showCustomInput}
	<div class="fixed inset-0 z-10 flex h-dvh items-center justify-center bg-white px-4">
		<div class="w-full max-w-md space-y-4">
			<textarea
				value={customPromptText}
				oninput={handleTextInput}
				placeholder="Describe the scene"
				class="h-32 w-full resize-none rounded-xl bg-stone-200 p-4 px-4 font-bold placeholder-stone-700 outline-none focus:ring-4 focus:ring-rose-500"
			></textarea>
			<div class="flex gap-4">
				<button
					onclick={handleCancelCustom}
					class="h-16 flex-1 cursor-pointer rounded-xl bg-stone-200 font-bold text-stone-800 hover:bg-stone-300"
				>
					Cancel
				</button>
				<button
					onclick={handleAddCustom}
					disabled={!customPromptText.trim()}
					class="h-16 flex-1 cursor-pointer rounded-xl bg-rose-500 font-bold text-white hover:bg-rose-600 disabled:cursor-default disabled:bg-stone-100 disabled:text-stone-300"
				>
					Save
				</button>
			</div>
		</div>
	</div>
{/if}

<div class="space-y-8">
	<div class="flex flex-wrap justify-center gap-8">
		{#each availablePrompts as prompt, index}
			<button
				onclick={() => toggleDefaultPrompt(index)}
				class="cursor-pointer rounded-xl px-4 py-4 text-left font-bold outline-8"
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

	<div class="flex justify-center">
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

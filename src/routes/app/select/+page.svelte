<script lang="ts">
	import { goto, afterNavigate } from '$app/navigation';
	import { DEFAULT_PROMPTS, PROMPT_CATEGORIES, FEATURED_IDS } from '$lib/types';
	import type { Prompt } from '$lib/types';
	import { customRender, authLoading } from '$lib/client/firebase';

	import {
		selectedPrompts,
		navStepsTotal,
		navCurrentStep,
		navDirection,
		bottomBar,
		screenTitle,
		navBackOverride
	} from '$lib/stores/app';

	afterNavigate(({ from, to }) => {
		if (to?.url.pathname !== '/app/select') return;
		if (from?.url.pathname === '/app/quiz') {
			navBackOverride.set(null);
		} else if (from?.url.pathname === '/app') {
			navBackOverride.set(() => {
				navDirection.set('backward');
				goto('/app');
			});
		}
	});
	import TextInputModal from '$lib/components/TextInputModal.svelte';

	$effect(() => {
		if ($navStepsTotal !== null) navCurrentStep.set($navStepsTotal - 2);
	});

	screenTitle.set('Pick Scenes');

	$effect(() => {
		bottomBar.set([
			{
				label: 'Add',
				onclick: () => {
					showCustomInput = true;
					customRender.set(true);
				},
				variant: 'secondary'
			},
			{
				label: 'Next',
				onclick: () => {
					navDirection.set('forward');
					goto('/app/upload');
				},
				disabled: $selectedPrompts.length === 0,
				variant: 'primary'
			}
		]);
	});

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

	function isSelected(prompt: Prompt): boolean {
		return $selectedPrompts.some((p) => p.id === prompt.id);
	}

	function togglePrompt(prompt: Prompt) {
		const existingIndex = $selectedPrompts.findIndex((p) => p.id === prompt.id);
		if (existingIndex >= 0) {
			$selectedPrompts = $selectedPrompts.filter((_, i) => i !== existingIndex);
		} else {
			$selectedPrompts = [...$selectedPrompts, prompt];
		}
	}

	const customPrompts = $derived(availablePrompts.filter((p) => p.isCustom));
	const featuredPrompts = $derived(
		FEATURED_IDS.map((id) => availablePrompts.find((p) => p.id === id)).filter((p) => p != null)
	);

	function promptsForCategory(category: string) {
		return availablePrompts.filter((p) => p.category === category);
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

<div class="flex flex-col items-center space-y-8">
	<div class="w-full max-w-md space-y-2">
		<div class="text-3xl font-bold">Which photos do you want?</div>
		<p class="text-stone-500">
			Picking something that you'd find yourself doing in real life works best.
		</p>
	</div>

	<div class="w-full max-w-md space-y-4">
		<div class="font-bold">Best for Tinder</div>
		<div class="grid grid-cols-3 gap-4">
			{#each featuredPrompts as prompt (prompt.id)}
				<button
					onclick={() => togglePrompt(prompt)}
					class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl py-3 text-center font-bold"
					class:bg-stone-700={isSelected(prompt)}
					class:text-white={isSelected(prompt)}
					class:bg-stone-200={!isSelected(prompt)}
					class:hover:bg-stone-300={!isSelected(prompt)}
				>
					<div class="text-5xl">{prompt.emoji}</div>
					<div>{prompt.label ?? prompt.text}</div>
				</button>
			{/each}
		</div>
	</div>

	{#each PROMPT_CATEGORIES as category}
		<div class="w-full max-w-md space-y-4">
			<div class="font-bold">{category}</div>
			<div class="grid grid-cols-3 gap-4">
				{#each promptsForCategory(category) as prompt (prompt.id)}
					<button
						onclick={() => togglePrompt(prompt)}
						class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl py-3 text-center font-bold"
						class:bg-stone-700={isSelected(prompt)}
						class:text-white={isSelected(prompt)}
						class:bg-stone-200={!isSelected(prompt)}
						class:hover:bg-stone-300={!isSelected(prompt)}
					>
						<div class="text-5xl">{prompt.emoji}</div>
						<div>{prompt.label ?? prompt.text}</div>
					</button>
				{/each}
			</div>
		</div>
	{/each}

	{#if customPrompts.length > 0}
		<div class="w-full max-w-md space-y-4">
			<div class="font-bold">Custom</div>
			<div class="grid grid-cols-3 gap-4">
				{#each customPrompts as prompt (prompt.id)}
					<button
						onclick={() => togglePrompt(prompt)}
						class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl py-3 text-center font-bold"
						class:bg-stone-700={isSelected(prompt)}
						class:text-white={isSelected(prompt)}
						class:bg-stone-200={!isSelected(prompt)}
						class:hover:bg-stone-300={!isSelected(prompt)}
					>
						<div class="text-5xl">✏️</div>
						<div>{prompt.label ?? prompt.text}</div>
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>

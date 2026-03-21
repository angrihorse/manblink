<script lang="ts">
	import { goto } from '$app/navigation';
	import { signInWithGoogle } from '$lib/client/firebase';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { onMount, onDestroy } from 'svelte';
	import { ThumbsUp, ThumbsDown, Star } from '@lucide/svelte';
	import { screenTitle, navProgress } from '$lib/stores/app';
	import { select, easeCubicOut } from 'd3';

	screenTitle.set('');

	onDestroy(() => {
		navProgress.set(null);
	});

	type StepType = 'choice' | 'info';

	type Option = { label: string; icon?: typeof ThumbsUp };

	type Step = {
		id: string;
		type: StepType;
		question: string;
		options?: Option[];
		replyText?: string;
		showChart?: boolean;
	};

	const steps: Step[] = [
		{
			id: 'gender',
			type: 'choice',
			question: 'Choose your gender',
			options: [{ label: 'Female' }, { label: 'Male' }]
		},
		{
			id: 'frequency',
			type: 'choice',
			question: 'How often do you go on dates?',
			options: [{ label: 'Almost never' }, { label: 'Once a month' }, { label: 'Every week' }]
		},
		{
			id: 'tried_ai',
			type: 'choice',
			question: 'Have you tried other AI photo apps?',
			options: [
				{ label: 'Yes', icon: ThumbsUp },
				{ label: 'No', icon: ThumbsDown }
			]
		},
		{
			id: 'comparison',
			type: 'info',
			question: 'Manblink gets you real pictures'
		},
		{
			id: 'goal',
			type: 'choice',
			question: 'What do you want to accomplish?',
			options: [{ label: 'Find love' }, { label: 'Have fun' }, { label: 'Meet friends' }]
		},
		{
			id: 'target',
			type: 'choice',
			question: 'How many dates a week do you want?',
			options: [{ label: '1' }, { label: '2–3' }, { label: '4+' }]
		},
		{
			id: 'dates_reply',
			type: 'info',
			question: 'dates_reply',
			replyText: '90% of users reach this goal within a week of using Manblink'
		},
		{
			id: 'best_way',
			type: 'choice',
			question: "What's the best way to get more matches?",
			options: [{ label: 'Fire photos' }, { label: 'Quirky bio' }, { label: '$300 Tinder Gold' }]
		},
		{
			id: 'no_photos_reason',
			type: 'choice',
			question: "What's stopping you from getting better photos?",
			options: [
				{ label: 'I feel uncomfortable on camera' },
				{ label: "I don't have time for a photoshoot" },
				{ label: "I don't know how to pose" },
				{ label: "I don't want to hire a photographer" },
				{ label: "I'm not photogenic" },
				{ label: 'Other' }
			]
		},
		{
			id: 'chart_reply',
			type: 'info',
			question: 'Get 4.2x more matches with Manblink photos vs your own',
			showChart: true
		},
		{
			id: 'timeline',
			type: 'choice',
			question: 'When are you ready to improve your dating life?',
			options: [{ label: 'Right now' }, { label: 'Next month' }, { label: 'This year' }]
		}
	];

	type Screen = 'quiz' | 'reviews' | 'result';

	const STORAGE_KEY = 'manblink_quiz_progress';

	function loadProgress(): { step: number; answers: Record<string, string> } {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) return JSON.parse(saved);
		} catch {}
		return { step: 0, answers: {} };
	}

	function saveProgress(step: number, answers: Record<string, string>) {
		const prev = loadProgress();
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ step: Math.max(step, prev.step), answers }));
	}

	const saved = loadProgress();

	let screen = $state<Screen>('quiz');
	let currentStep = $state(saved.step);
	let answers = $state<Record<string, string>>(saved.answers);
	let selectedOption = $state<string | null>(saved.answers[steps[saved.step]?.id] ?? null);
	let direction = $state<'forward' | 'backward'>('forward');

	const step = $derived(steps[currentStep]);
	const canContinue = $derived(step.type === 'info' || selectedOption !== null);

	// reviews + result are steps in the flow; add extra slots so 100% is never reached
	const TOTAL_SLOTS = steps.length + 2;
	const totalProgress = $derived(
		screen === 'result'
			? ((steps.length + 2) / TOTAL_SLOTS) * 100
			: screen === 'reviews'
				? ((steps.length + 1) / TOTAL_SLOTS) * 100
				: ((currentStep + 1) / TOTAL_SLOTS) * 100
	);

	$effect(() => {
		navProgress.set(totalProgress);
	});

	onMount(() => {
		// Rebuild history stack so back has entries to pop
		history.replaceState({}, '');
		for (let i = 1; i <= currentStep; i++) {
			history.pushState({}, '');
		}

		function handlePopState() {
			direction = 'backward';
			if (screen === 'result') {
				screen = 'reviews';
			} else if (screen === 'reviews') {
				screen = 'quiz';
				selectedOption = answers[steps[currentStep].id] ?? null;
			} else if (currentStep > 0) {
				currentStep--;
				selectedOption = answers[steps[currentStep].id] ?? null;
				saveProgress(currentStep, answers);
			} else {
				goto('/');
			}
		}

		window.addEventListener('popstate', handlePopState);
		return () => window.removeEventListener('popstate', handlePopState);
	});

	function selectOption(value: string) {
		selectedOption = value;
	}

	function handleContinue() {
		if (!canContinue) return;

		const s = steps[currentStep];
		if (s.type === 'choice' && selectedOption) {
			answers = { ...answers, [s.id]: selectedOption };
		}

		if (currentStep < steps.length - 1) {
			direction = 'forward';
			currentStep++;
			selectedOption = answers[steps[currentStep].id] ?? null;
			saveProgress(currentStep, answers);
			history.pushState({}, '');
		} else {
			direction = 'forward';
			localStorage.setItem('manblink_quiz', JSON.stringify(answers));
			localStorage.removeItem(STORAGE_KEY);
			screen = 'reviews';
			history.pushState({}, '');
		}
	}

	function animateChart(node: HTMLElement) {
		const withoutBar = node.querySelector<HTMLElement>('.bar-without');
		const withBar = node.querySelector<HTMLElement>('.bar-with');
		if (!withoutBar || !withBar) return;

		const withoutTarget = withoutBar.dataset.height!;
		const withTarget = withBar.dataset.height!;

		select(withoutBar)
			.style('height', '0px')
			.transition()
			.duration(700)
			.ease(easeCubicOut)
			.style('height', withoutTarget);

		select(withBar)
			.style('height', '0px')
			.transition()
			.duration(700)
			.delay(120)
			.ease(easeCubicOut)
			.style('height', withTarget);
	}
</script>

<svelte:head><title>Get More Matches — Manblink</title></svelte:head>

<div class="flex justify-center pb-20">
	<div class="flex w-full max-w-md flex-col space-y-8">
		<div class="slide-container">
			{#key screen === 'quiz' ? currentStep : screen}
				<div
					in:fly={{ x: direction === 'forward' ? 400 : -400, duration: 280, easing: cubicOut }}
					out:fly={{ x: direction === 'forward' ? -400 : 400, duration: 280, easing: cubicOut }}
				>
					{#if screen === 'quiz'}
						<div class={step.replyText ? 'flex flex-col space-y-4' : 'space-y-8'}>
							{#if step.id === 'dates_reply'}
								<div class="text-3xl font-bold">
									Getting <span class="text-rose-500">{answers.target}</span>
									{answers.target === '1' ? 'date' : 'dates'} a week is a realistic goal.
								</div>
							{:else}
								<div class="text-3xl font-bold">{step.question}</div>
							{/if}

							{#if step.type === 'info'}
								{#if step.replyText}
									<p class="text-xl">{step.replyText}</p>
								{:else if step.showChart}
									<div use:animateChart class="space-y-4 rounded-xl bg-stone-100 p-6">
										<div class="grid grid-cols-2">
											<div class="text-center font-bold">Without<br />Manblink</div>
											<div class="text-center font-bold">With<br />Manblink</div>
										</div>
										<div class="grid grid-cols-2 items-end gap-6" style="height: 200px">
											<div
												class="bar-without flex items-end justify-center rounded-xl bg-stone-300 pb-4"
												data-height="90px"
											>
												<span class="font-bold">1x</span>
											</div>
											<div
												class="bar-with flex items-end justify-center rounded-xl bg-stone-700 pb-4"
												data-height="200px"
											>
												<span class="font-bold text-white">4.2x</span>
											</div>
										</div>
									</div>
								{:else}
									<div class="relative grid grid-cols-2 gap-4">
										<div
											class="absolute top-1/3 left-1/2 z-10 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-rose-500 text-center font-bold text-white"
										>
											VS
										</div>
										<div class="space-y-2">
											<div class="aspect-3/4 overflow-hidden rounded-xl bg-stone-100">
												<img
													src="/pics/gpt.jpeg"
													alt="Free ChatGPT"
													class="h-full w-full object-cover"
												/>
											</div>
											<div class="font-bold">Free ChatGPT</div>
											<ul class="list-disc pl-5">
												<li>Unrecognizable</li>
												<li>Smooth skin</li>
												<li>"Too perfect" look</li>
											</ul>
										</div>
										<div class="space-y-2">
											<div class="aspect-3/4 overflow-hidden rounded-xl bg-stone-100">
												<img
													src="/pics/gen1.jpeg"
													alt="Manblink result"
													class="h-full w-full object-cover"
												/>
											</div>
											<div class="font-bold">Manblink</div>
											<ul class="list-disc pl-5">
												<li>Consistent face</li>
												<li>Natural skin</li>
												<li>"Imperfect" look</li>
											</ul>
										</div>
									</div>
								{/if}
							{:else if step.options}
								<div class="flex flex-col space-y-4">
									{#each step.options as option, i (option.label)}
										{@const Icon = option.icon}
										<button
											style="animation: option-in 220ms cubic-bezier(0.22, 1, 0.36, 1) {280 +
												i * 80}ms both"
											onclick={() => selectOption(option.label)}
											class="flex min-h-16 w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-center font-bold"
											class:bg-stone-700={selectedOption === option.label}
											class:text-white={selectedOption === option.label}
											class:bg-stone-200={selectedOption !== option.label}
											class:hover:bg-stone-300={selectedOption !== option.label}
										>
											{#if Icon}
												<Icon class="size-6" strokeWidth={3} />
											{/if}
											{option.label}
										</button>
									{/each}
								</div>
							{/if}
						</div>
					{:else if screen === 'reviews'}
						<div class="space-y-6">
							<div class="text-3xl font-bold">Manblink was made for people like you</div>
							{#each [{ name: 'James', text: '21 matches the first day. The photos look insane', starsCount: 5 }, { name: 'Marc', text: "My mom didn't believe these weren't real :)", starsCount: 5 }, { name: 'Tom', text: 'I got best results when I mixed AI photos with my own', starsCount: 4 }] as review (review.name)}
								<div class="space-y-2 rounded-2xl bg-stone-100 p-5">
									<div class="flex w-full justify-between space-x-2">
										<div class="font-bold">{review.name}</div>
										<div class="flex gap-0.5">
											{#each { length: review.starsCount } as _}
												<Star class="size-6 fill-amber-500 text-amber-500" />
											{/each}
										</div>
									</div>
									<p class="text-stone-600">{review.text}</p>
								</div>
							{/each}
						</div>
					{:else if screen === 'result'}
						<div class="space-y-8">
							<div class="text-3xl font-bold">Time to get your photos!</div>
							<div class="flex flex-col gap-3">
								<button
									onclick={() => {
										signInWithGoogle('/app/select');
									}}
									class="flex min-h-16 w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-stone-200 font-bold hover:bg-stone-300 disabled:opacity-50"
								>
									{@html `<svg viewBox="0 0 24 24" class="size-6"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>`}
									Continue with Google
								</button>
								<!-- <button
									onclick={() => goto('/app')}
									class="flex min-h-16 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-stone-200 font-bold hover:bg-stone-300"
								>
									Skip
								</button> -->
							</div>
						</div>
					{/if}
				</div>
			{/key}
		</div>
	</div>
</div>

{#if screen !== 'result'}
	<!-- Sticky Continue button -->
	<div
		class="fixed right-0 bottom-0 left-0 flex justify-center bg-white px-4 pt-4 pb-4 sm:px-8 md:px-12 lg:px-16 xl:px-32 2xl:px-64"
	>
		<button
			onclick={screen === 'reviews'
				? () => {
						direction = 'forward';
						screen = 'result';
						history.pushState({}, '');
					}
				: handleContinue}
			disabled={screen === 'quiz' && !canContinue}
			class="min-h-16 w-full max-w-md cursor-pointer rounded-xl bg-stone-700 px-4 py-3 font-bold text-white hover:bg-stone-800 disabled:cursor-default disabled:bg-stone-100 disabled:text-stone-300"
		>
			Continue
		</button>
	</div>
{/if}

<style>
	/* Stack slides in the same grid cell so both old and new occupy the same space during transition */
	.slide-container {
		display: grid;
		grid-template-areas: 'content';
		overflow-x: hidden;
	}
	.slide-container > * {
		grid-area: content;
		min-width: 0;
	}

	/* Options animate in after the slide completes (delay = slide duration) */
	@keyframes option-in {
		from {
			opacity: 0;
			transform: scale(0.95) translateY(4px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}
</style>

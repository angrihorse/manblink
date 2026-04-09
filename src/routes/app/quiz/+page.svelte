<script lang="ts">
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { onMount, onDestroy } from 'svelte';
	import { ThumbsUp, ThumbsDown } from '@lucide/svelte';
	import ReviewCard from '$lib/components/ReviewCard.svelte';
	import SocialProof from '$lib/components/SocialProof.svelte';
	import {
		navStepsTotal,
		navCurrentStep,
		navDirection,
		navBackOverride,
		bottomBar,
		sessionId
	} from '$lib/stores/app';
	import { analytics } from '$lib/client/firebase';
	import { logEvent } from 'firebase/analytics';
	import { select, easeCubicOut } from 'd3';

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
			question: 'What will get you more matches?',
			options: [
				{ label: '🔥 Better photos' },
				{ label: '📝 Quirky bio' },
				{ label: '💵 $300 Tinder Gold' }
			]
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
			question: 'When do you want to get better photos?',
			options: [{ label: 'Right now' }, { label: 'Next month' }, { label: 'This year' }]
		}
	];

	// +4 slots: reviews + select + upload + topup
	navStepsTotal.set(steps.length + 4);

	type Screen = 'quiz' | 'reviews';

	const reviews = [
		{
			name: 'Alex, 31',
			avatar: '/pics/review7.webp',
			quote:
				'Went from barely any matches to getting dates within the same week. The photos are that good.'
		},
		{
			name: 'Jordan, 47',
			avatar: '/pics/review8.webp',
			quote: 'My friends asked who took my photos. Nobody believes they were AI generated.'
		},
		{
			name: 'Sam, 40',
			avatar: '/pics/review9.webp',
			quote: 'Used to get maybe 1-2 matches a week. Now I have to keep up with conversations.'
		},
		{
			name: 'Luke, 32',
			avatar: '/pics/review10.webp',
			quote: "Honestly the best $29 I've spent. Updated my profile and saw results the same night."
		},
		{
			name: 'Nick, 22',
			avatar: '/pics/review11.webp',
			quote: 'I was skeptical but tried it anyway. My match rate doubled within a few days.'
		},
		{
			name: 'Ben, 36',
			avatar: '/pics/review12.webp',
			quote: 'Super fast, super easy. Photos look like I hired a professional photographer.'
		}
	];

	const STORAGE_KEY = 'manblink_quiz_progress';

	function loadProgress(): { step: number; answers: Record<string, string>; onReviews?: boolean } {
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

	let screen = $state<Screen>(saved.onReviews ? 'reviews' : 'quiz');
	let currentStep = $state(saved.step);
	let answers = $state<Record<string, string>>(saved.answers);
	let selectedOption = $state<string | null>(saved.answers[steps[saved.step]?.id] ?? null);
	let direction = $state<'forward' | 'backward'>('forward');

	const step = $derived(steps[currentStep]);
	const canContinue = $derived(step.type === 'info' || selectedOption !== null);

	$effect(() => {
		navCurrentStep.set(screen === 'reviews' ? steps.length + 1 : currentStep + 1);
	});

	$effect(() => {
		bottomBar.set([
			{
				label: 'Continue',
				onclick: screen === 'reviews' ? handleReviewsContinue : handleContinue,
				disabled: screen === 'quiz' && !canContinue,
				variant: 'dark'
			}
		]);
	});

	onMount(() => {
		navBackOverride.set(() => {
			direction = 'backward';
			if (screen === 'reviews') {
				screen = 'quiz';
				selectedOption = answers[steps[currentStep].id] ?? null;
			} else if (currentStep > 0) {
				currentStep--;
				selectedOption = answers[steps[currentStep].id] ?? null;
				saveProgress(currentStep, answers);
			} else {
				goto('/');
			}
		});
	});

	onDestroy(() => {
		navBackOverride.set(null);
	});

	function selectOption(value: string) {
		selectedOption = value;
	}

	function track(step_id: string, step_index: number) {
		if (analytics) logEvent(analytics, 'quiz_step', { step_id, step_index, session_id: sessionId });
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
			track(steps[currentStep].id, currentStep);
		} else {
			direction = 'forward';
			localStorage.setItem('manblink_quiz', JSON.stringify(answers));
			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({ step: currentStep, answers, onReviews: true })
			);
			screen = 'reviews';
			track('reviews', steps.length);
		}
	}

	function handleReviewsContinue() {
		track('completed', steps.length + 1);
		navDirection.set('forward');
		goto('/app/select');
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

<div class="slide-container">
	{#key screen === 'quiz' ? currentStep : screen}
		<div
			in:fly={{ x: direction === 'forward' ? 400 : -400, duration: 280, easing: cubicOut }}
			out:fly={{ x: direction === 'forward' ? -400 : 400, duration: 280, easing: cubicOut }}
		>
			<div class="flex justify-center">
				<div class="flex w-full max-w-md flex-col space-y-8">
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
													src="/pics/gpt.webp"
													alt="Free ChatGPT"
													class="h-full w-full object-cover"
												/>
											</div>
											<div class="font-bold">Free ChatGPT</div>
											<ul class="list-disc pl-5">
												<li>Unrecognizable</li>
												<li>Smooth skin</li>
												<li>Too perfect</li>
											</ul>
										</div>
										<div class="space-y-2">
											<div class="aspect-3/4 overflow-hidden rounded-xl bg-stone-100">
												<img
													src="/pics/gen1.webp"
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
											class="min-py-3 flex min-h-16 w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-center font-bold"
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
						<div class="space-y-4">
							<div class="text-3xl font-bold">Manblink was made for people like you</div>
							<SocialProof
								avatars={reviews.slice(0, 5).map((r) => r.avatar)}
								text="130+ guys upgraded their profiles this month"
							/>
							<div class="space-y-3">
								{#each reviews as r (r.name)}
									<ReviewCard name={r.name} avatar={r.avatar} quote={r.quote} />
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/key}
</div>

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

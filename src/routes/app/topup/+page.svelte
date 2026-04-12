<script lang="ts">
	import { screenTitle, bottomBar, navStepsTotal, navCurrentStep } from '$lib/stores/app';
	import { initiateCheckout } from '$lib/client/stripe';
	import ReviewCard from '$lib/components/ReviewCard.svelte';
	import FaqList from '$lib/components/FaqList.svelte';
	import { Check, Lock, Shield } from '@lucide/svelte';
	import { authLoading } from '$lib/client/firebase';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { PUBLIC_PRICE_ID_30, PUBLIC_PRICE_ID_60 } from '$env/static/public';

	const prices = [
		{ priceId: PUBLIC_PRICE_ID_30, credits: 30 },
		{ priceId: PUBLIC_PRICE_ID_60, credits: 60 }
	];

	const SPOTS_STEPS = [
		{ t: 3_000, val: 8 },
		{ t: 5_000, val: 7 },
		{ t: 8_000, val: 6 },
		{ t: 13_000, val: 5 },
		{ t: 21_000, val: 4 },
		{ t: 34_000, val: 3 },
		{ t: 55_000, val: 2 }
	];
	const SPOTS_SESSION_KEY = 'topup_spots_start';

	// Convert cumulative intervals to absolute times once
	const SPOTS_ABS = SPOTS_STEPS.reduce<{ t: number; val: number }[]>((acc, s) => {
		const prev = acc.at(-1)?.t ?? 0;
		return [...acc, { t: prev + s.t, val: s.val }];
	}, []);

	function spotsAtElapsed(elapsed: number): number {
		let val = 9;
		for (const step of SPOTS_ABS) {
			if (elapsed >= step.t) val = step.val;
			else break;
		}
		return val;
	}

	let spotsRemaining = $state(9);

	onMount(() => {
		let stored = sessionStorage.getItem(SPOTS_SESSION_KEY);
		if (!stored) {
			stored = Date.now().toString();
			sessionStorage.setItem(SPOTS_SESSION_KEY, stored);
		}
		const elapsed = Date.now() - parseInt(stored);
		spotsRemaining = spotsAtElapsed(elapsed);

		const timers = SPOTS_ABS.filter((s) => s.t - elapsed > 0).map((s) =>
			setTimeout(() => {
				spotsRemaining = s.val;
			}, s.t - elapsed)
		);

		return () => timers.forEach(clearTimeout);
	});

	screenTitle.set('');

	$effect(() => {
		if ($navStepsTotal !== null) navCurrentStep.set($navStepsTotal);
	});

	$effect(() => {
		bottomBar.set([
			{
				label: `Get My Photos — ${selected?.price ?? ''}`,
				onclick: checkout,
				disabled: false,
				variant: 'primary'
			}
		]);
	});

	let selectedIndex = $state(0);

	const tierMeta: Record<
		number,
		{ label: string; price: string; oldPrice: string; badge: string | null }
	> = {
		30: { label: 'Standard', price: '$29', oldPrice: '$49', badge: null },
		60: { label: 'Pro', price: '$49', oldPrice: '$89', badge: 'Best value' }
	};

	const tiers = $derived(prices.map((p) => ({ ...p, ...tierMeta[p.credits] })));
	const selected = $derived(tiers[selectedIndex]);

	async function checkout() {
		authLoading.set(true);
		await initiateCheckout(selected.priceId);
	}

	const faqs = [
		{
			q: 'Will these pass Tinder photo verification?',
			a: "Yes. Your face stays consistent across every photo — same bone structure, same features. They look like real photos taken in different locations. Because that's exactly what they're designed to do."
		},
		{
			q: 'Do they actually look real?',
			a: 'Scroll up and look at the preview. Every example on this page was generated from a single selfie. No one can tell the difference.'
		},
		{
			q: "What if I don't like the photos?",
			a: "You picked your scenes — so your photos are tailored to your vibe. If the results don't look like you expected, reach out and we'll sort it out."
		},
		{
			q: 'How fast do I get them?',
			a: 'About 5 minutes. Your photos start appearing one by one as they generate. Update your profile tonight.'
		},
		{
			q: 'Is this a subscription?',
			a: 'No. One-time payment. You pay once, get your photos, done. No recurring charges. No hidden fees.'
		}
	];

	const previewImages = [
		{ src: '/pics/gen2.webp' },
		{ src: '/pics/gen4.webp' },
		{ src: '/pics/gen1.webp' },
		{ src: '/pics/gen7.webp' },
		{ src: '/pics/gen3.webp' },
		{ src: '/pics/gen5.webp' }
	];

	const compareRows = [
		{ label: 'Photoshoot', value: '$300–800' },
		{ label: 'Other apps', value: '$63-270' }
	];
</script>

<div class="flex justify-center">
	<div class="flex w-full max-w-md flex-col space-y-8">
		<!-- HEADER -->
		<div class="space-y-2">
			<div class="inline-flex w-fit items-center gap-2">
				<Check class="size-6 shrink-0 text-rose-500" strokeWidth={3} />
				<span>Based on your answers — you're a perfect fit</span>
			</div>
			<div class="text-3xl font-bold">Now it's time to invest in yourself</div>
		</div>

		<!-- PHOTO PREVIEW GRID -->
		<div class="space-y-4">
			<div class="font-bold">Photo pack preview:</div>

			<div class="relative overflow-hidden rounded-xl text-white">
				<div class="grid grid-cols-3">
					{#each previewImages as { src } (src)}
						<img
							{src}
							alt=""
							class="aspect-square w-full rounded-xl bg-stone-100 object-cover opacity-50"
						/>
					{/each}
				</div>
				<div
					class="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl bg-black/40 backdrop-blur-sm"
				>
					<div class="flex size-12 items-center justify-center rounded-full bg-white">
						<Lock class="size-6 text-stone-800 " strokeWidth={3} />
					</div>
					<p>Your photos are ready to unlock</p>
					<p class="font-bold">{selected.credits} photos</p>
				</div>
			</div>
		</div>

		<!-- CHECKLIST -->
		<div class="space-y-4">
			<div class="font-bold">What you're getting:</div>
			{#each [[`${selected.credits} dating photos`, 'Generated from one selfie'], ['Tinder verified', 'Our photos pass face verification'], ['Consistent face across every shot', "Even your mom will think it's you"], ['Ready in 5 minutes', 'Less time than you need to finish']] as [title, desc] (title)}
				<div class="flex items-start gap-2">
					<Check class="mt-0.5 size-6 shrink-0 text-rose-500" strokeWidth={3} />
					<div>
						<span class="font-bold">{title}</span>
						<span class="text-stone-500"> — {desc}</span>
					</div>
				</div>
			{/each}
		</div>

		<!-- PRICE COMPARISON -->
		<div class="flex flex-col space-y-4 font-bold">
			{#each compareRows as row (row.label)}
				<div
					class="flex flex-col items-center justify-center space-y-1 rounded-xl border-2 border-stone-200 px-2 py-4 text-center"
				>
					<div>{row.label}</div>
					<div class="text-stone-500">{row.value}</div>
				</div>
			{/each}
			<div
				class="flex flex-col items-center justify-center space-y-1 rounded-xl bg-stone-700 px-2 py-4 text-center text-white"
			>
				<div>Manblink</div>
				<div class="">$29–49</div>
			</div>
		</div>

		<!-- PRICING CARDS -->
		<div class="space-y-4">
			<div class="font-bold">Choose your pack</div>
			<div
				class="flex items-center justify-between rounded-xl border-2 border-rose-500 px-4 py-3 font-bold"
			>
				<span>40% Off Sale</span>
				<span class="flex items-center gap-1">
					{#key spotsRemaining}
						<span
							in:fly={{ y: -10, duration: 200, easing: cubicOut }}
							out:fly={{ y: 10, duration: 150 }}
							class="inline-block text-rose-500">{spotsRemaining}</span
						>
					{/key}
					spots remaining
				</span>
			</div>
			<div class="grid grid-cols-2 space-x-4 font-bold">
				{#each tiers as tier, i (tier.priceId)}
					<button
						onclick={() => (selectedIndex = i)}
						class="relative flex cursor-pointer flex-col items-center justify-center space-y-2 rounded-xl py-4 text-center"
						class:bg-stone-700={selectedIndex === i}
						class:text-white={selectedIndex === i}
						class:bg-stone-200={selectedIndex !== i}
						class:hover:bg-stone-300={selectedIndex !== i}
					>
						<!-- {#if tier.badge}
							<div
								class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-rose-500 px-3 py-0.5 font-bold whitespace-nowrap text-white"
							>
								{tier.badge}
							</div>
						{/if} -->
						<div class="font-bold">{tier.label}</div>
						<div class={selectedIndex === i ? 'text-white' : 'text-stone-500'}>
							{tier.credits} photos
						</div>
						<div class="flex items-baseline gap-1">
							<span class="line-through {selectedIndex === i ? 'text-white/50' : 'text-stone-500'}"
								>{tier.oldPrice}</span
							>
							<span class="font-bold">{tier.price}</span>
						</div>
					</button>
				{/each}
			</div>
		</div>

		<!-- TRUST SIGNALS -->
		<div class="flex justify-around rounded-xl text-stone-500">
			<div class="flex flex-col items-center space-y-2 text-center">
				<Shield class="size-6" strokeWidth={3} />
				<div>Secure checkout</div>
			</div>
			<div class="flex flex-col items-center space-y-2 text-center">
				<Check class="size-6" strokeWidth={3} />
				<div>One-time payment</div>
			</div>
		</div>

		<!-- SOCIAL PROOF -->
		<ReviewCard
			name="Jake, 23"
			avatar="/pics/review1.webp"
			quote="I went from 2 matches a week to 15. Literally just changed my photos to the ones Manblink generated"
		/>

		<!-- FAQ -->
		<div class="space-y-4">
			<div class="font-bold">Quick questions</div>
			<FaqList {faqs} />
		</div>
	</div>
</div>

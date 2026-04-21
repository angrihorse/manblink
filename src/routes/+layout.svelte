<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import {
		authLoading,
		handleEmailLinkSignIn,
		handleGoogleRedirectResult,
		db,
		customRender,
		analytics
	} from '$lib/client/firebase';
	import { logEvent } from 'firebase/analytics';
	import Balls from '$lib/components/Balls.svelte';
	import { doc, onSnapshot } from 'firebase/firestore';
	import type { UserData } from '$lib/types';
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { ArrowLeft } from '@lucide/svelte';
	import {
		fullSreen as fullSreen,
		screenTitle,
		userCredits,
		navStepsTotal,
		navCurrentStep,
		navDirection,
		navBackOverride,
		sessionId
	} from '$lib/stores/app';
	import { fly } from 'svelte/transition';
	import LandingMenu from '$lib/components/LandingMenu.svelte';

	const BACK_URLS: Record<string, string> = {
		'/app/select': '/app/quiz',
		'/app/upload': '/app/select',
		'/app/topup': '/app/upload',
		'/app/signin': '/app/topup',
		'/app/review': '/app/loading',
		'/app/history': '/app'
	};

	let { children } = $props();

	onMount(async () => {
		await handleEmailLinkSignIn();
		handleGoogleRedirectResult();

		function handleButtonClick(e: MouseEvent) {
			const btn = (e.target as Element).closest('button');
			if (!btn || !analytics) return;
			const label =
				btn.getAttribute('aria-label') || btn.textContent?.trim().slice(0, 50) || 'unknown';
			console.log('button_click', { label, page_path: window.location.pathname });
			logEvent(analytics, 'button_click', {
				label,
				page_path: window.location.pathname,
				session_id: sessionId
			});
		}
		document.addEventListener('click', handleButtonClick);
		return () => document.removeEventListener('click', handleButtonClick);
	});

	afterNavigate(({ to }) => {
		fullSreen.set(false);
		const dest = to?.url.pathname;
		if (dest === '/' || dest === '/app') {
			navStepsTotal.set(null);
			navCurrentStep.set(null);
		}
	});

	$effect(() => {
		if (page.data.user?.email) {
			const unsubscribe = onSnapshot(doc(db, 'users', page.data.user.email), (snapshot) => {
				if (snapshot.exists()) {
					const data = snapshot.data() as UserData;
					userCredits.set(data.credits ?? 0);
				}
			});

			return () => unsubscribe();
		}
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if $authLoading || (page.data.isEmailLink && !page.data.user)}
	<div class="flex h-dvh w-full items-center justify-center">
		<Balls />
	</div>
{:else}
	{#if page.url.pathname === '/landing'}
		<div
			class="sticky top-0 z-10 flex h-14 w-full items-center justify-between border-b-2 border-stone-200 bg-white px-4 select-none sm:px-8 md:px-12 lg:px-16 xl:px-32 2xl:px-64"
		>
			<a href="/" class="font-black tracking-widest">MANBLINK</a>
			<nav class="hidden items-center md:flex">
				<a href="#how-it-works" class="px-3 py-4 font-bold hover:text-rose-500">How It Works</a>
				<a href="#results" class="px-3 py-4 font-bold hover:text-rose-500">Results</a>
				<a href="#reviews" class="px-3 py-4 font-bold hover:text-rose-500">Reviews</a>
				<a href="#pricing" class="px-3 py-4 font-bold hover:text-rose-500">Pricing</a>
				<a href="#faq" class="px-3 py-4 font-bold hover:text-rose-500">FAQ</a>
				<a
					href="/app/quiz"
					class="ml-4 rounded-xl bg-rose-500 px-4 py-2 font-bold text-white hover:bg-rose-600"
					>Get Started</a
				>
			</nav>
			<div class="md:hidden">
				<LandingMenu />
			</div>
		</div>
	{:else}
		<div
			class="relative z-10 flex h-14 w-full items-center justify-center border-b-2 border-stone-200 bg-white select-none"
		>
			{#if !(page.url.pathname === '/' || page.url.pathname === '/app' || page.url.pathname === '/app/loading')}
				<div class="absolute left-0">
					<button
						aria-label="Go back"
						onclick={() => {
							if ($navBackOverride) {
								$navBackOverride();
							} else {
								navDirection.set('backward');
								const url = BACK_URLS[page.url.pathname];
								url ? goto(url) : window.history.back();
							}
						}}
						class="flex size-16 cursor-pointer items-center justify-center"
					>
						<ArrowLeft class="size-6" strokeWidth={3} />
					</button>
				</div>
			{/if}

			<div class="flex w-full max-w-md items-center justify-center px-16">
				{#if page.url.pathname === '/' || page.url.pathname === '/app'}
					<a href="/" class=" font-black tracking-widest"
						><span class="">MAN</span><span>BLINK</span></a
					>
				{:else if $navStepsTotal !== null && $navCurrentStep !== null}
					<div class="h-2 w-full overflow-hidden rounded-full bg-stone-200">
						<div
							class="h-full bg-rose-500 transition-all duration-300"
							style="width: {($navCurrentStep / $navStepsTotal) * 100}%"
						></div>
					</div>
				{:else}
					<div class=" font-bold">{$screenTitle}</div>
				{/if}
			</div>

			{#if page.data.user && $userCredits !== null}
				<div
					class="absolute right-0 flex items-center justify-center px-6 font-bold tracking-wide select-none"
				>
					<span class="text-rose-500">@</span>{$userCredits}
				</div>
			{/if}
		</div>
	{/if}
	<div
		class:overflow-hidden={$fullSreen}
		class:h-dvh={$fullSreen}
		class="relative h-full p-4 text-stone-800 sm:px-8 md:px-12 lg:px-16 xl:px-32 2xl:px-64"
	>
		{@render children()}
	</div>
{/if}

<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { authLoading, handleEmailLinkSignIn, db, customRender } from '$lib/client/firebase';
	import Balls from '$lib/components/Balls.svelte';
	import { doc, onSnapshot } from 'firebase/firestore';
	import type { UserData } from '$lib/types';
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { ArrowLeft } from '@lucide/svelte';
	import { fixedBar, fullSreen as fullSreen, screenTitle, userCredits } from '$lib/stores/app';
	import { fly } from 'svelte/transition';

	let { children } = $props();

	onMount(async () => {
		await handleEmailLinkSignIn();
	});

	afterNavigate(() => {
		fixedBar.set(false);
		fullSreen.set(false);
		console.log('Set fullSreen to false');
	});

	$effect(() => {
		if (page.data.user?.id) {
			const unsubscribe = onSnapshot(doc(db, 'users', page.data.user.id), (snapshot) => {
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
	<div
		class:fixed={$fixedBar}
		class:top-0={$fixedBar}
		class:left-0={$fixedBar}
		class="z-10 flex h-16 w-full items-center justify-center border-b-4 border-stone-100 bg-white select-none sm:px-4 md:px-8 lg:px-12 xl:px-28 2xl:px-60"
	>
		{#if !(page.url.pathname === '/' || page.url.pathname === '/app')}
			<div class="absolute left-0">
				<button
					onclick={() => {
						window.history.back();
					}}
					class="flex size-16 cursor-pointer items-center justify-center"
				>
					<ArrowLeft class="size-6" strokeWidth={3} />
				</button>
			</div>
		{/if}

		{#if page.url.pathname === '/' || page.url.pathname === '/app'}
			<a href="/" class=" font-black tracking-widest"><span class="">MAN</span><span>BLINK</span></a
			>
		{:else}
			<div class=" font-bold">{$screenTitle}</div>
		{/if}

		{#if page.data.user && userCredits !== null}
			<div
				class="absolute right-0 items-center justify-center px-6 font-bold tracking-wide select-none"
			>
				<span class="text-rose-500">@</span>{userCredits}
			</div>
		{/if}
	</div>
	<div
		class:mt-16={$fixedBar}
		class:overflow-hidden={$fullSreen}
		class:h-dvh={$fullSreen}
		class="relative h-full px-4 py-8 text-stone-800 sm:px-8 md:px-12 lg:px-16 xl:px-32 2xl:px-64"
	>
		{@render children()}
	</div>
{/if}

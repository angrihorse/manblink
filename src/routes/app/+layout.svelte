<script lang="ts">
	import { page } from '$app/state';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { navDirection, bottomBar, navBackOverride } from '$lib/stores/app';
	import type { LayoutProps } from './$types';
	import { authLoading } from '$lib/client/firebase';
	import { onMount } from 'svelte';
	import { beforeNavigate } from '$app/navigation';

	beforeNavigate(() => {
		navBackOverride.set(null);
	});

	let { children }: LayoutProps = $props();

	onMount(() => {
		function onPageShow(e: PageTransitionEvent) {
			if (e.persisted) {
				// Restored from bfcache — clear any stale loading state
				authLoading.set(false);
				sessionStorage.removeItem('auth_redirect_url');
			}
		}
		window.addEventListener('pageshow', onPageShow);
		return () => window.removeEventListener('pageshow', onPageShow);
	});
</script>

<div class="slide-container pb-26">
	{#key page.url.pathname}
		<div
			in:fly={{ x: $navDirection === 'forward' ? 400 : -400, duration: 280, easing: cubicOut }}
			out:fly={{ x: $navDirection === 'forward' ? -400 : 400, duration: 280, easing: cubicOut }}
		>
			{@render children()}
		</div>
	{/key}
</div>

{#if $bottomBar}
	<div
		class="fixed right-0 bottom-0 left-0 flex justify-center border-t-2 border-stone-200 bg-white px-4 pt-4 pb-4 sm:px-8 md:px-12 lg:px-16 xl:px-32 2xl:px-64"
	>
		<div class="flex w-full max-w-md gap-4">
			{#each $bottomBar as btn}
				<button
					onclick={btn.onclick}
					disabled={btn.disabled}
					class="{btn.variant === 'secondary'
						? 'bg-stone-200 hover:bg-stone-300'
						: btn.variant === 'dark'
							? 'bg-stone-700 text-white hover:bg-stone-800'
							: 'bg-rose-500 text-white hover:bg-rose-600'} flex min-h-16 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold disabled:cursor-default disabled:bg-stone-100 disabled:text-stone-300"
				>
					{#if btn.icon}
						{@const Icon = btn.icon}
						<Icon class="size-6 shrink-0" strokeWidth={3} />
					{/if}
					{#if btn.label}{btn.label}{/if}
				</button>
			{/each}
		</div>
	</div>
{/if}

<style>
	.slide-container {
		display: grid;
		grid-template-areas: 'content';
		overflow-x: hidden;
	}
	.slide-container > * {
		grid-area: content;
		min-width: 0;
	}
</style>

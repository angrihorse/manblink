<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { handleEmailLinkSignIn } from '$lib/client/firebase';

	let { children } = $props();

	onMount(async () => {
		await handleEmailLinkSignIn();
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="space-y-8 px-4 py-8 text-lg text-stone-800 sm:px-8 md:px-16 lg:space-y-8 lg:px-32">
	<div>
		<a href="/" class="font-black tracking-wider select-none"
			><span class="text-rose-500">MAN</span><span>BLINK</span></a
		>
	</div>
	{@render children()}
</div>

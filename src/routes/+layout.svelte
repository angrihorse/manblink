<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
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

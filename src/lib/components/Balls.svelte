<script>
	import { onMount } from 'svelte';

	let balls = [0, 1, 2].map((i) => ({ offset: i * 72 }));

	onMount(() => {
		const style = document.createElement('style');
		style.textContent = `
			@keyframes juggle {
				0% { 
					transform: translate(-50%, -50%) rotate(90deg) translateX(64px);
				}
				100% { 
					transform: translate(-50%, -50%) rotate(-270deg) translateX(64px);
				}
			}
		`;
		document.head.appendChild(style);

		return () => style.remove();
	});
</script>

<div class="relative flex h-full w-full items-center justify-center">
	{#each balls as ball, i}
		<div
			class="absolute top-1/2 left-1/2 size-8 rounded-full bg-rose-500"
			style="
                animation: juggle 0.8s ease-in-out infinite;
                animation-delay: {i * -0.55}s;
            "
		></div>
	{/each}
</div>

<script lang="ts">
	import { Star } from '@lucide/svelte';

	interface Props {
		count?: number;
		size?: string;
	}

	let { count = 5, size = 'size-6' }: Props = $props();
</script>

<div class="flex gap-0.5">
	{#each { length: count } as _, i (i)}
		<Star class="{size} fill-yellow-400 text-yellow-400" strokeWidth={3} />
	{/each}
</div>

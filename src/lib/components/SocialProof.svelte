<script lang="ts">
	import Stars from './Stars.svelte';

	interface Props {
		avatars: string[];
		text: string;
	}

	let { avatars, text }: Props = $props();
</script>

<div class="flex flex-wrap justify-between gap-2 rounded-xl border-4 border-stone-200 px-5 py-4">
	<div class="flex flex-wrap items-center gap-2">
		<div class="flex -space-x-2">
			{#each avatars as src (src)}
				<img {src} alt="" class="size-12 rounded-full bg-stone-100 object-cover outline-4 outline-white" />
			{/each}
		</div>
		<span>{text}</span>
	</div>
	<div class="flex flex-wrap items-center justify-between gap-2">
		<Stars size="size-6" />
	</div>
</div>

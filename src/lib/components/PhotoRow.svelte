<script lang="ts">
	import { ArrowDown } from '@lucide/svelte';

	interface Props {
		sourceImg?: string;
		generatedPhotos: { src: string }[];
		name?: string;
	}

	let { sourceImg, generatedPhotos, name = 'Your selfie' }: Props = $props();
</script>

<div class="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
	{#if sourceImg}
		<div class="relative aspect-3/4">
			<img src={sourceImg} alt={name} class="absolute inset-0 h-full w-full rounded-xl object-cover" />
			<span class="absolute top-2 left-2 rounded-xl bg-stone-100 px-2 py-1 font-bold select-none">
				SELFIE
			</span>
		</div>
	{/if}

	{#each generatedPhotos as photo}
		<div class="relative aspect-3/4">
			<img src={photo.src} alt={photo.alt} class="absolute inset-0 h-full w-full rounded-xl object-cover" />
			<div
				class="absolute top-2 left-2 rounded-xl bg-stone-100 px-2 py-1 font-bold text-rose-500 select-none"
			>
				AI
			</div>
		</div>
	{/each}
</div>

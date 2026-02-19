<script lang="ts">
	import { ArrowDown } from '@lucide/svelte';

	interface Props {
		sourceImg: string;
		generatedPhotos: { src: string; alt: string }[];
		name?: string;
	}

	let { sourceImg, generatedPhotos, name = 'Your selfie' }: Props = $props();
</script>

<div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8 md:grid-cols-3">
	<div class="relative aspect-3/4">
		<img src={sourceImg} alt={name} class="h-full w-full rounded-xl object-cover" />
		<span class="absolute top-4 left-4 rounded-xl bg-stone-200 px-4 py-2 font-bold select-none">
			SELFIE
		</span>
	</div>

	{#each generatedPhotos as photo}
		<div class="relative aspect-3/4">
			<img src={photo.src} alt={photo.alt} class="h-full w-full rounded-xl object-cover" />
			<div class="absolute top-4 left-4 rounded-xl bg-stone-200 px-4 py-2 font-bold select-none">
				AI
			</div>
		</div>
	{/each}
</div>

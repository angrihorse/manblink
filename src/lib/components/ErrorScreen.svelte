<script lang="ts">
	import { Send } from '@lucide/svelte';

	let { title, message }: { title: string; message: string } = $props();
</script>

<div class="flex justify-center">
	<div class="flex max-w-md flex-col justify-center space-y-4 text-left">
		<div class="space-y-1">
			<p class="text-3xl font-bold">{title}</p>
			<p class="">{message}</p>
		</div>
		<a
			href="https://t.me/oricocoach?text={encodeURIComponent(`${title}: ${message}`)}"
			target="_blank"
			class="relative flex h-16 w-full items-center justify-center rounded-xl bg-stone-200 font-bold select-none hover:bg-stone-300"
		>
			<Send class="absolute right-6 size-6" strokeWidth={3} />
			<span>Message developer</span>
		</a>
	</div>
</div>

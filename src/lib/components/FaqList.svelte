<script lang="ts">
	import { ChevronDown } from '@lucide/svelte';

	interface Faq {
		q: string;
		a: string;
	}

	interface Props {
		faqs: Faq[];
	}

	let { faqs }: Props = $props();

	let openFaq = $state<number | null>(null);
</script>

<div class="space-y-2">
	{#each faqs as faq, i (faq.q)}
		<div class="overflow-hidden rounded-xl bg-stone-100">
			<button
				onclick={() => (openFaq = openFaq === i ? null : i)}
				class="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left"
			>
				<span class="font-bold">{faq.q}</span>
				<ChevronDown
					class="ml-4 size-6 shrink-0 transition-transform {openFaq === i ? 'rotate-180' : ''}"
					strokeWidth={3}
				/>
			</button>
			{#if openFaq === i}
				<div class="px-4 pb-4">{faq.a}</div>
			{/if}
		</div>
	{/each}
</div>

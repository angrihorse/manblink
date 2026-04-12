<script lang="ts">
	import { Menu, X } from '@lucide/svelte';

	let open = $state(false);

	const links = [
		{ label: 'How It Works', href: '#how-it-works' },
		{ label: 'Results', href: '#results' },
		{ label: 'Reviews', href: '#reviews' },
		{ label: 'Pricing', href: '#pricing' },
		{ label: 'FAQ', href: '#faq' }
	];
</script>

<button
	onclick={() => (open = !open)}
	class="flex size-14 cursor-pointer items-center justify-end"
	aria-label={open ? 'Close menu' : 'Open menu'}
>
	{#if open}
		<X class="size-6" strokeWidth={3} />
	{:else}
		<Menu class="size-6" strokeWidth={3} />
	{/if}
</button>

{#if open}
	<div class="fixed top-14 right-0 bottom-0 left-0 z-50 flex flex-col bg-white">
		<nav class="flex flex-col space-y-1 p-4">
			{#each links as link (link.href)}
				<a
					href={link.href}
					onclick={() => (open = false)}
					class="flex min-h-14 items-center rounded-xl px-4 font-bold hover:bg-stone-100"
				>
					{link.label}
				</a>
			{/each}
		</nav>
		<div class="p-4">
			<a
				href="/app/quiz"
				onclick={() => (open = false)}
				class="flex min-h-16 w-full cursor-pointer items-center justify-center rounded-xl bg-rose-500 px-4 py-3 font-bold text-white hover:bg-rose-600"
			>
				Get Started — $29
			</a>
		</div>
	</div>
{/if}

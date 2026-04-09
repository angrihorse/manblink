<script lang="ts">
	import Stars from './Stars.svelte';

	interface Props {
		name: string;
		avatar: string;
		quote: string;
	}

	let { name, avatar, quote }: Props = $props();
</script>

<div class="space-y-2 rounded-xl bg-stone-100 p-4">
	<div class="flex items-center gap-3">
		<img src={avatar} alt={name} class="size-16 rounded-full bg-stone-100 object-cover" />
		<div class="space-y-1">
			<div class="font-bold">{name}</div>
			<Stars size="size-6" />
		</div>
	</div>
	<p>"{quote}"</p>
</div>

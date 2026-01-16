<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="flex max-w-sm flex-col space-y-4 text-stone-800">
	<div>
		<h1 class="text-3xl font-bold">Payment Successfull</h1>
		<div class="">You can start using the app</div>
	</div>

	<a
		href="/start"
		class="flex h-16 max-w-48 items-center justify-center rounded-lg bg-rose-500 px-4 text-lg font-bold text-white select-none hover:bg-rose-600"
	>
		Start
	</a>
</div>

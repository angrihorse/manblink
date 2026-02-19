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
		href="/app"
		class="flex h-16 max-w-48 items-center justify-center rounded-xl bg-rose-500 px-4 font-bold text-white select-none hover:bg-rose-600"
	>
		Open the app
	</a>
</div>

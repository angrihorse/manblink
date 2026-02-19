<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="flex h-full max-w-sm flex-col space-y-4 text-stone-800">
	<div>
		<h1 class="text-3xl font-bold text-rose-500">
			{page.status}
		</h1>
		<div>
			{page.error?.message}
		</div>
	</div>

	<a
		href="/"
		class="flex h-16 max-w-48 items-center justify-center rounded-xl bg-stone-200 px-4 font-bold select-none hover:bg-stone-300"
	>
		Home
	</a>
</div>

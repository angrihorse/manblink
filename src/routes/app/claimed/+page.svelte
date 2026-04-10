<script lang="ts">
	import { screenTitle, bottomBar } from '$lib/stores/app';

	screenTitle.set('');
	bottomBar.set(null);
</script>

<div class="flex justify-center">
	<div class="flex w-full max-w-md flex-col space-y-8">
		<div class="space-y-2">
			<div class="text-3xl font-bold">Check your email</div>
			<p class="text-stone-500">
				We sent a sign-in link to your email. Click it to get your photos. <span class="font-bold"
					>Don't forget to check <span class="text-rose-500">spam</span>.</span
				>
			</p>
		</div>
	</div>
</div>

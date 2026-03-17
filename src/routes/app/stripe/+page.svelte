<script lang="ts">
	import { screenTitle, userCredits, selectedPrompts } from '$lib/stores/app';
	import { initiateCheckout } from '$lib/client/stripe';

	screenTitle.set('Top up');

	const needed = $selectedPrompts.length;
	const balance = $userCredits ?? 0;
	const shortfall = needed - balance;
</script>

<div class="flex justify-center">
	<div class="flex w-full max-w-md flex-col space-y-4">
		<p class="">
			You need <span class="font-bold text-stone-800">{shortfall}</span> more credit{shortfall === 1 ? '' : 's'}.
		</p>
	</div>
</div>

<div class="fixed bottom-0 left-0 right-0 flex justify-center bg-white px-4 pb-4 pt-4 sm:px-8 md:px-12 lg:px-16 xl:px-32 2xl:px-64">
	<button
		onclick={() => initiateCheckout('', '')}
		class="h-16 w-full max-w-md cursor-pointer rounded-xl bg-rose-500 px-4 font-bold text-white hover:bg-rose-600"
	>
		Top up
	</button>
</div>

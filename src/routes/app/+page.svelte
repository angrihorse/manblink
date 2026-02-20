<script lang="ts">
	import { goto } from '$app/navigation';
	import { serverSignOut } from '$lib/client/firebase';
	import { screenTitle, resetAppState, userCredits } from '$lib/stores/app';
	import { fly, slide } from 'svelte/transition';
	import { initiateCheckout } from '$lib/client/stripe';

	function handleStart() {
		if ($userCredits === 0) {
			initiateCheckout('', '');
		} else {
			goto('/app/select');
		}
	}
</script>

<div class="flex justify-center">
	<div class="flex w-full max-w-md flex-col space-y-8">
		<div class="flex flex-col gap-4">
			<button
				onclick={handleStart}
				class="h-16 cursor-pointer rounded-xl bg-rose-500 px-4 font-bold text-white hover:bg-rose-600"
			>
				Start
			</button>

			<button
				onclick={() => initiateCheckout('', '')}
				class="h-16 cursor-pointer rounded-xl bg-stone-200 px-4 font-bold hover:bg-stone-300"
			>
				Top-up
			</button>

			<a
				href="/app/history"
				class="flex h-16 items-center justify-center rounded-xl bg-stone-200 px-4 font-bold hover:bg-stone-300"
			>
				History
			</a>

			<button
				onclick={serverSignOut}
				class="h-16 cursor-pointer rounded-xl bg-stone-200 px-4 font-bold hover:bg-stone-300"
			>
				Logout
			</button>
		</div>
	</div>
</div>

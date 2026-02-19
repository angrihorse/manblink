<script lang="ts">
	import { goto } from '$app/navigation';
	import { signOut } from 'firebase/auth';
	import { auth } from '$lib/client/firebase';
	import { screenTitle, resetAppState } from '$lib/stores/app';
	import { fly, slide } from 'svelte/transition';

	async function handleLogout() {
		await signOut(auth);
		goto('/');
	}

	function handleStart() {
		goto('/app/select');
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

			<a
				href="/app/history"
				class="flex h-16 items-center justify-center rounded-xl bg-stone-200 px-4 font-bold hover:bg-stone-300"
			>
				History
			</a>

			<a
				href="https://billing.stripe.com/p/login/test_00g9By0yT0qVeDCaEE"
				target="_blank"
				rel="noopener noreferrer"
				class="flex h-16 items-center justify-center rounded-xl bg-stone-200 px-4 font-bold hover:bg-stone-300"
			>
				Billing
			</a>

			<button
				onclick={handleLogout}
				class="h-16 cursor-pointer rounded-xl bg-stone-200 px-4 font-bold hover:bg-stone-300"
			>
				Logout
			</button>
		</div>
	</div>
</div>

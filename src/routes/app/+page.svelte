<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { serverSignOut } from '$lib/client/firebase';
	import AuthForm from '$lib/components/AuthForm.svelte';
	import { navStepsTotal, navCurrentStep, bottomBar } from '$lib/stores/app';

	navStepsTotal.set(null);
	navCurrentStep.set(null);
	bottomBar.set(null);
</script>

{#if page.data.user}
	<div class="flex justify-center">
		<div class="flex w-full max-w-md flex-col gap-4">
			<button
				onclick={() => goto('/app/select')}
				class="min-h-16 cursor-pointer rounded-xl bg-rose-500 px-4 py-3 font-bold text-white hover:bg-rose-600"
			>
				Start
			</button>

			<a
				href="/app/history"
				class="flex min-h-16 items-center justify-center rounded-xl bg-stone-200 px-4 py-3 font-bold hover:bg-stone-300"
			>
				History
			</a>

			<button
				onclick={serverSignOut}
				class="min-h-16 cursor-pointer rounded-xl bg-stone-200 px-4 py-3 font-bold hover:bg-stone-300"
			>
				Logout
			</button>
		</div>
	</div>
{:else}
	<div class="flex justify-center">
		<AuthForm />
	</div>
{/if}

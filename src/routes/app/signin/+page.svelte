<script lang="ts">
	import { screenTitle } from '$lib/stores/app';
	import AuthForm from '$lib/components/AuthForm.svelte';

	screenTitle.set('');
</script>

<div class="flex justify-center">
	<div class="flex w-full max-w-md flex-col space-y-8">
		<div class="space-y-2">
			<div class="text-3xl font-bold">Almost done!</div>
			<p class="text-stone-500">Sign in to get your photos.</p>
		</div>

		<AuthForm redirectUrl="/app/loading" />
	</div>
</div>

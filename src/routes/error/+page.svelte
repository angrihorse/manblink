<script lang="ts">
	import { page } from '$app/state';
	import ErrorScreen from '$lib/components/ErrorScreen.svelte';
	import { screenTitle } from '$lib/stores/app';

	const title = page.url.searchParams.get('title') ?? 'Error';
	const message = page.url.searchParams.get('message') ?? 'Something went wrong. Please try again.';

	screenTitle.set('Error');
</script>

<ErrorScreen {title} {message} />

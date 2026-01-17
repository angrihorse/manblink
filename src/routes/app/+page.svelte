<script lang="ts">
	import { page } from '$app/state';
	import { authLoading } from '$lib/client/firebase';
	import Balls from '$lib/components/Balls.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

Hello, {page.data.user.displayName}

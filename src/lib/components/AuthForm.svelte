<script lang="ts">
	import { page } from '$app/state';
	import {
		signInWithEmail,
		signInWithGoogle,
		serverSignOut,
		authLoading
	} from '$lib/client/firebase';
	import { Landmark, LogOut, Mail } from '@lucide/svelte';
	import Balls from '$lib/components/Balls.svelte';

	let email = $state('');
	let emailSent = $state(false);

	const googleIcon = `<svg viewBox="0 0 24 24" class="size-6"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>`;
</script>

<div class="h-full max-w-md">
	{#if emailSent}
		<div class="flex h-full grow flex-col items-center justify-center gap-4 text-stone-800">
			<div class="space-y-1">
				<div class="text-3xl font-bold">Email sent</div>
				{#if email.includes('gmail')}
					<a
						href="http://mail.google.com/"
						class="flex h-16 items-center justify-center rounded-xl bg-rose-500 font-bold text-white select-none hover:bg-rose-600"
					>
						Open Gmail
					</a>
				{:else}
					<div>Check your inbox</div>
				{/if}
			</div>
		</div>
	{:else if $authLoading || (page.data.isEmailLink && !page.data.user)}
		<Balls />
	{:else if page.data.user}
		<div class="flex grow flex-col gap-4 text-stone-800">
			<div>
				<div class="text-3xl font-bold">Welcome!</div>
				<div class="">
					{page.data.user.email}
				</div>
			</div>

			<a
				href="/app"
				class="flex h-16 items-center justify-center rounded-xl bg-rose-500 font-bold text-white select-none hover:bg-rose-600"
			>
				Open app
			</a>
		</div>
	{:else}
		<div class="flex grow flex-col text-stone-800">
			<button
				onclick={signInWithGoogle}
				class="flex h-16 cursor-pointer items-center justify-center gap-3 rounded-xl bg-stone-200 font-bold select-none hover:bg-stone-300"
			>
				{@html googleIcon}
				<span>Continue with Google</span>
			</button>

			<div class="relative flex items-center py-2 select-none">
				<div class="grow border-t-4 border-stone-200"></div>
				<span class="mx-4 shrink font-bold text-stone-300">OR</span>
				<div class="grow border-t-4 border-stone-200"></div>
			</div>

			<form
				class="flex flex-col gap-3"
				onsubmit={(e) => {
					e.preventDefault();
					emailSent = true;
					signInWithEmail(email);
				}}
			>
				<input
					bind:value={email}
					type="email"
					name="email"
					autocomplete="email"
					placeholder="Enter your email"
					class="h-16 rounded-xl bg-stone-200 px-4 font-bold placeholder-stone-700 outline-none focus:ring-4 focus:ring-rose-500"
					required
				/>
				<button
					type="submit"
					class="relative flex h-16 cursor-pointer items-center justify-center rounded-xl bg-rose-500 font-bold text-white select-none hover:bg-rose-600"
				>
					<span>Continue with email</span>
				</button>
			</form>
		</div>
	{/if}
</div>

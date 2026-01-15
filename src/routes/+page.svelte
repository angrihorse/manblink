<script lang="ts">
	import AuthForm from '$lib/components/AuthForm.svelte';
	import PhotoRow from '$lib/components/PhotoRow.svelte';
	import { ArrowDown, Image, Send, User } from '@lucide/svelte';

	const heroPhotos = [
		{ src: '/pics/gen1.jpeg', alt: 'Generated 1' },
		{ src: '/pics/gen2.jpeg', alt: 'Generated 2' },
		{ src: '/pics/gen3.jpeg', alt: 'Generated 3' },
		{ src: '/pics/gen4.jpeg', alt: 'Generated 4' },
		{ src: '/pics/gen5.jpeg', alt: 'Generated 5' },
		{ src: '/pics/gen6.jpeg', alt: 'Generated 6' },
		{ src: '/pics/gen7.jpeg', alt: 'Generated 7' },
		{ src: '/pics/gen8.jpeg', alt: 'Generated 8' }
	];

	const reviews = [
		{ name: 'Jake', before: 4, after: 84, srcImg: '/pics/src1.jpg' },
		{ name: 'Marcus', before: 2, after: 67, srcImg: '/pics/src1.jpg' },
		{ name: 'Tyler', before: 8, after: 112, srcImg: '/pics/src1.jpg' },
		{ name: 'Ryan', before: 5, after: 93, srcImg: '/pics/src1.jpg' },
		{ name: 'Chris', before: 3, after: 78, srcImg: '/pics/src1.jpg' }
	];

	let email = $state('');
	let emailSent = $state(false);
	let uploadedImage = $state<string | null>(null);
	let fileInput: HTMLInputElement;

	function handleGoogleSignIn() {
		emailSent = true;
	}

	function handleEmailSubmit(e: Event) {
		e.preventDefault();
		emailSent = true;
	}

	function handleFileSelect(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file && file.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onload = (e) => {
				uploadedImage = e.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	function triggerFileInput() {
		fileInput.click();
	}
</script>

<svelte:head>
	<title>ManBlink - Better Photos, More Matches</title>
</svelte:head>

<div class="space-y-8 px-4 py-8 text-lg font-bold text-stone-700 sm:px-8 md:px-16 lg:space-y-8">
	<div class="space-y-8">
		<div class="font-black tracking-wide">MANBLINK</div>
		<div class="grid w-full grid-cols-1 gap-8 lg:grid-cols-3">
			<div class="flex flex-col justify-center space-y-2">
				<div class="text-3xl font-black">Turn 1 selfie into 100 dating profile photos</div>
				<div>Everybody knows that photos make or break your Tinder profile</div>
				<div>But you can't afford a professional photographer following you 24/7</div>
				<div>Hire AI to get high-quality photos in less than 2 minutes</div>
			</div>

			<button
				type="button"
				onclick={triggerFileInput}
				class="flex aspect-square w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-4 border-stone-700 bg-stone-100 hover:bg-stone-200"
				class:border-dotted={!uploadedImage}
				class:p-8={!uploadedImage}
			>
				<input
					bind:this={fileInput}
					type="file"
					accept="image/*"
					class="hidden"
					onchange={handleFileSelect}
				/>
				{#if uploadedImage}
					<img src={uploadedImage} alt="Uploaded selfie" class="h-full w-full object-cover" />
				{:else}
					<div class="flex flex-col items-center space-y-2">
						<User class="size-8" />
						<span class="text-xl"> Upload Selfie </span>
					</div>
				{/if}
			</button>

			<div class=" flex-col items-center">
				<AuthForm
					bind:email
					{emailSent}
					onGoogleSignIn={handleGoogleSignIn}
					onEmailSubmit={handleEmailSubmit}
				/>
			</div>
		</div>
	</div>

	<PhotoRow sourceImg="/pics/src1.jpg" generatedPhotos={heroPhotos} />

	<!-- <section class="space-y-8 px-4">
		{#each reviews as review}
			<div class="space-y-2">
				<PhotoRow sourceImg={review.srcImg} generatedPhotos={heroPhotos} name={review.name} />
				<div class="text-center">
					<span class="text-lg font-bold">{review.name}</span>
					<span class="text-lg font-bold ">
						— From <strong class="font-bold ">{review.before}</strong> to
						<strong class="font-bold ">{review.after}</strong> matches per day
					</span>
				</div>
			</div>
		{/each}
	</section> -->

	<section class="grid w-full grid-cols-1 gap-8 lg:grid-cols-3">
		<div class="flex flex-col justify-center rounded-lg border-8 border-stone-100 p-8">
			<div>
				<span class="text-5xl font-black text-rose-500">$10</span>
				<span class="text-lg font-bold">/month</span>
			</div>
			<div>100 AI photos</div>
			<div>50 dating presets</div>
			<div>Write your own prompts</div>
		</div>

		<div class="flex flex-col justify-center space-y-4">
			<div>
				<div class="text-3xl">Have a question?</div>
				<div class="">Get a human answer within 10 minutes</div>
			</div>
			<a
				href="https://t.me/manblink"
				target="_blank"
				class="relative flex h-16 w-full items-center justify-center rounded-lg bg-stone-100 text-lg hover:bg-stone-200"
			>
				<Send class="absolute right-4 size-6" strokeWidth={3} />
				<span>Ask Telegram</span>
			</a>
		</div>

		<div class="flex-col items-center">
			<AuthForm
				bind:email
				{emailSent}
				onGoogleSignIn={handleGoogleSignIn}
				onEmailSubmit={handleEmailSubmit}
			/>
		</div>
	</section>
</div>

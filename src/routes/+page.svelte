<script lang="ts">
	import AuthForm from '$lib/components/AuthForm.svelte';
	import PhotoRow from '$lib/components/PhotoRow.svelte';
	import PhotoUpload from '$lib/components/PhotoUpload.svelte';
	import { Send } from '@lucide/svelte';

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

	let uploadedImage = $state<string | null>(null);
</script>

<svelte:head>
	<title>APE CONTROL - Better Photos, More Matches</title>
</svelte:head>

<div class="space-y-8">
	<div class="grid w-full grid-cols-1 gap-8 lg:grid-cols-3">
		<div class="space-y-2">
			<div class="text-3xl font-bold">Turn 1 selfie into 100 Tinder photos</div>
			<ul class="list-disc pl-5">
				<li>Everybody knows that photos make or break your dating profile</li>
				<li>But you can't afford a professional photographer following you 24/7</li>
				<li>Hire AI to get high-quality photos in less than 2 minutes</li>
			</ul>
		</div>

		<PhotoUpload bind:uploadedImage />

		<div class=" flex-col items-center">
			<AuthForm />
		</div>
	</div>
</div>

<PhotoRow sourceImg="/pics/src1.jpg" generatedPhotos={heroPhotos} />

<div class="grid w-full grid-cols-1 gap-8 lg:grid-cols-3">
	<div class="flex flex-col space-y-4">
		<div class="space-y-1">
			<div class="text-3xl font-bold">Have a question?</div>
			<div class="">Get a human answer within 10 minutes</div>
		</div>
		<a
			href="https://t.me/apecontrolbot"
			target="_blank"
			class="relative flex h-16 w-full items-center justify-center rounded-lg bg-stone-200 text-lg font-bold select-none hover:bg-stone-300"
		>
			<Send class="absolute right-6 size-6" strokeWidth={3} />
			<span>Ask on Telegram</span>
		</a>
	</div>

	<div class="flex flex-col justify-center space-y-1 rounded-lg border-4 border-stone-200 p-8">
		<div>
			<span class="text-5xl font-bold text-rose-500">$20</span>
			<span class="text-lg font-bold">/month</span>
		</div>
		<ul class="list-disc pl-5">
			<li>100 AI photos</li>
			<li>42 dating presets</li>
			<li>Write your own prompts</li>
		</ul>
	</div>

	<div class="flex-col items-center">
		<AuthForm />
	</div>
</div>

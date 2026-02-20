<script lang="ts">
	import AuthForm from '$lib/components/AuthForm.svelte';
	import Balls from '$lib/components/Balls.svelte';
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

	let uploadedSelfieBase64 = $state<string | null>(null);
</script>

<svelte:head>
	<title>Manblink</title>
</svelte:head>

<div class="space-y-8">
	<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
		<div class="space-y-2">
			<div class="text-3xl font-bold">Turn 1 selfie into 100 Tinder photos</div>
			<ul class="list-disc pl-5">
				<li>Everybody knows that photos make or break your dating profile</li>
				<li>But you can't afford a professional photographer following you 24/7</li>
				<li>Order high-quality AI photos right here and get them within 1 minute</li>
			</ul>
		</div>

		<AuthForm />

		<div class="aspect-video w-full overflow-hidden rounded-xl bg-black">
			<iframe
				class="h-full w-full"
				src="https://www.youtube.com/embed/NF0xr1sBOQ8?si=Gdw6fM-wOQPo4CpB"
				title="Tutorial"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowfullscreen
			></iframe>
		</div>
	</div>

	<PhotoRow sourceImg="/pics/src1.jpg" generatedPhotos={heroPhotos} />

	<div class="grid w-full grid-cols-1 gap-8 lg:grid-cols-3">
		<div class=" space-y-1">
			<div class="font-bold">
				<span class="text-5xl">$20</span>
				<span class="">one-time </span>
			</div>
			<ul class="list-disc pl-5">
				<li>100 AI photos</li>
				<li>18 hand-picked presets</li>
				<li>Write your own prompts</li>
				<li>Get Tinder verified</li>
			</ul>
		</div>

		<AuthForm />

		<div class="flex flex-col space-y-4">
			<div class="space-y-1">
				<div class="text-3xl font-bold">Have a question?</div>
				<div class="">Get a human answer within 10 minutes</div>
			</div>
			<a
				href="https://t.me/oricoac"
				target="_blank"
				class="relative flex h-16 w-full items-center justify-center rounded-xl bg-stone-200 font-bold select-none hover:bg-stone-300"
			>
				<Send class="absolute right-6 size-6" strokeWidth={3} />
				<span>Ask on Telegram</span>
			</a>
		</div>
	</div>
</div>

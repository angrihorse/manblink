<script lang="ts">
	import Balls from '$lib/components/Balls.svelte';
	import PhotoRow from '$lib/components/PhotoRow.svelte';
	import { Redo, Send } from '@lucide/svelte';
	import { page } from '$app/state';

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
	const bottomPhotos = [
		{ src: '/pics/gen9.jpg', alt: 'Generated 9' },
		{ src: '/pics/gen10.jpg', alt: 'Generated 10' },
		{ src: '/pics/gen11.jpg', alt: 'Generated 11' }
	];
</script>

<svelte:head>
	<title>Manblink</title>
</svelte:head>

<div class="space-y-8">
	<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
		<div class="space-y-2">
			<div
				class="inline-flex items-center rounded-full border-4 border-stone-200 px-4 py-1.5 text-sm font-medium"
			>
				<span>4.2x increase in matches</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="text-3xl font-bold">Take one selfie <br />Get laid tonight</div>
			</div>
			<p class=" ">
				Get high-quality dating profile photos without leaving your room in less time than you last
				in bed.
			</p>
		</div>

		<div class="flex w-full items-center justify-center">
			<img src="/pics/selfie-mockup.png" alt="Your selfie" class="h-60 -rotate-4 object-contain" />
			<div>
				<Redo strokeWidth={3} class="size-12 -scale-x-100 rotate-170 text-stone-700" />
			</div>
			<div class="relative">
				<img
					src="/pics/tinder-mockup.png"
					alt="Tinder profile"
					class="h-72 rotate-2 object-contain"
				/>
				<img
					src="/pics/verified.png"
					alt="Verified"
					class="absolute -top-4 right-0 size-16 object-contain"
				/>
				<div
					class="absolute right-0 bottom-0 rounded-full bg-linear-to-bl from-yellow-300 to-yellow-400 px-2 py-1 font-bold select-none"
				>
					99+
				</div>
			</div>
		</div>

		<div class="flex flex-col gap-3">
			{#if page.data.user}
				<a
					href="/app"
					class="flex h-16 items-center justify-center rounded-xl bg-rose-500 font-bold text-white hover:bg-rose-600"
				>
					Open App
				</a>
			{:else}
				<a
					href="/quiz"
					class="flex h-16 items-center justify-center rounded-xl bg-rose-500 font-bold text-white hover:bg-rose-600"
				>
					Get Started
				</a>
				<a
					href="/app"
					class="flex h-16 items-center justify-center rounded-xl bg-stone-200 font-bold hover:bg-stone-300"
				>
					Login
				</a>
			{/if}
		</div>

		<!-- <div class="aspect-video w-full overflow-hidden rounded-xl bg-black">
			<iframe
				class="h-full w-full"
				src="https://www.youtube.com/embed/9DqNQ2SkciY?si=Ca0i0WsR83cLpZhG"
				title="Tutorial"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowfullscreen
			></iframe>
		</div> -->
	</div>

	<PhotoRow sourceImg="/pics/src1.jpg" generatedPhotos={heroPhotos} />

	<div class="grid w-full grid-cols-1 gap-8 lg:grid-cols-3">
		<div class=" space-y-1">
			<div class="font-bold">
				<span class="text-5xl">$29</span>
				<span class="">one-time </span>
			</div>
			<ul class="list-disc pl-5">
				<li>50 AI photos</li>
				<li>Tinder Verified</li>
				<li>Your exact face</li>
				<li>Choose hand-picked scenes</li>
				<li>CWrite your own</li>
			</ul>
		</div>

		<div class="flex flex-col gap-3">
			{#if page.data.user}
				<a
					href="/app"
					class="flex h-16 items-center justify-center rounded-xl bg-rose-500 font-bold text-white hover:bg-rose-600"
				>
					Open App
				</a>
			{:else}
				<a
					href="/quiz"
					class="flex h-16 items-center justify-center rounded-xl bg-rose-500 font-bold text-white hover:bg-rose-600"
				>
					Get Started
				</a>
				<a
					href="/app"
					class="flex h-16 items-center justify-center rounded-xl bg-stone-200 font-bold hover:bg-stone-300"
				>
					Login
				</a>
			{/if}
		</div>

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

	<PhotoRow generatedPhotos={bottomPhotos} />
</div>

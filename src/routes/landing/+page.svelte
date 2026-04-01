<script lang="ts">
	import PhotoRow from '$lib/components/PhotoRow.svelte';
	import ReviewCard from '$lib/components/ReviewCard.svelte';
	import SocialProof from '$lib/components/SocialProof.svelte';
	import { Redo, Send, MessageCircle, Check, X as XIcon, ChevronDown, X } from '@lucide/svelte';

	const heroPhotos = [
		{ src: '/pics/gen1.jpeg', alt: 'Dressed up' },
		{ src: '/pics/gen2.jpeg', alt: 'Urban casual' },
		{ src: '/pics/gen3.jpeg', alt: 'Nightlife' },
		{ src: '/pics/gen4.jpeg', alt: 'Dog in park' },
		{ src: '/pics/gen7.jpeg', alt: 'Home cooking' }
		// { src: '/pics/gen6.jpeg', alt: 'Adventure' },
		// { src: '/pics/gen7.jpeg', alt: 'Beach' },
		// { src: '/pics/gen8.jpeg', alt: 'Golden hour' }
	];
	const bottomPhotos = [
		{ src: '/pics/gen9.jpg', alt: 'Generated 9' },
		{ src: '/pics/gen11.jpg', alt: 'Generated 11' },
		{ src: '/pics/gen10.jpg', alt: 'Generated 10' }
	];

	const reviews = [
		{
			name: 'Matt, 38',
			avatar: '/pics/review1.jpg',
			quote:
				"Uploaded one selfie at 2am. Got my photos by 2:05am. Woke up to new matches I didn't have before.",
			result: 'From zero matches to double digits overnight'
		},
		{
			name: 'Marcus, 45',
			avatar: '/pics/review2.jpg',
			quote:
				'Updated my Tinder with new photos. Changed nothing else — same bio, same prompts. Way more matches.',
			result: 'Same profile. Better photos. Way more matches.'
		},
		{
			name: 'Tyler, 31',
			avatar: '/pics/review3.jpg',
			quote:
				'The girl who unmatched me rematched after I updated my photos. Better photos change how people see you.',
			result: 'Same guy. Better first impression.'
		},
		{
			name: 'Daniel, 26',
			avatar: '/pics/review4.jpg',
			quote: 'Spent 6 months thinking Tinder was broken. Turns out it was just my photos.',
			result: "It's not the app. It's the photos."
		},
		{
			name: 'Ryan, 25',
			avatar: '/pics/review5.jpg',
			quote: 'My profile went from 3 gym selfies to looking like I actually have a life.',
			result: 'From gym selfies to a real profile.'
		},
		{
			name: 'Mateo, 29',
			avatar: '/pics/review6.jpg',
			quote:
				'Never thought a photo upgrade would make this much of a difference. Matches went up immediately.',
			result: 'Better photos. Better matches. Simple.'
		}
	];

	const faqs = [
		{
			q: 'Will these pass Tinder photo verification?',
			a: "Yes. Your face stays consistent across every photo — same bone structure, same features. They look like real photos taken in different locations. Because that's exactly what they're designed to do."
		},
		{
			q: 'I only need one selfie?',
			a: "Yep. One clear, front-facing selfie. No sunglasses, decent lighting. That's it. Most competitors need 10–20 uploads."
		},
		{
			q: 'How fast do I get my photos?',
			a: 'About 5 minutes. Your photos start appearing one by one as they generate. Update your profile tonight.'
		},
		{
			q: 'Do they actually look like me?',
			a: 'Yes. Same face, same features — just better settings and lighting. Think: the difference between a bathroom selfie and a photo a talented friend took of you. Your date will recognize you.'
		},
		{
			q: 'Is this a subscription?',
			a: 'No. One-time payment. You pay once, get your photos, done. No recurring charges. No hidden fees.'
		},
		{
			q: "What's the difference between $29 and $49?",
			a: '$29 gets you 30 photos across 6 styles. $49 gets you 60 photos across all 14 styles — double the variety. Both are one-time payments.'
		},
		{
			q: "What if I don't like the results?",
			a: "Reach out on Telegram or WhatsApp — a real human responds within 12 hours. We'll work with you to get it right."
		},
		{
			q: 'Is my data private?',
			a: "Yes. Your selfie and photos are yours. We don't share, sell, or use your images for anything else. Need something deleted? Message us — handled in minutes."
		}
	];

	let openFaq = $state<number | null>(null);
</script>

<svelte:head>
	<title>Manblink — Dating Photos from 1 Selfie</title>
</svelte:head>

<div class="space-y-8">
	<!-- HERO -->
	<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
		<div class="space-y-4">
			<div class=" space-y-2">
				<div class="text-5xl font-bold">
					She swiped left because of <span class="text-rose-500">your photos</span>
				</div>
				<p>
					Your face isn't the problem. Your profile pictures are. Upload 1 selfie — get 30–60 dating
					photos in 5 minutes.
				</p>
			</div>
			<div class="flex flex-col gap-3">
				<a
					href="/app/quiz"
					class="flex min-h-16 w-full cursor-pointer items-center justify-center rounded-xl bg-rose-500 px-4 py-3 font-bold text-white hover:bg-rose-600"
				>
					Get Started — $29
				</a>
				<a
					href="#how-it-works"
					class="flex min-h-16 w-full cursor-pointer items-center justify-center rounded-xl bg-stone-200 px-4 py-3 font-bold hover:bg-stone-300"
				>
					See How It Works
				</a>
			</div>
			<div class="grid grid-cols-2 font-bold text-stone-500">
				<ul class="list-disc pl-5">
					<li>One-time</li>
					<li>No subscription</li>
				</ul>
				<ul class="list-disc pl-5">
					<li>30–60 photos</li>
					<li>Ready in 5 min</li>
				</ul>
			</div>
		</div>

		<img src="pics/prerendered.jpg" alt="" />

		<!-- <div class="flex w-full items-center justify-center">
			<img src="/pics/selfie-mockup.png" alt="Your selfie" class="h-80 -rotate-4 object-contain" />
			<Redo strokeWidth={3} class="size-12 -scale-x-100 rotate-170 text-stone-700" />
			<div class="relative">
				<img
					src="/pics/tinder-mockup.png"
					alt="Tinder profile"
					class="h-100 rotate-2 object-contain"
				/>
				<img
					src="/pics/verified.png"
					alt="Verified"
					class="absolute -top-4 right-0 size-16 object-contain"
				/>
				<div
					class="absolute right-0 bottom-0 rounded-full bg-linear-to-bl from-yellow-300 to-yellow-400 px-3 py-1 font-bold select-none"
				>
					99+
				</div>
			</div>
		</div> -->
	</div>

	<!-- SOCIAL PROOF -->
	<SocialProof
		avatars={[
			'/pics/review1.jpg',
			'/pics/review2.jpg',
			'/pics/review3.jpg',
			'/pics/review4.jpg',
			'/pics/review5.jpg'
		]}
		text="130+ guys upgraded their profiles this month"
	/>

	<PhotoRow generatedPhotos={bottomPhotos} />

	<!-- HOW IT WORKS -->
	<div id="how-it-works" class="space-y-4">
		<div class="font-bold text-stone-500">How it works</div>
		<div class="space-y-2">
			<div class="text-3xl font-bold">3 steps. 5 minutes. Done.</div>
			<p>
				No photographer. No awkward posing. No waiting days. Your profile gets upgraded tonight.
			</p>
		</div>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
			<div class="space-y-2 rounded-xl bg-stone-100 p-4">
				<div class="text-3xl">📸</div>
				<div class="font-bold">1. Upload 1 selfie</div>
				<p>One clear photo of your face is enough.</p>
			</div>
			<div class="space-y-2 rounded-xl bg-stone-100 p-4">
				<div class="text-3xl">✨</div>
				<div class="font-bold">2. Pick your styles</div>
				<p>Outdoor, urban, dressed up, golden hour.</p>
			</div>
			<div class="space-y-2 rounded-xl bg-stone-100 p-4">
				<div class="text-3xl">🔥</div>
				<div class="font-bold">3. Start matching</div>
				<p>Photos land in 5 minutes. New matches by morning.</p>
			</div>
		</div>
	</div>

	<!-- WHY MANBLINK -->
	<div class="space-y-4">
		<div class="font-bold text-stone-500">Why Manblink</div>
		<div class="space-y-2">
			<div class="text-3xl font-bold">Your photos are the bottleneck. We fix that.</div>
			<p>
				90% of swipe decisions happen before anyone reads your bio. Your photos are either getting
				you matches or killing them.
			</p>
		</div>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
			<div class="space-y-2 rounded-xl bg-stone-100 p-4">
				<div class="text-3xl">⚡</div>
				<div class="font-bold">Done in 5 minutes</div>
				<p>
					Upload your selfie, pick your styles, done. Your profile is updated tonight — not next
					month.
				</p>
			</div>
			<div class="space-y-2 rounded-xl bg-stone-100 p-4">
				<div class="text-3xl">🎯</div>
				<div class="font-bold">Built for dating apps</div>
				<p>
					Every style is designed for Tinder, Bumble, and Hinge. Not LinkedIn. Not Instagram. Dating
					profiles, specifically.
				</p>
			</div>
			<div class="space-y-2 rounded-xl bg-stone-100 p-4">
				<div class="text-3xl">🔒</div>
				<div class="font-bold">Your photos stay yours</div>
				<p>
					We don't sell your face. We don't use it for training. Want them deleted? A real human
					handles it in 10 minutes.
				</p>
			</div>
		</div>
	</div>

	<!-- PHOTO EXAMPLES -->
	<div class="space-y-4">
		<div class="font-bold text-stone-500">Real results</div>
		<div class="space-y-2">
			<div class="text-3xl font-bold">Same guy. Completely different first impression.</div>
			<p>Every photo below was made from 1 selfie. Same face. Different vibes.</p>
		</div>
		<PhotoRow sourceImg="/pics/src1.jpg" generatedPhotos={heroPhotos} />
	</div>

	<!-- REVIEWS -->
	<div class="space-y-4">
		<div class="font-bold text-stone-500">What to expect</div>
		<div class="text-3xl font-bold">Guys who stopped blaming the algorithm.</div>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
			{#each reviews as r (r.name)}
				<ReviewCard name={r.name} avatar={r.avatar} quote={r.quote} />
			{/each}
		</div>
	</div>

	<!-- PRICING COMPARISON -->
	<div class="space-y-4">
		<div class="font-bold text-stone-500">Compare</div>
		<div class="space-y-2">
			<div class="text-3xl font-bold">Same result. 1% of the price.</div>
			<p>A photographer charges $300–800 for 20 photos and a week of waiting.</p>
		</div>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<div class="space-y-4 rounded-xl border-4 border-stone-200 p-4">
				<div class="font-bold text-stone-500">Photographer</div>
				<div class="text-3xl font-bold">$300–800</div>
				<ul class="space-y-2">
					{#each ['$300–800 for 20 edited photos', '1–2 weeks just to get a booking', 'Posing in public like a tourist', 'Wait 5–7 days for delivery', '1 location, 1–2 outfit changes'] as item (item)}
						<li class="flex items-center gap-2 text-stone-500">
							<X strokeWidth={3} class="size-6 shrink-0" />
							{item}
						</li>
					{/each}
				</ul>
			</div>
			<div class="space-y-4 rounded-xl bg-stone-100 p-4">
				<div class="font-bold text-rose-500">Manblink</div>
				<div class="text-3xl font-bold">From $29</div>
				<ul class="space-y-2">
					{#each ['30–60 dating-ready photos from 1 selfie', 'Over 50 styles — from cafe to skydiving', 'Done in 5 minutes from your couch', 'Looks natural — not like you tried too hard', 'Passes Tinder, Bumble & Hinge verification', 'Real human support via Telegram & WhatsApp'] as item (item)}
						<li class="flex items-center gap-2">
							<Check strokeWidth={3} class="size-6 shrink-0 text-rose-500" />
							{item}
						</li>
					{/each}
				</ul>
			</div>
		</div>
		<div class="flex flex-col gap-3">
			<a
				href="/app/quiz"
				class="flex min-h-16 w-full cursor-pointer items-center justify-center rounded-xl bg-rose-500 px-4 py-3 font-bold text-white hover:bg-rose-600"
			>
				Get Started — from $29
			</a>
			<p class="text-stone-500">One-time payment. No subscription.</p>
		</div>
	</div>

	<!-- FAQ -->
	<div class="space-y-4">
		<div class="font-bold text-stone-500">FAQ</div>
		<div class="text-3xl font-bold">Questions? We got you.</div>
		<div class="space-y-2">
			{#each faqs as faq, i (faq.q)}
				<div class="overflow-hidden rounded-xl bg-stone-100">
					<button
						onclick={() => (openFaq = openFaq === i ? null : i)}
						class="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left"
					>
						<span class="font-bold">{faq.q}</span>
						<ChevronDown
							class="ml-4 size-6 shrink-0 transition-transform {openFaq === i ? 'rotate-180' : ''}"
							strokeWidth={3}
						/>
					</button>
					{#if openFaq === i}
						<div class="px-4 pb-4 text-stone-500">{faq.a}</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<!-- FINAL CTA -->
	<div class="grid grid-cols-1 gap-8 pb-8 sm:grid-cols-2">
		<div class="space-y-4">
			<div class="space-y-2">
				<div class="text-3xl font-bold">Stop overthinking it. Start matching.</div>
				<p class="text-stone-500">
					1 selfie. 30–60 dating photos. From $29. No photographer. No awkward poses.
				</p>
			</div>
			<a
				href="/app/quiz"
				class="flex min-h-16 w-full cursor-pointer items-center justify-center rounded-xl bg-rose-500 px-4 py-3 font-bold text-white hover:bg-rose-600"
			>
				Get Started Now — from $29
			</a>
			<p class="text-stone-500">One-time payment. Not a subscription.</p>
		</div>
		<div class="space-y-4">
			<div class="space-y-2">
				<div class="text-3xl font-bold">Still have questions?</div>
				<p class="text-stone-500">Get a human answer within 12h</p>
			</div>
			<div class="flex flex-col gap-3">
				<a
					href="https://t.me/oricoac"
					target="_blank"
					class="relative flex min-h-16 w-full cursor-pointer items-center justify-center rounded-xl bg-stone-200 px-4 py-3 font-bold hover:bg-stone-300"
				>
					<Send class="absolute right-6 size-6" strokeWidth={3} />
					Ask on Telegram
				</a>
				<a
					href="https://wa.me/85293247714"
					target="_blank"
					class="relative flex min-h-16 w-full cursor-pointer items-center justify-center rounded-xl bg-stone-200 px-4 py-3 font-bold hover:bg-stone-300"
				>
					<MessageCircle class="absolute right-6 size-6" strokeWidth={3} />
					Ask on WhatsApp
				</a>
			</div>
		</div>
	</div>
</div>

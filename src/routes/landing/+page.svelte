<script lang="ts">
	import PhotoRow from '$lib/components/PhotoRow.svelte';
	import ReviewCard from '$lib/components/ReviewCard.svelte';
	import SocialProof from '$lib/components/SocialProof.svelte';
	import FaqList from '$lib/components/FaqList.svelte';
	import { Check, X } from '@lucide/svelte';

	const sameGuy = [
		{ src: '/pics/gen1.jpeg' },
		{ src: '/pics/gen3.jpeg' },
		{ src: '/pics/gen2.jpeg' }
	];
	const everythingNeeds = [
		{ src: '/pics/gen9.jpeg' },
		{ src: '/pics/gen2.jpeg' },
		{ src: '/pics/gen4.jpeg' },
		{ src: '/pics/gen5.jpeg' }
	];
	const oneSelfie = [
		{ src: '/pics/gen11.jpeg' },
		{ src: '/pics/gen10.jpeg' },
		{ src: '/pics/gen7.jpeg' },
		{ src: '/pics/gen6.jpeg' }
	];
	const stopOverthinking = [
		{ src: '/pics/gen10.jpeg' },
		{ src: '/pics/gen8.jpeg' },
		{ src: '/pics/gen1.jpeg' },
		{ src: '/pics/gen4.jpeg' }
	];

	const reviews = [
		{
			name: 'Jake, 23',
			avatar: '/pics/review1.jpg',
			quote:
				"About to delete Tinder. Uploaded one selfie at 2am. Got my photos by 2:05am. Updated my profile and woke up to new matches I didn't have before.",
			result: 'From zero matches to double digits overnight'
		},
		{
			name: 'Marcus, 25',
			avatar: '/pics/review2.jpg',
			quote:
				'Updated my Tinder with new photos. Changed nothing else — same bio, same prompts. The only difference was better photos.'
		},
		{
			name: 'Tyler, 21',
			avatar: '/pics/review3.jpg',
			quote:
				'The girl who unmatched me rematched after I updated my photos. Better photos change how people see you.',
			result: 'Same guy. Better first impression.'
		},
		{
			name: 'Daniel, 26',
			avatar: '/pics/review4.jpg',
			quote:
				'Spent 6 months thinking Tinder was broken. Turns out it was just my photos. Changed nothing else. Same bio. Same prompts. Just better photos.',
			result: "It's not the app. It's the photos."
		},
		{
			name: 'Ryan, 24',
			avatar: '/pics/review5.jpg',
			quote:
				'My profile went from 3 gym selfies to looking like I actually have a life. The variety is what makes the difference — different settings, different outfits, same face.',
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
			q: 'Do these pass Tinder / Bumble / Hinge verification?',
			a: "Yes. Every photo keeps your real face consistent. Built to work with dating app verification systems. You'll still look like you — just with better presentation."
		},
		{
			q: 'Do they actually look like me?',
			a: 'Yes. Your face stays consistent across every photo. Same features, same face shape, same you. Just in better settings with better lighting. Think: the difference between a bathroom selfie and a photo a talented friend took of you.'
		},
		{
			q: 'Why 30-60 photos instead of 100?',
			a: "Other apps dump 100+ photos on you but only 3-5 actually look real. We generate fewer photos because every single one is usable. Quality over quantity. You'll actually use these."
		},
		{
			q: 'How fast do I get my photos?',
			a: "About 5 minutes. You'll see them appearing one by one as they generate — not a blank loading screen. Your profile can be updated tonight."
		},
		{
			q: 'I only need one selfie?',
			a: "Yep. One. Most competitors need 10-20 uploads. We need one clear selfie — front-facing, decent lighting, no sunglasses. That's literally it."
		},
		{
			q: 'Is this catfishing?',
			a: "No. These are better photos of the real you — not a different person. Same face, better presentation. It's the difference between showing up in sweatpants vs. showing up in something you feel good in. Your date will recognize you."
		},
		{
			q: 'Is my data private?',
			a: "Yes. Your selfie and photos are yours. We don't share, sell, or use your images for anything else. Need something deleted? Message us and a real human handles it in minutes."
		},
		{
			q: "What if I don't like the results?",
			a: "Message us on Telegram — a real human responds within 10 minutes. We'll work with you to get the results right. You're not dealing with a faceless company."
		},
		{
			q: "What's the difference between the $29 and $49 plan?",
			a: '$29 gets you 30 photos across. $49 gets you 60 photos — double the variety. Both are one-time payments.'
		}
	];
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
					<li>One-time payment</li>
					<li>No subscription</li>
				</ul>
				<ul class="list-disc pl-5">
					<li>30–60 photos</li>
					<li>Ready in 5 min</li>
				</ul>
			</div>
		</div>
		<img src="pics/prerendered.jpg" alt="" class="w-full rounded-xl" />
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
		text="1200+ guys upgraded their profiles this month"
	/>

	<!-- PHOTO EXAMPLES -->
	<div class="space-y-4">
		<div class="font-bold text-stone-500 uppercase">Real transformations</div>
		<div class="space-y-2">
			<div class="text-3xl font-bold">Same guy. Completely different first impression.</div>
			<p>
				Every photo below was made from 1 selfie. Same face. Different vibes. Each one is a match
				waiting to happen.
			</p>
		</div>
		<PhotoRow sourceImg="/pics/src1.jpg" generatedPhotos={sameGuy} />
	</div>

	<!-- <PhotoRow generatedPhotos={bottomPhotos} /> -->

	<!-- HOW IT WORKS -->
	<div id="how-it-works" class="space-y-4">
		<div class="font-bold text-stone-500 uppercase">How it works</div>
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
				<p>
					Just one clear photo of your face. No album. No 20 uploads. One selfie and you're done.
				</p>
			</div>
			<div class="space-y-2 rounded-xl bg-stone-100 p-4">
				<div class="text-3xl">✨</div>
				<div class="font-bold">2. Pick your vibe</div>
				<p>
					Outdoor? Urban? Dressed up? Golden hour? Choose the styles that match who you actually
					are.
				</p>
			</div>
			<div class="space-y-2 rounded-xl bg-stone-100 p-4">
				<div class="text-3xl">🔥</div>
				<div class="font-bold">3. Start matching</div>
				<p>
					Photos land in 5 minutes. New matches by morning. New profile tonight. New matches by
					morning.
				</p>
			</div>
		</div>
	</div>

	<!-- WHAT YOU GET -->
	<div class="space-y-4">
		<div class="font-bold text-stone-500 uppercase">What you get</div>
		<div class="text-3xl font-bold">Everything your dating profile needs. Nothing it doesn't.</div>
		<PhotoRow generatedPhotos={everythingNeeds} />

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
			<div class="space-y-2 rounded-xl bg-stone-100 p-4">
				<div class="text-3xl">💘</div>
				<div class="font-bold">Built for dating apps. Not Instagram.</div>
				<p>
					Every style is designed for Tinder, Bumble, Hinge. Coffee shop. Rooftop. Golden hour.
					Urban. Nightlife. Photos that get likes.
				</p>
			</div>
			<div class="space-y-2 rounded-xl bg-stone-100 p-4">
				<div class="text-3xl">✅</div>
				<div class="font-bold">Passes Tinder verification</div>
				<p>
					Your face stays consistent across every photo. Same bone structure, same features, just
					better lighting and settings. You'll still look like you on the date.
				</p>
			</div>
			<div class="space-y-2 rounded-xl bg-stone-100 p-4">
				<div class="text-3xl">💸</div>
				<div class="font-bold">$29 vs $300. Same result.</div>
				<p>
					A photographer costs $300-800 and takes a week. This costs $29 and takes 5 minutes. Same
					quality. Zero awkwardness. No posing in public.
				</p>
			</div>
		</div>
	</div>

	<!-- WHY MANBLINK -->
	<div class="space-y-4">
		<div class="font-bold text-stone-500 uppercase">Why Manblink</div>
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
				<div class="text-3xl">🔒</div>
				<div class="font-bold">Your photos stay yours</div>
				<p>
					We don't sell your face. We don't use it for training. Want them deleted? A real human
					handles it in 10 minutes.
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
		</div>
	</div>

	<!-- REAL OUTPUT -->
	<div class="space-y-4">
		<div class="font-bold text-stone-500 uppercase">Real output</div>
		<div class="space-y-2">
			<div class="text-3xl font-bold">1 selfie. All of this.</div>
			<p>
				Same face. Different vibes. Every photo below was generated from a single selfie in under 5
				minutes.
			</p>
		</div>
		<PhotoRow generatedPhotos={oneSelfie} />
	</div>

	<!-- REVIEWS -->
	<div class="space-y-4">
		<div class="font-bold text-stone-500 uppercase">What to expect</div>
		<div class="text-3xl font-bold">Guys who stopped blaming the algorithm.</div>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
			{#each reviews as r (r.name)}
				<ReviewCard name={r.name} avatar={r.avatar} quote={r.quote} />
			{/each}
		</div>
	</div>

	<!-- PRICING COMPARISON -->
	<div class="space-y-4">
		<div class="font-bold text-stone-500 uppercase">Compare</div>
		<div class="space-y-2">
			<div class="text-3xl font-bold">Same result. 1% of the price.</div>
			<p>A photographer charges $300–800 for 20 photos and a week of waiting.</p>
		</div>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<div class="space-y-4 rounded-xl border-4 border-stone-200 p-4">
				<div class="font-bold text-stone-500">Photographer</div>
				<div class="text-3xl font-bold">$300–800</div>
				<ul class="space-y-2">
					{#each ['$300–800 for 20 edited photos', '1–2 weeks just to get a booking', 'Posing in public like a tourist', 'Wait 5–7 days for delivery', '1 location, 1–2 outfit changes', 'Still looks like you hired a photographer'] as item (item)}
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
		<div class="font-bold text-stone-500 uppercase">FAQ</div>
		<div class="text-3xl font-bold">Questions? We got you.</div>
		<FaqList {faqs} />
	</div>

	<!-- FINAL CTA -->
	<div class="grid grid-cols-1 gap-8 pb-8">
		<div class="space-y-4">
			<div class="flex w-full flex-col justify-center space-y-2">
				<PhotoRow generatedPhotos={stopOverthinking} />
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
		<!-- <div class="space-y-4">
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
		</div> -->
	</div>
</div>

import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Prompt } from '$lib/types';

function sessionStore<T>(key: string, initial: T) {
	const stored = browser ? sessionStorage.getItem(key) : null;
	const store = writable<T>(stored ? JSON.parse(stored) : initial);
	if (browser) {
		store.subscribe((value) => sessionStorage.setItem(key, JSON.stringify(value)));
	}
	return store;
}

export const selectedPrompts = sessionStore<Prompt[]>('selectedPrompts', []);
export const uploadedSelfieBase64 = sessionStore<string | null>('uploadedSelfieBase64', null);
export const generationStartTime = sessionStore<number>('generationStartTime', 0);
export const photosInCount = sessionStore<number>('photosInCount', 0);

export const screenTitle = writable<string>('');
export const fixedBar = writable<boolean>(false)
export const fullSreen = writable<boolean>(true)
export const userCredits = writable<number | null>(null)
export const navProgress = writable<number | null>(null)

export function resetAppState() {
	selectedPrompts.set([]);
	uploadedSelfieBase64.set(null);
	generationStartTime.set(0);
	photosInCount.set(0);
}

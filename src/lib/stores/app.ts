import { writable } from 'svelte/store';
export const generatedPhotoIds = writable<string[]>([]);
import { browser } from '$app/environment';
import type { Prompt } from '$lib/types';

function localStore<T>(key: string, initial: T) {
	const stored = browser ? localStorage.getItem(key) : null;
	const store = writable<T>(stored ? JSON.parse(stored) : initial);
	if (browser) {
		store.subscribe((value) => localStorage.setItem(key, JSON.stringify(value)));
	}
	return store;
}

export const selectedPrompts = localStore<Prompt[]>('selectedPrompts', []);
export const uploadedSelfieBase64 = localStore<string | null>('uploadedSelfieBase64', null);
export const generationStartTime = localStore<number>('generationStartTime', 0);
export const generationComplete = localStore<boolean>('generationComplete', false);

export const screenTitle = writable<string>('');
export const fullSreen = writable<boolean>(true)
export const userCredits = writable<number | null>(null)
export const navStepsTotal = localStore<number | null>('navStepsTotal', null)
export const navCurrentStep = localStore<number | null>('navCurrentStep', null)
export const navDirection = writable<'forward' | 'backward'>('forward')
export const navBackOverride = writable<(() => void) | null>(null)

export interface BottomBarButton {
	label: string;
	onclick: () => void;
	disabled?: boolean;
	variant?: 'primary' | 'secondary' | 'dark';
}
export const bottomBar = writable<BottomBarButton[] | null>(null);

export function resetAppState() {
	selectedPrompts.set([]);
	uploadedSelfieBase64.set(null);
	generationStartTime.set(0);
	generationComplete.set(false);
}

import { writable } from 'svelte/store';
import type { Prompt } from '$lib/types';

export const selectedPrompts = writable<Prompt[]>([]);
export const uploadedSelfieBase64 = writable<string | null>(null);
export const generationStartTime = writable<number>(0);
export const photosInCount = writable<number>(0);

export const screenTitle = writable<string>('');
export const fixedBar = writable<boolean>(false)
export const fullSreen = writable<boolean>(true)

export function resetAppState() {
	selectedPrompts.set([]);
	uploadedSelfieBase64.set(null);
	generationStartTime.set(0);
	photosInCount.set(0);
}

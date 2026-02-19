<script lang="ts">
	let {
		show = $bindable(),
		value = $bindable(''),
		placeholder = '',
		submitLabel = 'Save',
		cancelLabel = 'Cancel',
		onsubmit,
		oncancel = () => {}
	}: {
		show: boolean;
		value?: string;
		placeholder?: string;
		submitLabel?: string;
		cancelLabel?: string;
		onsubmit: (text: string) => void;
		oncancel?: () => void;
	} = $props();

	function lockScroll(node: HTMLElement) {
		document.body.style.overflow = 'hidden';
		return {
			destroy() {
				document.body.style.overflow = '';
			}
		};
	}

	function handleSubmit() {
		if (!value.trim()) return;
		const text = value.trim();
		value = '';
		show = false;
		onsubmit(text);
	}

	function handleCancel() {
		value = '';
		show = false;
		oncancel();
	}
</script>

{#if show}
	<div use:lockScroll class="fixed inset-0 z-10 flex h-dvh items-center justify-center bg-white px-4">
		<div class="w-full max-w-md space-y-4">
			<textarea
				bind:value
				{placeholder}
				class="h-32 w-full resize-none rounded-xl bg-stone-200 p-4 font-bold placeholder-stone-700 outline-none focus:ring-4 focus:ring-rose-500"
			></textarea>
			<div class="flex gap-4">
				<button
					onclick={handleCancel}
					class="h-16 flex-1 cursor-pointer rounded-xl bg-stone-200 font-bold text-stone-800 hover:bg-stone-300"
				>
					{cancelLabel}
				</button>
				<button
					onclick={handleSubmit}
					disabled={!value.trim()}
					class="h-16 flex-1 cursor-pointer rounded-xl bg-rose-500 font-bold text-white hover:bg-rose-600 disabled:cursor-default disabled:bg-stone-100 disabled:text-stone-300"
				>
					{submitLabel}
				</button>
			</div>
		</div>
	</div>
{/if}

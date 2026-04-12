You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.

---

## UI Style Guidelines

### Typography
- **Single font size** — never set `text-xs`, `text-sm`, `text-xl`, `text-2xl`, `text-3xl`, etc. Let the browser default size apply everywhere.
- **Font weight** — do not set `font-bold` by default. Only use it on special elements: headings, section labels, button text, prices, names, key terms in a list.
- **Text color** — do not set a text color by default. Only use `text-stone-500` when an element needs to read as secondary/muted. Use `text-white` on dark backgrounds. Use `text-rose-500` for accent/highlight text. Use `fill-amber-500 text-amber-500` for stars.

### Spacing & Layout
- **Page wrapper**: outer `flex justify-center`, inner `flex w-full max-w-md flex-col space-y-8`
- **Section spacing**: `space-y-8` between major sections; `space-y-4` between a section label and its content; `space-y-2` between a heading and its subtitle/body
- **Grid gaps**: `gap-4` standard, `gap-3` for tighter packed grids
- **Inline icon + text**: `flex items-center gap-2`
- **Button row**: `flex gap-4`

### Cards & Containers
- **Card**: `rounded-xl border-2 border-stone-200 p-4 hover:border-rose-500`
- **Border container**: `rounded-xl border-2 border-stone-200`
- **Row item** (inside a container): `flex justify-between px-4 py-3`
- **Highlighted row** (dark): `bg-stone-800 px-4 py-3 font-bold text-white`

### Buttons
- Standard button: `py-3 min-h-16 w-full max-w-md cursor-pointer rounded-xl bg-rose-500 px-4 font-bold text-white hover:bg-rose-600`
- Secondary button: `py-3 min-h-16 w-full max-w-md cursor-pointer rounded-xl bg-stone-200 px-4 font-bold hover:bg-stone-300`
- Disabled state: add `disabled:cursor-default disabled:bg-stone-100 disabled:text-stone-300`

### Sticky bottom bars
- All `fixed bottom-0` bars must include `border-t-2 border-stone-200`
- Standard wrapper: `fixed right-0 bottom-0 left-0 flex justify-center border-t-2 border-stone-200 bg-white px-4 pt-4 pb-4 sm:px-8 md:px-12 lg:px-16 xl:px-32 2xl:px-64`

### Icons
- All icons use `strokeWidth={3}`
- Size is context-dependent (`size-6`, `size-5`, `size-6`, etc.) — use `size-6` for standard inline/action icons, smaller for compact contexts

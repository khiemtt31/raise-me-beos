// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	build: {
		// Keep styles external so the security policy needs no unsafe-inline.
		inlineStylesheets: 'never',
	},
	vite: {
		build: { assetsInlineLimit: 0 },
	},
	devToolbar: {
		enabled: false,
	},
});

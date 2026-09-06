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
		server: {
			proxy: {
				'/api': {
					target: 'http://127.0.0.1:8787',
					changeOrigin: false,
				},
			},
		},
	},
	devToolbar: {
		enabled: false,
	},
});

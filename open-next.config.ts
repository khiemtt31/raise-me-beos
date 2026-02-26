import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  buildOptions: {
    // Disable esbuild keepNames to prevent __name helper missing-chunk errors
    esbuildOptions: {
      keepNames: false,
    },
  },
});

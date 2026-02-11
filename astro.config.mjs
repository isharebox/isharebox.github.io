import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro';
import { fileURLToPath } from 'url';

// https://astro.build/config
export default defineConfig({
  site: 'https://isharebox.github.io',
  output: import.meta.env.DEV ? 'server' : 'static',
  integrations: [UnoCSS({ injectReset: true })],
  server: {
    host: true
  },
  vite: {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "urodele.config": fileURLToPath(new URL("./urodele.config.ts", import.meta.url))
      },
    },
  },
});

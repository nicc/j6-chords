import { defineConfig } from 'vitest/config';
import preact from '@preact/preset-vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Single self-contained index.html: data, JS and CSS are inlined, nothing is fetched.
export default defineConfig({
  plugins: [preact(), viteSingleFile()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['test/setup.ts'],
  },
});

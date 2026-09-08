import { defineConfig } from 'vite';
// vite.config.ts
export default defineConfig({
  base: '/mudaliyar-sangam-portal/', // உங்கள் repository பெயர்
  plugins: [react(), tailwindcss()],
  // ...
});

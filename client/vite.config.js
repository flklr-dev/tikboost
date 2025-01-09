import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
    'import.meta.env.VITE_API_URL': JSON.stringify('https://tikboost.onrender.com'),
    'import.meta.env.VITE_RECAPTCHA_SITE_KEY': JSON.stringify('6LeJT7IqAAAAAEA85LzzoIuzgvpaPynB4GAs0UlW'),
  },
})

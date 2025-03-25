import { type Config } from 'tailwindcss'

export default {
  darkMode: ['class', 'dark'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [],
} satisfies Config

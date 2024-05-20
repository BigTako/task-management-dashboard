import { type Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.tsx'],
  theme: {
    colors: {
      white: '#FFF',
      black: '#000',
      'avocado-light': '#D9E4DD',
      'sandy-light': '#FBF7F0',
      'sandy-semilight': '#CDC9C3',
      'sandy-dark': '#555555',
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;

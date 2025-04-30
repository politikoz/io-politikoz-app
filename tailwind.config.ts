import type { Config } from 'tailwindcss';

const config: Config = {
  mode: 'jit',
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // Inclui arquivos no App Router.
    './pages/**/*.{js,ts,jsx,tsx}', // Caso use arquivos fora do App Router.
    './components/**/*.{js,ts,jsx,tsx}', // Componentes reutilizáveis.
  ],
  theme: {
    screens: {
      xs: "480px", // ou qualquer outro valor para pequenos dispositivos
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'], // Fonte para estética pixelada.
        sans: ['Roboto', 'Arial', 'sans-serif'], // Fontes padrão.
      },
      colors: {
        dark: '#1e1e2e',
        light: '#f5f5f5',
        primary: {
          DEFAULT: '#ff3e00', // Cor vibrante primária.
          hover: '#ff5722', // Cor ao passar o mouse.
        },
        secondary: {
          DEFAULT: '#00d1b2',
          hover: '#00e5c4',
        },
      },
      boxShadow: {
        'pixel-art': '4px 4px 0px 0px #000', // Sombra estilo pixel.
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite', // Animação lenta.
      },
      keyframes: {
        bounce: {
          '0%, 100%': { transform: 'translateY(-10%)' },
          '50%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Para estilização de formulários.
    require('@tailwindcss/typography'), // Para estilização de textos.
  ],
  darkMode: 'class', // Habilita modo escuro via classe "dark".
};

export default config;
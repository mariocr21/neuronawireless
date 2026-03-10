import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                app: {
                    shell: '#06110d',
                },
                brand: {
                    ink: '#04110b',
                    black: '#020504',
                    dark: '#101915',
                    green: '#59d94f',
                    spring: '#95f46f',
                    mist: '#9fb4a8',
                    sky: '#58b8ff',
                    gold: '#f3c969',
                    danger: '#ff6b6b',
                }
            },
            fontFamily: {
                sans: ['Manrope', 'sans-serif'],
                display: ['Space Grotesk', 'sans-serif'],
            },
            boxShadow: {
                card: '0 24px 60px rgba(0, 0, 0, 0.25)',
                'soft-glow': '0 0 30px rgba(89, 217, 79, 0.35)',
            }
        },
    },
    plugins: [
        forms,
        typography,
    ],
}

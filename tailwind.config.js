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
                brand: {
                    black: '#000000',
                    dark: '#252625',
                    green: {
                        DEFAULT: '#0ba703',
                        light: '#0fff00',
                    },
                    positive: '#21BA45',
                    negative: '#C10015',
                    info: '#31CCEC',
                    warning: '#F2C037'
                }
            },
            fontFamily: {
                sans: ['Quicksand', 'Inter', 'sans-serif'],
            }
        },
    },
    plugins: [
        forms,
        typography,
    ],
}

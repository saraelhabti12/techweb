import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class", // 🔥 ajoute cette ligne !

    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        // extend: {
        //     fontFamily: {
        //         sans: ['Poppins', ...defaultTheme.fontFamily.sans],
        //     },
        // },

        extend: {
            fontFamily: {
                quicksand: ['Quicksand', 'sans-serif'],
            },
        },
    },

    plugins: [forms],
};

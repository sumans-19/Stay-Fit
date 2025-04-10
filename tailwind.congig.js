// tailwind.config.js
export const content = ["./src/**/*.{js,jsx,ts,tsx}"];
export const theme = {
    extend: {
        animation: {
            fadeIn: 'fadeIn 1s ease-in-out',
            slideIn: 'slideIn 1s ease-in-out',
        },
        keyframes: {
            fadeIn: {
                '0%': { opacity: 0 },
                '100%': { opacity: 1 },
            },
            slideIn: {
                '0%': { transform: 'translateY(-20px)', opacity: 0 },
                '100%': { transform: 'translateY(0)', opacity: 1 },
            },
        },
    },
};
export const plugins = [];
  
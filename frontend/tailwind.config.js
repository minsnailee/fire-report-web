/** @type {import('tailwindcss').Config} */
export default {
   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
   theme: {
      extend: {
         fontFamily: {
            suit: ["'SUIT Variable'", "sans-serif"],
            pretendard: ["'Pretendard Variable'", "sans-serif"],
         },
      },
   },
   plugins: [],
};

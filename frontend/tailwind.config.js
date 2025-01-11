/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      scrollbar: {
        DEFAULT: {
          thumb: "rounded bg-gray-500 hover:bg-gray-700",
          track: "rounded bg-gray-200",
        },
      },
    },
    plugins: [require("tailwind-scrollbar")],
  },
};

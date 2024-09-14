/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/popup/index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(90deg, #fff0, #00fceb 100%, #00fceb)",
      },
    },
  },
  plugins: [],
};

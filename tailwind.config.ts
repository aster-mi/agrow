import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

const colors = require("tailwindcss/colors");

module.exports = {
  plugins: [require("flowbite/plugin")],
  content: ["./node_modules/flowbite/**/*min.js"],
};

export default config;

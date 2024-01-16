/** @type {import('tailwindcss').Config} */

module.exports = {
  purge: {
    content: ['./src/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
    options: {
      safelist: [/^bg-/, /^text-/], // Add any additional classes you want to preserve
    },
  },
};
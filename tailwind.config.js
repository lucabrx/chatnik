/** @type {import('tailwindcss').Config} */
module.exports = {
    purge: [
    './src/components/**/*.tsx',
    './src/app/**/*.tsx',
  ],
  theme: {
    container: {
      center: true,
      padding: '1,5rem',
      screens: {
        '2xl' :'1360px'
      },
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        "cta" : "#f7449a",
        "text" : "#f5f5f5",
        "bg" : "#0c1017",
        "sidebar" : "#0D3B4C",
        "text-sec" : "#d4d4d4",
        "input" : "#696969"
      }
    },

  },
  plugins: [require('@tailwindcss/forms')],
}

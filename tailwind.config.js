/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        lightGray: '#ecf0f1',
        gray: '#7f8c8d',
        darkGray: '#2c3e50',
        delete: '#ba2049',
        vital: '#d53e4f',
        important: '#f46d43',
        urgent: '#EEA141',
        trivial: '#7ebb69',
        completed: '#17A78B',
        pending: '#1abc9c',
        recurring: '#378ebb',
        occasional: '#469eb4',
        mode: '#535ea9'
      }
    }
  },
  plugins: []
}

/** @type {import('tailwindcss').Config} */
import defaultColors from 'tailwindcss/colors';

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      ...defaultTheme.screens,
      '3xsm': '375px',
      '2xsm': '400px',
      xsm: '425px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
    colors: {
      ...defaultColors,
      primary: '#ec1f24',
      secondary: '#f46539',
      heading: '#1A1A1A',
      'sub-heading': '#3A3A3A',
    },
    fontSize: {
      ...defaultTheme.fontSize,
      'lg-heading': '60px',
      'md-heading': '38px',
      'sm-heading': '38px',
      'lg-sub-heading': '22px',
      'md-sub-heading': '18px',
      'sm-sub-heading': '18px',
      'lg-body': '18px',
      'md-body': '9px',
      'sm-body': '9px',
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-radial-custom':
          'radial-gradient(circle at center, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

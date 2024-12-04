module.exports = {
  content: ["./src/**/*.{tsx}"],
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"], // this will remove unused css in these paths
  // mode: "jit", // this is to allow just in time compilation of tailwind
  darkMode: "class", // this will look into the a parent element with a "dark" class
  // and will use a dark variant for any of its children
  // as such to implement dark mode just apply this dark:bg-gray-900 dark:text-white
  theme: {
    fontFamily: {
      display: ["Open Sans", "sans-serif"],
      body: ["Open Sans", "sans-serif"],
    },
    extend: {
      fontSize: {
        14: "14px",
      },
      width: {
        // this can also be done with the colors
        400: "400px",
        760: "760px",
        780: "780px",
        800: "800px",
        1000: "1000px",
        1200: "1200px",
        1400: "1400px",
      },
      height: {
        80: "80px",
      },
      minHeight: {
        590: "590px",
      },
    },
  },
  plugins: [],
};

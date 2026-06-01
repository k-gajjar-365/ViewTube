/** @type {import('tailwindcss').Config} */
export default {
   content: ["./index.html", "./src/**/*.{js,jsx}"],
   theme: {
      extend: {
         screens: {
            mobile: { max: "640px" },
            tablet: { min: "641px", max: "1024px" },
            desktop: { min: "1025px" },
         },
         colors: {
            app: {
               bg: "#0f0f0f",
               sidebar: "#111111",
               card: "#1a1a1a",
               border: "#2a2a2a",
               accent: "#7c3aed",
               "accent-hover": "#6d28d9",
               "text-primary": "#ffffff",
               "text-secondary": "#aaaaaa",
               muted: "#666666",
            },
         },
         borderRadius: {
            card: "8px",
            pill: "20px",
         },
         fontFamily: {
            sans: ["Roboto", "sans-serif"],
         },
         boxShadow: {
            card: "0 6px 20px rgba(0, 0, 0, 0.25)",
         },
      },
   },
   plugins: [],
};

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        cairo: ["Cairo", "sans-serif"]
      },
      colors: {
        brand: {
          50: "#eef8ff",
          100: "#d8efff",
          500: "#1170b0",
          700: "#0d5382",
          900: "#0a3555"
        },
        accent: {
          500: "#ef4444",
          600: "#dc2626"
        }
      },
      boxShadow: {
        soft: "0 12px 30px rgba(13, 83, 130, 0.16)"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        }
      },
      animation: {
        "fade-up": "fade-up 700ms ease-out both",
        "fade-in": "fade-in 800ms ease-out both"
      }
    }
  },
  plugins: []
};


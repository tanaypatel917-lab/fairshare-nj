import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "#0E0F12",
        paper2: "#181A20",
        ink: "#F1EDE4",
        ink2: "#CFC9BD",
        mute: "#8B877E",
        line: "#F1EDE4",
        orange: "#2E5BFF",
        lime: "#E8FF4F",
        sky: "#8FB3FF",
        rose: "#FF6B9A",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        hard: "6px 6px 0 0 #2E5BFF",
        hardSm: "3px 3px 0 0 #2E5BFF",
        hardLg: "10px 10px 0 0 #2E5BFF",
      },
      borderWidth: { 3: "3px" },
      keyframes: {
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        rise: { "0%": { opacity: "0", transform: "translateY(18px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        blink: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0" } },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        rise: "rise .6s cubic-bezier(.2,.8,.2,1) both",
        blink: "blink 1.1s steps(1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;

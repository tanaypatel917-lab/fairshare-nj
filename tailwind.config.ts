import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F4EFE6",
        paper2: "#EAE3D6",
        ink: "#141414",
        ink2: "#3A3732",
        mute: "#7A746A",
        line: "#141414",
        orange: "#FF5A1F",
        lime: "#C9F24B",
        sky: "#8BB8FF",
        rose: "#FFB4C6",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        hard: "6px 6px 0 0 #141414",
        hardSm: "3px 3px 0 0 #141414",
        hardLg: "10px 10px 0 0 #141414",
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

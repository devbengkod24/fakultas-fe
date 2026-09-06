import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "var(--prodi-primary, #0655A7)",
          "50": "var(--prodi-subtle, #f1f7fe)",
          "100": "var(--prodi-subtle, #e2eefc)",
          "200": "#bfdbf8",
          "300": "#86bef3",
          "400": "var(--prodi-primary-light, #1e7fd9)",
          "500": "var(--prodi-primary, #1e7fd9)", 
          "600": "var(--prodi-primary, #1063b9)", 
          "700": "#0e4f96",
          "800": "#10447c",
          "900": "#133a67",
          "950": "#0d2544",
        },
        secondary: {
          DEFAULT: "var(--prodi-secondary, #f4bd45)",
          "50": "#fefaec",
          "100": "#fceec9",
          "200": "#f8db8f",
          "300": "var(--prodi-secondary, #f4bd45)",
          "400": "#f2ab2d",
          "500": "#eb8b15",
          "600": "#d0670f",
          "700": "#ad4710",
          "800": "#8d3713",
          "900": "#742e13",
          "950": "#421606",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Branding Prodi Dinamis
        "prodi-start": "var(--prodi-gradient-start, #0655A7)",
        "prodi-end": "var(--prodi-gradient-end, #469cea)",
        "prodi-secondary": "var(--prodi-secondary, #f4bd45)",
        "prodi-subtle": "var(--prodi-subtle, #f1f7fe)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

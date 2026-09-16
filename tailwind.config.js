/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				tahini: {
					DEFAULT: "var(--color-tahini)",
					dark: "var(--color-tahini-dark)",
				},
				pumpkin: {
					DEFAULT: "var(--color-pumpkin)",
					dark: "var(--color-pumpkin-dark)",
					light: "var(--color-pumpkin-light)",
				},
				olive: {
					DEFAULT: "var(--color-olive)",
					light: "var(--color-olive-light)",
				},
				pine: {
					DEFAULT: "var(--color-pine)",
					dark: "var(--color-pine-dark)",
				},
				sage: "var(--color-sage)",
				cream: {
					DEFAULT: "var(--color-cream)",
					dark: "var(--color-cream-dark)",
				},
				"warm-white": "var(--color-warm-white)",
				"warm-gray": {
					DEFAULT: "var(--color-warm-gray)",
					light: "var(--color-warm-gray-light)",
				},
				primary: {
					DEFAULT: "var(--color-primary)",
					foreground: "var(--color-primary-foreground)",
				},
				secondary: {
					DEFAULT: "var(--color-secondary)",
					foreground: "var(--color-secondary-foreground)",
				},
				accent: {
					DEFAULT: "var(--color-accent)",
					foreground: "var(--color-accent-foreground)",
				},
				destructive: {
					DEFAULT: "var(--color-destructive)",
					foreground: "var(--color-destructive-foreground)",
				},
				muted: {
					DEFAULT: "var(--color-muted)",
					foreground: "var(--color-muted-foreground)",
				},
				background: "var(--color-background)",
				foreground: "var(--color-foreground)",
				card: {
					DEFAULT: "var(--color-card)",
					foreground: "var(--color-card-foreground)",
				},
				border: "var(--color-border)",
				input: "var(--color-input)",
				ring: "var(--color-ring)",
			},
			borderRadius: {
				sm: "var(--radius-sm)",
				md: "var(--radius-md)",
				lg: "var(--radius-lg)",
				xl: "var(--radius-xl)",
				"2xl": "var(--radius-2xl)",
				full: "var(--radius-full)",
			},
			fontFamily: {
				display: ["Baloo 2", "Poppins", "system-ui", "sans-serif"],
				sans: ["Nunito Sans", "Inter", "system-ui", "sans-serif"],
				mono: ["Fira Code", "monospace"],
			},
			boxShadow: {
				soft: "var(--shadow-soft)",
				card: "var(--shadow-card)",
				hover: "var(--shadow-hover)",
			},
		},
	},
	plugins: [],
}
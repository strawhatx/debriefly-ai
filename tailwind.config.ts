
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
		colors: {
			border: "var(--border)",
			input: "var(--input)",
			ring: "var(--ring)",
			background: "var(--background)",
			foreground: "var(--foreground)",
			primary: {
			  DEFAULT: "var(--primary)",
			  foreground: "var(--primary-foreground)",
			},
			secondary: {
			  DEFAULT: "var(--secondary)",
			  foreground: "var(--secondary-foreground)",
			},
			destructive: {
			  DEFAULT: "var(--destructive)",
			  foreground: "var(--destructive-foreground)",
			},
			muted: {
			  DEFAULT: "var(--muted)",
			  foreground: "var(--muted-foreground)",
			},
			accent: {
			  DEFAULT: "var(--accent)",
			  foreground: "var(--accent-foreground)",
			},
			popover: {
			  DEFAULT: "hsl(var(--popover)",
			  foreground: "hsl(var(--popover-foreground))",
			},
			card: {
			  DEFAULT: "var(--card)",
			  foreground: "var(--card-foreground)",
			},
		  },
  		keyframes: {
  			'fade-up': {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(10px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			'fade-down': {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(-10px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			}
  		},
  		animation: {
  			'fade-up': 'fade-up 0.5s ease-out',
  			'fade-down': 'fade-down 0.5s ease-out'
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

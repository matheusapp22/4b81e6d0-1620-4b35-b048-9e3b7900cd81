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
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					dark: 'hsl(var(--primary-dark))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))',
					muted: 'hsl(var(--primary-muted))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					dark: 'hsl(var(--secondary-dark))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
					dark: 'hsl(var(--muted-dark))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
					bright: 'hsl(var(--accent-bright))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
					glass: 'hsl(var(--card-glass))',
					border: 'hsl(var(--card-border))'
				},
				glass: {
					DEFAULT: 'hsl(var(--glass-background))',
					border: 'hsl(var(--glass-border))',
					'dark-background': 'hsl(var(--glass-dark-background))',
					'dark-border': 'hsl(var(--glass-dark-border))'
				},
				neon: {
					blue: 'hsl(var(--neon-blue))',
					cyan: 'hsl(var(--neon-cyan))',
					purple: 'hsl(var(--neon-purple))',
					green: 'hsl(var(--neon-green))',
					white: 'hsl(var(--neon-white))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				}
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-glass': 'var(--gradient-glass)',
				'gradient-neon': 'var(--gradient-neon)',
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-tech': 'var(--gradient-tech)'
			},
			boxShadow: {
				'glass': 'var(--shadow-glass)',
				'neon': 'var(--shadow-neon)',
				'card': 'var(--shadow-card)',
				'elevated': 'var(--shadow-elevated)',
				'hover-glow': 'var(--hover-glow)',
				'focus-glow': 'var(--focus-glow)'
			},
			fontFamily: {
				'sans': ['Inter', 'SF Pro Display', 'system-ui', '-apple-system', 'sans-serif'],
				'display': ['SF Pro Display', 'Inter', 'system-ui', 'sans-serif'],
				'mono': ['SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Consolas', 'Courier New', 'monospace']
			},
			fontSize: {
				'display': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
				'headline': ['clamp(1.75rem, 4vw, 3rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
				'title': ['clamp(1.25rem, 2.5vw, 1.875rem)', { lineHeight: '1.25', letterSpacing: '-0.015em' }],
				'body': ['17px', { lineHeight: '1.6', letterSpacing: '-0.005em' }],
				'caption': ['15px', { lineHeight: '1.5', letterSpacing: '0.005em' }],
				'micro': ['13px', { lineHeight: '1.4', letterSpacing: '0.01em' }],
			},
			borderRadius: {
				lg: 'var(--radius-lg)',
				md: 'var(--radius)',
				sm: 'calc(var(--radius) - 4px)',
				xl: 'var(--radius-xl)',
				'2xl': 'var(--radius-2xl)',
				full: 'var(--radius-full)'
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'128': '32rem',
			},
			backdropBlur: {
				'xs': '2px',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
					'25%': { transform: 'translateY(-12px) rotate(1deg)' },
					'50%': { transform: 'translateY(-8px) rotate(0deg)' },
					'75%': { transform: 'translateY(-16px) rotate(-1deg)' }
				},
				'pulse-glow': {
					'0%': { 
						boxShadow: '0 0 20px hsl(var(--primary) / 0.1)',
						transform: 'scale(1)'
					},
					'100%': { 
						boxShadow: '0 0 40px hsl(var(--primary) / 0.3), 0 0 60px hsl(var(--primary) / 0.1)',
						transform: 'scale(1.02)'
					}
				},
				'slide-up': {
					'from': { opacity: '0', transform: 'translateY(40px)' },
					'to': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in': {
					'from': { opacity: '0', transform: 'scale(0.98)' },
					'to': { opacity: '1', transform: 'scale(1)' }
				},
				'scale-in': {
					'from': { opacity: '0', transform: 'scale(0.95)' },
					'to': { opacity: '1', transform: 'scale(1)' }
				},
				'slide-in-left': {
					'from': { opacity: '0', transform: 'translateX(-40px)' },
					'to': { opacity: '1', transform: 'translateX(0)' }
				},
				'slide-in-right': {
					'from': { opacity: '0', transform: 'translateX(40px)' },
					'to': { opacity: '1', transform: 'translateX(0)' }
				},
				'shine': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'tech-pulse': {
					'0%': { boxShadow: '0 0 0 0 hsl(var(--primary) / 0.4)', opacity: '1' },
					'70%': { boxShadow: '0 0 0 12px hsl(var(--primary) / 0)', opacity: '0.7' },
					'100%': { boxShadow: '0 0 0 0 hsl(var(--primary) / 0)', opacity: '1' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				},
				'bounce-subtle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-4px)' }
				},
				'rotate-subtle': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 16s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 4s ease-in-out infinite alternate',
				'slide-up': 'slide-up 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				'fade-in': 'fade-in 1.5s ease-out',
				'scale-in': 'scale-in 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				'slide-in-left': 'slide-in-left 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				'slide-in-right': 'slide-in-right 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				'shine': 'shine 2s ease-in-out infinite',
				'tech-pulse': 'tech-pulse 3s ease-in-out infinite',
				'shimmer': 'shimmer 2.5s linear infinite',
				'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
				'rotate-subtle': 'rotate-subtle 20s linear infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
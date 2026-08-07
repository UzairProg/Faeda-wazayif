export const THEME_CONFIG = {
  FONTS: {
    SANS: "Inter, sans-serif",
    HEADING: "Outfit, sans-serif",
  },
  DEFAULT_MODE: "system",
  ANIMATIONS: {
    DURATION: {
      FAST: "150ms",
      NORMAL: "300ms",
      SLOW: "500ms",
    },
    EASING: {
      DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
      IN: "cubic-bezier(0.4, 0, 1, 1)",
      OUT: "cubic-bezier(0, 0, 0.2, 1)",
    },
  },
} as const

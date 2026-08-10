import { z } from "zod"

const envSchema = z.object({
  VITE_API_URL: z.string().url().default("http://localhost:5000"),
  VITE_APP_ENV: z.enum(["development", "production", "test"]).default("development"),
  VITE_APP_NAME: z.string().default("Faeda-Jobs"),
})

const _env = envSchema.safeParse(import.meta.env)

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format())
  throw new Error("Invalid environment variables")
}

export const env = _env.data

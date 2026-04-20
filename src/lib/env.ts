function readRequiredEnv(name: string) {
  const value = process.env[name]

  if (!value) {
    throw new Error(
      `Missing ${name}. Use apps/web/.env.development for npm run dev, and apps/web/.env.production for npm run build or npm run start. See apps/web/.env.example.`
    )
  }

  return value
}

export const apiBaseUrl = readRequiredEnv('NEXT_PUBLIC_API_BASE_URL')
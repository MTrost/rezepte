/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB: D1Database
  R2_BUCKET: R2Bucket
  BETTER_AUTH_SECRET: string
  BETTER_AUTH_URL: string
  ENVIRONMENT: string
}

declare module 'cloudflare:workers' {
  interface Env {
    DB: D1Database
    R2_BUCKET: R2Bucket
    BETTER_AUTH_SECRET: string
    BETTER_AUTH_URL: string
    ENVIRONMENT: string
  }
}

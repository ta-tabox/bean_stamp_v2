import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  GOOGLE_CLOUD_PROJECT: z.string().min(1),
  GCS_BUCKET_UPLOADS: z.string().min(1),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function loadServerEnv(source: NodeJS.ProcessEnv = process.env): ServerEnv {
  return serverEnvSchema.parse(source);
}

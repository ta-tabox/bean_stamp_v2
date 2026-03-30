import { defineConfig, devices } from "@playwright/test"

const port = 3100
const baseURL = `http://127.0.0.1:${port}`

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: 0,
  workers: 1,
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
  webServer: {
    command: `BEAN_STAMP_E2E=1 NEXTAUTH_URL=${baseURL} NODE_ENV=production pnpm exec next build && BEAN_STAMP_E2E=1 NEXTAUTH_URL=${baseURL} NODE_ENV=production pnpm exec next start --hostname 127.0.0.1 --port ${port}`,
    port,
    reuseExistingServer: !process.env.CI,
    stderr: "pipe",
    stdout: "pipe",
    timeout: 240_000,
  },
})

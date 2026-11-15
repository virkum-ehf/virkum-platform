import { defineConfig, devices } from "@playwright/test";

const PORT = 4321;
const isCI = !!process.env.CI;

/**
 * End-to-end tests. By default they run against the static export in `out/` (run `pnpm build`
 * first), served the way Firebase Hosting serves it: directory index pages, `.txt` RSC payloads,
 * 404.html. Set E2E_BASE_URL to test a deployed site instead, for example a Firebase preview channel.
 */
const externalBaseURL = process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL: externalBaseURL ?? `http://127.0.0.1:${PORT}`,
    trace: "retain-on-failure",
  },
  webServer: externalBaseURL
    ? undefined
    : {
        command: `node scripts/serve-static.mjs out ${PORT}`,
        url: `http://127.0.0.1:${PORT}/is/`,
        reuseExistingServer: !isCI,
      },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] }, testIgnore: /fallback\.spec\.ts/ },
    { name: "firefox", use: { ...devices["Desktop Firefox"] }, testIgnore: /(fallback|accessibility)\.spec\.ts/ },
    { name: "webkit", use: { ...devices["Desktop Safari"] }, testIgnore: /(fallback|accessibility)\.spec\.ts/ },
    { name: "mobile-chrome", use: { ...devices["Pixel 7"] }, testIgnore: /(fallback|accessibility)\.spec\.ts/ },
    { name: "mobile-safari", use: { ...devices["iPhone 14"] }, testIgnore: /(fallback|accessibility)\.spec\.ts/ },
    { name: "tablet", use: { ...devices["iPad (gen 7)"] }, testIgnore: /(fallback|accessibility)\.spec\.ts/ },
    {
      name: "no-webgl",
      use: { ...devices["Desktop Chrome"], launchOptions: { args: ["--disable-webgl", "--disable-3d-apis"] } },
      testMatch: /fallback\.spec\.ts/,
    },
  ],
});

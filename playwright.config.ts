import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

const BASE_URL = process.env.BASE_URL || 'https://spartan-app-new-nonsecure.onrender.com';

/**
 * Playwright Test Configuration for Spartan E2E Test Automation Framework.
 * Follows modern Playwright best practices with multi-project execution,
 * failure artifacts (screenshots, traces, videos), and environment configuration.
 */
export default defineConfig({
  testDir: './tests',
  timeout: Number(process.env.DEFAULT_TIMEOUT) || 30000,
  expect: {
    timeout: Number(process.env.EXPECT_TIMEOUT) || 10000,
  },
  fullyParallel: false, // Sequential execution protects against data race conditions on shared DB
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1, // Single worker avoids database collisions on remote Render instance
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL: BASE_URL,
    headless: process.env.HEADLESS !== 'false',
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    actionTimeout: 15000,
    navigationTimeout: 30000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});

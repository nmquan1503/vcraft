import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir:'./e2e',fullyParallel:false,workers:1,timeout:60000,
  expect:{timeout:15000},
  use:{baseURL:process.env.E2E_BASE_URL||'http://localhost:3000',headless:true,timezoneId:'Asia/Ho_Chi_Minh',
    trace:'retain-on-failure',screenshot:'only-on-failure',
    launchOptions:{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||undefined}},
  webServer:{command:'npm run dev -- --host 127.0.0.1',url:'http://localhost:3000',reuseExistingServer:!process.env.CI,timeout:30000},
});

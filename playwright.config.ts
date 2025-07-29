import { defineConfig } from "@playwright/test";
export default defineConfig({
  timeout: 60000,
  testDir: "tests",
  use: {
    headless: false,
    baseURL: "https://trello.com",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  reporter: [["html", { open: "never" }], ["allure-playwright"]],
});

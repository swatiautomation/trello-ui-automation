import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  timeout: 60000,
  use: {
    headless: false,
    baseURL: "https://trello.com",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  reporter: [["html", { open: "never" }]],
});

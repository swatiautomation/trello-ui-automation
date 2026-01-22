import { test, expect } from "@playwright/test";

test.describe("Demo", async () => {
  test("Demo test", async ({ page }) => {
    await page.goto("https://example.com");
    await expect(page.locator("h1")).toContainText("Example Domain");
    await expect(page.locator("h1")).toHaveText("Example Domain");

    await page.getByRole("link", { name: "More information..." }).click();
    await expect(page).toHaveURL(/iana\.org/);

    expect(await page.url()).toContain("iana.org");
  });
});

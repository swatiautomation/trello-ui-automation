import { Page } from "@playwright/test";
import { values } from "../../values/value-mapper";

const {
  trelloPageElements: { email, password },
  urls: { trelloLogin },
} = values;

export class LoginPage {
  constructor(private page: Page) {}

  async login(emailValue: string, passwordValue: string) {
    await this.page.goto(trelloLogin);
    await this.page.locator(email).fill(emailValue);
    await this.page.getByRole("button", { name: "Continue" }).click();
    await this.page.locator(password).fill(passwordValue);
    await this.page.getByRole("button", { name: "Log in" }).click();
    await this.page.waitForURL("**/boards");
  }
}

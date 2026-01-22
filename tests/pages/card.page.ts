import { Page, expect } from "@playwright/test";
import { values } from "../../values/value-mapper";

const {
  trelloPageElements: {
    descriptionBox,
    descriptionInput,
    greenColorLabel,
    cardName,
    toDoCard,
  },
} = values;

export class CardPage {
  constructor(private page: Page) {}

  async addCardToList(listName: string, cardTitle: string) {
    const addCardButton = this.page.locator(
      `//button[@aria-label='Add a card in ${listName}']`
    );
    await addCardButton.click();
    await this.page
      .getByPlaceholder("Enter a title or paste a link")
      .fill(cardTitle);
    await this.page
      .locator(`//button[@aria-label='Add card in ${listName}']`)
      .click();
      await this.page.locator(`//div[@data-testid='list-cards']`).hover();
      await this.page.locator(`//a[@data-testid='card-name']:has-text('${cardTitle}')`).click();
  }

  async addDescriptionAndLabel(cardTitle: string) {
    await this.page.getByText(cardTitle).click();
    await this.page.locator(descriptionBox).click();
    await this.page
      .locator(descriptionInput)
      .fill("This is a test description.");
    await this.page.getByRole("button", { name: "Save" }).click();
    await this.page.getByRole("button", { name: "Labels" }).click();
    await this.page.locator(greenColorLabel).click();
    await this.page.click("body");
  }

  async uploadAttachment(filePath: string) {
    await this.page.getByText("Attachment").click();
    const fileInput = this.page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);
    await expect(this.page.getByText("test-document.pdf")).toBeVisible();
    await this.page.click("body");
  }

  async closeCard() {
    await this.page.getByRole("button", { name: "Close dialog" }).click();
  }

  getCardByName(cardTitle: string) {
    return this.page.locator(cardName).filter({ hasText: cardTitle });
  }

  getToDoCard() {
    return this.page.locator(toDoCard);
  }
}

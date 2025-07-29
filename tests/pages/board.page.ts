import { Page } from "@playwright/test";
import { values } from "../../values/value-mapper";

const {
  trelloPageElements: {
    createButton,
    createBoardTitleInput,
    createBoardSubmitButton,
    list,
    listOfCards,
  },
} = values;

export class BoardPage {
  constructor(private page: Page) {}

  async createBoard(boardName: string) {
    await this.page.locator(createButton).click();
    await this.page.getByText("Create board").click();
    await this.page.locator(createBoardTitleInput).fill(boardName);
    await this.page.locator(createBoardSubmitButton).click();
  }

  async createLists(lists: string[]) {
    for (const list of lists) {
      await this.page.getByPlaceholder("Enter list name…").fill(list);
      await this.page.getByRole("button", { name: "Add list" }).click();
    }
  }

  async moveCard(cardLocator: any, targetListName: string) {
    const targetList = this.page
      .locator(list)
      .filter({ hasText: targetListName })
      .locator(listOfCards);
    await cardLocator.dragTo(targetList);
    await this.page.waitForTimeout(1000);
  }
}

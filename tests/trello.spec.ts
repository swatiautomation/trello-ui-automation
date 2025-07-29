import { test } from "@playwright/test";
import { LoginPage } from "./pages/login.page";
import { BoardPage } from "./pages/board.page";
import { CardPage } from "./pages/card.page";
import * as dotenv from "dotenv";
dotenv.config();

const timestamp = Date.now();
const initials = "SS";
const boardName = `QA Scrum Board - ${initials} - ${timestamp}`;
const lists = ["To Do", "In Progress", "Done"];
const pdfPath = "./utils/test-document.pdf";

test("Trello UI Automation", async ({ page }) => {
  const login = new LoginPage(page);
  const board = new BoardPage(page);
  const card = new CardPage(page);

  await login.login(process.env.TRELLO_EMAIL!, process.env.TRELLO_PASSWORD!);

  await board.createBoard(boardName);
  await board.createLists(lists);

  for (const list of lists) {
    await card.addCardToList(list, `${list} Card`);
  }

  await card.addDescriptionAndLabel("To Do Card");
  await card.uploadAttachment(pdfPath);
  await card.closeCard();

  const todoCard = card.getCardByName("To Do Card");
  await board.moveCard(todoCard, "In Progress");

  const inProgressCard = card.getToDoCard();
  await board.moveCard(inProgressCard, "Done");

  const doneCard = card.getCardByName("To Do Card");
  await doneCard.isVisible();
});

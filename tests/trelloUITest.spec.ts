import { test, expect } from "@playwright/test";
import { values } from "../values/value-mapper";
import * as dotenv from "dotenv";
dotenv.config();
const {
  trelloPageElements: {
    email,
    password,
    createButton,
    createBoardTitleInput,
    createBoardSubmitButton,
    descriptionBox,
    descriptionInput,
    greenColorLabel,
    cardName,
    toDoCard,
    list,
    listOfCards,
  },
} = values;

const timestamp = Date.now();
const initials = "SS";
const boardName = `QA Scrum Board - ${initials} - ${timestamp}`;
const pdfPath = "./utils/test-document.pdf";

// Function to upload a file
async function uploadFile(page, filePath) {
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(filePath);
}

test("Trello UI Automation", async ({ page }) => {
  // Login
  await page.goto("https://trello.com/login");
  await page.locator(email).fill(process.env.TRELLO_EMAIL || "");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.locator(password).fill(process.env.TRELLO_PASSWORD || "");
  await page.getByRole("button", { name: "Log in" }).click();

  await page.waitForURL("**/boards");

  // Create board
  await page.locator(createButton).click();
  await page.getByText("Create board").click();
  await page.locator(createBoardTitleInput).fill(boardName);
  await page.locator(createBoardSubmitButton).click();

  // Create lists
  const lists = ["To Do", "In Progress", "Done"];
  for (const list of lists) {
    await page.getByPlaceholder("Enter list name…").fill(list);
    await page.getByRole("button", { name: "Add list" }).click();
  }

  // Add cards
  for (const list of lists) {
    const addCardButton = page.locator(
      `//button[@aria-label='Add a card in ${list}']`
    );
    await addCardButton.click();
    await page
      .getByPlaceholder("Enter a title or paste a link")
      .fill(`${list} Card`);
    await page.locator(`//button[@aria-label='Add card in ${list}']`).click();
  }

  // Add description + label to "To Do Card"
  await page.getByText("To Do Card").click();
  await page.locator(descriptionBox).click();
  await page.locator(descriptionInput).fill("This is a test description.");
  await page.getByRole("button", { name: "Save" }).click();
  await page.getByRole("button", { name: "Labels" }).click();
  await page.locator(greenColorLabel).click(); // Select green label
  await page.click("body"); // Click outside to close the label menu

  await page.getByText("Attachment").click();
  await uploadFile(page, pdfPath);

  await expect(page.getByText("test-document.pdf")).toBeVisible();
  await page.click("body");

  // Move card: To Do → In Progress → Done
  await page.getByRole("button", { name: "Close dialog" }).click();

  // Draggable card
  const todoCard = page.locator(cardName).filter({ hasText: "To Do Card" });

  // Drop target - In Progress
  const inProgressList = page
    .locator(list)
    .filter({ hasText: "In Progress" })
    .locator(listOfCards);
  await todoCard.dragTo(inProgressList);
  await page.waitForTimeout(1000); // Slight delay to allow move
  const inProgressCard = page.locator(toDoCard);
  await expect(inProgressCard).toBeVisible();

  // Drop target - Done
  const doneList = page
    .locator(list)
    .filter({ hasText: "Done" })
    .locator(listOfCards);

  await inProgressCard.dragTo(doneList);
  await page.waitForTimeout(1000);

  const doneCard = page.locator(cardName).filter({ hasText: "To Do Card" });

  await expect(doneCard).toBeVisible();
});

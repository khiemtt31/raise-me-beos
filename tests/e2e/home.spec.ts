import { expect, test } from "@playwright/test";

test("home page loads", async ({ page: Page }) => {
  await Page.goto("/");

  await expect(Page).toHaveTitle(/Hanzo/i);
  await expect(Page.getByRole("heading", { name: "Hanzo Hekim" })).toBeVisible();
  await expect(Page.getByRole("link", { name: "Hanzo" })).toBeVisible();
  await expect(Page.getByAltText("Primary portrait of Hanzo Hekim")).toBeVisible();
});

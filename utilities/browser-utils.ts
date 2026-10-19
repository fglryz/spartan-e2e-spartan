import { Page, Locator } from '@playwright/test';

/**
 * Common browser interactions and helper utilities.
 */
export class BrowserUtils {
  /**
   * Waits for DOM stability and network idle state.
   */
  static async waitForLoad(page: Page): Promise<void> {
    await page.waitForLoadState('domcontentloaded');
  }

  /**
   * Safely scrolls an element into view before interacting.
   */
  static async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Highlights an element briefly (useful during debugging or headed runs).
   */
  static async highlight(locator: Locator): Promise<void> {
    await locator.evaluate((el) => {
      const original = el.style.outline;
      el.style.outline = '3px solid red';
      setTimeout(() => {
        el.style.outline = original;
      }, 500);
    });
  }

  /**
   * Accepts upcoming browser alert/confirm dialog.
   */
  static handleDialog(page: Page, promptText?: string): void {
    page.once('dialog', async (dialog) => {
      if (promptText) {
        await dialog.accept(promptText);
      } else {
        await dialog.accept();
      }
    });
  }
}

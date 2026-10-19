import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

/**
 * Page Object representing the Spartan Home Page (/web/v2/home).
 */
export class HomePage extends BasePage {
  readonly path: string = '/web/v2/home';
  readonly heroImage: Locator;
  readonly homeHeading: Locator;
  readonly webDataCardLink: Locator;
  readonly addSpartanCardLink: Locator;
  readonly apiDocsCardLink: Locator;

  constructor(page: Page) {
    super(page);

    this.homeHeading = page.locator('h1, h2, .display-4').filter({ hasText: /home/i }).first();
    this.heroImage = page.locator('img[src*="spartan"], img').first();
    this.webDataCardLink = page.getByRole('link', { name: /web data/i });
    this.addSpartanCardLink = page.getByRole('link', { name: /add spartan/i });
    this.apiDocsCardLink = page.getByRole('link', { name: /api doc/i });
  }

  /**
   * Opens the Home page directly.
   */
  async navigate(): Promise<void> {
    await this.goto(this.path);
  }

  /**
   * Clicks on the Web Data link to navigate to Spartans list.
   */
  async clickWebData(): Promise<void> {
    await this.webDataCardLink.first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Clicks on Add Spartan link to open registration form.
   */
  async clickAddSpartan(): Promise<void> {
    await this.addSpartanCardLink.first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Clicks on API Documentation link.
   */
  async clickApiDocs(): Promise<void> {
    await this.apiDocsCardLink.first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Asserts home page elements are visible.
   */
  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(this.path));
    await expect(this.heroImage).toBeVisible();
  }
}

import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage serves as the parent class for all Page Objects in the framework.
 * Encapsulates common elements such as navigation links, page titles,
 * headers, and shared interaction methods using Playwright user-facing locators.
 */
export abstract class BasePage {
  readonly page: Page;
  readonly navbarBrand: Locator;
  readonly navHomeLink: Locator;
  readonly navWebDataLink: Locator;
  readonly navAddSpartanLink: Locator;
  readonly navApiDocsLink: Locator;
  readonly pageHeading: Locator;
  readonly alertSuccess: Locator;
  readonly alertDanger: Locator;

  constructor(page: Page) {
    this.page = page;

    // Playwright recommended accessible locators
    this.navbarBrand = page.getByRole('navigation').getByRole('link').first();
    this.navHomeLink = page.getByRole('link', { name: /home/i }).first();
    this.navWebDataLink = page.getByRole('link', { name: /web data/i }).first();
    this.navAddSpartanLink = page.getByRole('link', { name: /add spartan/i }).first();
    this.navApiDocsLink = page.getByRole('link', { name: /api doc/i }).first();

    this.pageHeading = page.getByRole('heading').first();
    this.alertSuccess = page.getByRole('alert');
    this.alertDanger = page.getByRole('alert');
  }

  /**
   * Returns the current page title.
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Returns current URL path.
   */
  getUrl(): string {
    return this.page.url();
  }

  /**
   * Navigates to a specific relative or absolute path.
   */
  async goto(path: string): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Navigates to the Home page via navbar link.
   */
  async clickNavHome(): Promise<void> {
    await this.navHomeLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Navigates to Web Data (Spartans list) via navbar link.
   */
  async clickNavWebData(): Promise<void> {
    await this.navWebDataLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Navigates to Add Spartan form via navbar link.
   */
  async clickNavAddSpartan(): Promise<void> {
    await this.navAddSpartanLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Asserts the current page URL matches the expected pattern.
   */
  async expectUrlToContain(subString: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(subString));
  }
}

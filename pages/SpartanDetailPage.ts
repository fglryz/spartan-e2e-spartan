import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { SpartanFormData, SpartanGender } from '../models/spartan.model.js';

/**
 * Page Object representing the Spartan Details view (/web/v2/spartans/{id}).
 * Uses Playwright getBy methods as primary locators with CSS fallbacks.
 */
export class SpartanDetailPage extends BasePage {
  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly genderInput: Locator;
  readonly phoneInput: Locator;
  readonly backToListLink: Locator;
  readonly backToHomeLink: Locator;

  constructor(page: Page) {
    super(page);

    this.heading = page.getByRole('heading', { name: /spartan details/i }).or(page.locator('h3'));
    this.nameInput = page.getByLabel(/name:/i).or(page.locator('input#name'));
    this.genderInput = page.getByLabel(/gender:/i).or(page.locator('input#gender'));
    this.phoneInput = page.getByLabel(/phone number:/i).or(page.locator('input#phone'));

    this.backToListLink = page.getByRole('link', { name: /back to the list/i });
    this.backToHomeLink = page.getByRole('link', { name: /back to home/i });
  }

  /**
   * Navigates directly to a Spartan's details page.
   */
  async navigate(id: string | number): Promise<void> {
    await this.goto(`/web/v2/spartans/${id}`);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Retrieves the displayed values from the readonly fields.
   */
  async getDetails(): Promise<SpartanFormData> {
    const name = await this.nameInput.inputValue();
    const gender = (await this.genderInput.inputValue()) as SpartanGender;
    const phone = await this.phoneInput.inputValue();

    return { name, gender, phone };
  }

  /**
   * Clicks the 'Back to the List' link.
   */
  async clickBackToList(): Promise<void> {
    await this.backToListLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Clicks the 'Back to Home' link.
   */
  async clickBackToHome(): Promise<void> {
    await this.backToHomeLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Asserts details match the expected name and phone.
   */
  async expectDetailsToMatch(expected: Partial<SpartanFormData>): Promise<void> {
    if (expected.name) {
      await expect(this.nameInput).toHaveValue(expected.name);
    }
    if (expected.gender) {
      await expect(this.genderInput).toHaveValue(expected.gender);
    }
    if (expected.phone) {
      await expect(this.phoneInput).toHaveValue(String(expected.phone));
    }
  }

  /**
   * Asserts details card is loaded and accessible.
   */
  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await expect(this.nameInput).toBeVisible();
    await expect(this.genderInput).toBeVisible();
    await expect(this.phoneInput).toBeVisible();
  }
}

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { SpartanFormData } from '../models/spartan.model.js';

/**
 * Page Object representing the Add Spartan registration page (/web/v2/spartans/add).
 * Uses Playwright getBy methods as primary locators with CSS fallbacks.
 */
export class AddSpartanPage extends BasePage {
  readonly path: string = '/web/v2/spartans/add';

  // User-facing locators with CSS fallbacks
  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly genderSelect: Locator;
  readonly phoneInput: Locator;

  // Action buttons & Links
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly backToListLink: Locator;
  readonly backToHomeLink: Locator;

  // Validation feedback locators
  readonly validationErrors: Locator;

  constructor(page: Page) {
    super(page);

    this.heading = page.getByRole('heading', { name: /add spartan/i }).or(page.locator('h3'));
    this.nameInput = page.getByLabel(/name:/i).or(page.locator('input#name'));
    this.genderSelect = page.getByLabel(/gender:/i).or(page.locator('select#genderSelect'));
    this.phoneInput = page.getByLabel(/phone/i).or(page.locator('input#phone'));

    this.saveButton = page.getByRole('button', { name: /save/i }).or(page.locator('button[type="submit"]'));
    this.cancelButton = page.getByRole('button', { name: /cancel/i }).or(page.locator('a.btn-danger, a:has-text("Cancel")'));
    this.backToListLink = page.getByRole('link', { name: /back to the list/i });
    this.backToHomeLink = page.getByRole('link', { name: /back to home/i });

    this.validationErrors = page.getByRole('alert').or(page.locator('.alert-danger, .invalid-feedback'));
  }

  /**
   * Navigates directly to the Add Spartan page.
   */
  async navigate(): Promise<void> {
    await this.goto(this.path);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Fills the Spartan registration form fields.
   * Automatically normalizes gender to uppercase ('MALE' | 'FEMALE') matching HTML option values.
   */
  async fillForm(spartan: SpartanFormData): Promise<void> {
    if (spartan.name !== undefined) {
      await this.nameInput.fill(spartan.name);
    }
    if (spartan.gender !== undefined) {
      const optionValue = spartan.gender.toUpperCase();
      await this.genderSelect.selectOption(optionValue);
    }
    if (spartan.phone !== undefined) {
      await this.phoneInput.fill(String(spartan.phone));
    }
  }

  /**
   * Submits the form by clicking Save.
   */
  async submit(): Promise<void> {
    await this.saveButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Convenience method to fill the form and submit in one action.
   */
  async createSpartan(spartan: SpartanFormData): Promise<void> {
    await this.fillForm(spartan);
    await this.submit();
  }

  /**
   * Clicks the Cancel button to return to the list without saving.
   */
  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Alias for clickCancel / clickBack.
   */
  async clickBack(): Promise<void> {
    await this.clickCancel();
  }

  /**
   * Clicks 'Back to the List' link.
   */
  async clickBackToList(): Promise<void> {
    await this.backToListLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Asserts the Add Spartan form elements are visible and ready.
   */
  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await expect(this.nameInput).toBeVisible();
    await expect(this.genderSelect).toBeVisible();
    await expect(this.phoneInput).toBeVisible();
    await expect(this.saveButton).toBeVisible();
  }
}

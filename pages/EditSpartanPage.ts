import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { SpartanFormData, SpartanGender } from '../models/spartan.model.js';

/**
 * Page Object representing the Spartan Edit page (/web/v2/spartans/edit/{id}).
 * Uses Playwright getBy methods as primary locators with CSS fallbacks.
 */
export class EditSpartanPage extends BasePage {
  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly genderSelect: Locator;
  readonly phoneInput: Locator;
  readonly updateButton: Locator;
  readonly cancelButton: Locator;
  readonly backToListLink: Locator;

  constructor(page: Page) {
    super(page);

    this.heading = page.getByRole('heading', { name: /edit spartan/i }).or(page.locator('h3'));
    this.nameInput = page.getByLabel(/name:/i).or(page.locator('input#name'));
    this.genderSelect = page.getByLabel(/gender:/i).or(page.locator('select#genderSelect'));
    this.phoneInput = page.getByLabel(/phone/i).or(page.locator('input#phone'));

    this.updateButton = page.getByRole('button', { name: /update/i }).or(page.locator('button[type="submit"]'));
    this.cancelButton = page.getByRole('link', { name: /cancel/i }).or(page.locator('a.btn-danger'));
    this.backToListLink = page.getByRole('link', { name: /back to the list/i });
  }

  /**
   * Navigates directly to the edit page of a specific Spartan.
   */
  async navigate(id: string | number): Promise<void> {
    await this.goto(`/web/v2/spartans/edit/${id}`);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Retrieves the current pre-filled values from the edit form.
   */
  async getFormValues(): Promise<SpartanFormData> {
    const name = await this.nameInput.inputValue();
    const gender = (await this.genderSelect.inputValue()) as SpartanGender;
    const phone = await this.phoneInput.inputValue();

    return { name, gender, phone };
  }

  /**
   * Updates only the specified fields and submits the form.
   * Automatically normalizes gender to uppercase ('MALE' | 'FEMALE') matching HTML option values.
   */
  async updateSpartan(updates: Partial<SpartanFormData>): Promise<void> {
    if (updates.name !== undefined) {
      await this.nameInput.fill(updates.name);
    }
    if (updates.gender !== undefined) {
      const optionValue = updates.gender.toUpperCase();
      await this.genderSelect.selectOption(optionValue);
    }
    if (updates.phone !== undefined) {
      await this.phoneInput.fill(String(updates.phone));
    }
    await this.updateButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Cancels editing and navigates back to list.
   */
  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Asserts the edit form is properly rendered.
   */
  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await expect(this.nameInput).toBeVisible();
    await expect(this.genderSelect).toBeVisible();
    await expect(this.phoneInput).toBeVisible();
    await expect(this.updateButton).toBeVisible();
  }
}

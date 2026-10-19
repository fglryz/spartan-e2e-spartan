import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { SpartanGender, SpartanRowData } from '../models/spartan.model.js';

/**
 * Page Object representing the Spartan List / Web Data page (/web/v2/spartans).
 * Uses Playwright getBy methods as primary locators with resilient CSS/ID fallbacks.
 */
export class SpartanListPage extends BasePage {
  readonly path: string = '/web/v2/spartans';

  // Search & Filter controls (getBy preferred, CSS fallback)
  readonly nameSearchInput: Locator;
  readonly genderFilterSelect: Locator;
  readonly searchButton: Locator;
  readonly clearButton: Locator;

  // Header & Navigation controls
  readonly addSpartanButton: Locator;
  readonly totalBadge: Locator;
  readonly filteredCountSpan: Locator;

  // Table Locators
  readonly spartansTable: Locator;
  readonly tableRows: Locator;
  readonly visibleTableRows: Locator;
  readonly tableHeaders: Locator;

  constructor(page: Page) {
    super(page);

    // Primary: getByPlaceholder / getByLabel; Fallback: CSS ID
    this.nameSearchInput = page.getByPlaceholder(/name contains/i).or(page.locator('input#name'));
    this.genderFilterSelect = page.getByLabel(/gender:/i).or(page.locator('select#gender'));
    this.searchButton = page.getByRole('button', { name: /search/i }).or(page.locator('button#search'));
    this.clearButton = page.getByRole('button', { name: /clear/i }).or(page.locator('button#clear'));

    this.addSpartanButton = page.getByRole('link', { name: /add spartan/i }).or(page.locator('#add_spartan_btn'));
    
    // Total badge in Spartan app is an <a> tag without href, so #total / getByText are both supported
    this.totalBadge = page.locator('#total').or(page.getByText(/total:\s*\d+/i));
    this.filteredCountSpan = page.locator('#total_up_count');

    this.spartansTable = page.getByRole('table').or(page.locator('#myTable'));
    this.tableHeaders = page.getByRole('columnheader').or(page.locator('#myTable thead th'));
    this.tableRows = page.locator('#myTable tbody tr');
    
    // Filter out rows hidden by client-side JavaScript (display: none)
    this.visibleTableRows = page.locator('#myTable tbody tr:not([style*="display: none"])');
  }

  /**
   * Navigates directly to the Spartan list view.
   */
  async navigate(): Promise<void> {
    await this.goto(this.path);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Returns the total count of Spartans parsed from the totalBadge element.
   */
  async getTotalCount(): Promise<number> {
    const text = await this.totalBadge.innerText();
    const match = text.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  /**
   * Returns the filtered count from the filteredCountSpan element.
   */
  async getFilteredCount(): Promise<number> {
    const text = (await this.filteredCountSpan.innerText()).trim();
    if (text) {
      return parseInt(text, 10);
    }
    return await this.getVisibleRowCount();
  }

  /**
   * Searches for Spartans by name substring.
   */
  async searchByName(name: string): Promise<void> {
    await this.nameSearchInput.fill(name);
    await this.searchButton.click();
  }

  /**
   * Filters Spartans by gender ('MALE' | 'FEMALE').
   */
  async filterByGender(gender: SpartanGender): Promise<void> {
    const optionValue = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase(); // 'Male' | 'Female'
    await this.genderFilterSelect.selectOption(optionValue);
    await this.searchButton.click();
  }

  /**
   * Combined search by name and gender filter.
   */
  async search(name?: string, gender?: SpartanGender): Promise<void> {
    if (name !== undefined) {
      await this.nameSearchInput.fill(name);
    }
    if (gender !== undefined) {
      const optionValue = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
      await this.genderFilterSelect.selectOption(optionValue);
    }
    await this.searchButton.click();
  }

  /**
   * Clears the current search/filter criteria by clicking Clear.
   */
  async clearSearch(): Promise<void> {
    await this.clearButton.click();
  }

  /**
   * Navigates to the Add Spartan registration page.
   */
  async clickAddSpartan(): Promise<void> {
    await this.addSpartanButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Returns the total number of table rows currently visible (excluding display:none).
   */
  async getVisibleRowCount(): Promise<number> {
    return await this.visibleTableRows.count();
  }

  /**
   * Finds a visible row locator matching a specific Spartan Name.
   */
  findRowByName(name: string): Locator {
    return this.visibleTableRows.filter({
      has: this.page.locator('td:nth-child(2)', { hasText: name }),
    }).first();
  }

  /**
   * Finds a visible row locator matching a specific Spartan ID.
   */
  findRowById(id: string | number): Locator {
    return this.visibleTableRows.filter({
      has: this.page.locator('td:nth-child(1)', { hasText: String(id) }),
    }).first();
  }

  /**
   * Extracts typed row data (id, name, phone, gender) from a given row locator.
   * Note: Cell 0: ID, Cell 1: Name, Cell 2: Phone, Cell 3: Gender
   */
  async getRowData(row: Locator): Promise<SpartanRowData> {
    const cells = row.locator('td');
    return {
      id: (await cells.nth(0).innerText()).trim(),
      name: (await cells.nth(1).innerText()).trim(),
      phone: (await cells.nth(2).innerText()).trim(),
      gender: (await cells.nth(3).innerText()).trim().toUpperCase() as SpartanGender,
    };
  }

  /**
   * Checks if a Spartan with given name is currently visible in the table.
   */
  async isSpartanPresent(name: string): Promise<boolean> {
    const row = this.findRowByName(name);
    return (await row.count()) > 0;
  }

  /**
   * Clicks the 'View' button for the row matching the specified name.
   */
  async clickViewByName(name: string): Promise<void> {
    const row = this.findRowByName(name);
    await row.locator('a[id^="view_spartan_"], td:nth-child(5) a').click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Clicks the 'Edit' button for the row matching the specified name.
   */
  async clickEditByName(name: string): Promise<void> {
    const row = this.findRowByName(name);
    await row.locator('a[id^="edit_spartan_"], td:nth-child(6) a').click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Clicks the 'Delete' button for the row matching the specified name.
   */
  async clickDeleteByName(name: string): Promise<void> {
    const row = this.findRowByName(name);
    await row.locator('a[id^="delete_spartan_"], td:nth-child(7) a').click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Asserts table view is loaded with headers.
   */
  async expectLoaded(): Promise<void> {
    await expect(this.spartansTable).toBeVisible();
    await expect(this.tableHeaders.first()).toBeVisible();
  }
}

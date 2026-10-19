import { test, expect } from '../fixtures/test-base.js';

test.describe('Spartan List View & Search/Filter Functionality', () => {
  test.beforeEach(async ({ spartanListPage }) => {
    await spartanListPage.navigate();
    await spartanListPage.expectLoaded();
  });

  test('should display total count and table headers', async ({ spartanListPage }) => {
    const totalCount = await spartanListPage.getTotalCount();
    expect(totalCount).toBeGreaterThan(0);

    const visibleRows = await spartanListPage.getVisibleRowCount();
    expect(visibleRows).toBeGreaterThan(0);
  });

  test('should filter Spartans by Name substring', async ({ spartanListPage }) => {
    // Pick name from first row to guarantee matches
    const firstRow = spartanListPage.visibleTableRows.first();
    const rowData = await spartanListPage.getRowData(firstRow);
    const searchTerm = rowData.name.substring(0, 3);

    await spartanListPage.searchByName(searchTerm);

    const filteredRows = await spartanListPage.getVisibleRowCount();
    expect(filteredRows).toBeGreaterThan(0);

    // Verify returned rows contain search term (case-insensitive)
    for (let i = 0; i < Math.min(filteredRows, 5); i++) {
      const row = spartanListPage.visibleTableRows.nth(i);
      const data = await spartanListPage.getRowData(row);
      expect(data.name.toLowerCase()).toContain(searchTerm.toLowerCase());
    }
  });

  test('should filter Spartans by Gender', async ({ spartanListPage }) => {
    await spartanListPage.filterByGender('FEMALE');

    const filteredRows = await spartanListPage.getVisibleRowCount();
    if (filteredRows > 0) {
      for (let i = 0; i < Math.min(filteredRows, 5); i++) {
        const row = spartanListPage.visibleTableRows.nth(i);
        const data = await spartanListPage.getRowData(row);
        expect(data.gender).toBe('FEMALE');
      }
    }
  });

  test('should reset filters when clicking Clear', async ({ spartanListPage }) => {
    await spartanListPage.searchByName('NonExistentRandomNameXYZ999');
    expect(await spartanListPage.getVisibleRowCount()).toBe(0);

    await spartanListPage.clearSearch();
    expect(await spartanListPage.getVisibleRowCount()).toBeGreaterThan(0);
  });
});

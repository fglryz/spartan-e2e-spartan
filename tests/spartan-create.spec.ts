import { test, expect } from '../fixtures/test-base.js';

test.describe('Spartan Creation Lifecycle', () => {
  let createdSpartanName = '';

  test('should successfully register a new Male Spartan', async ({
    spartanListPage,
    addSpartanPage,
    dataGenerator,
  }) => {
    const spartan = dataGenerator.generateSpartanWithPrefix('MaleTest', 'MALE');
    createdSpartanName = spartan.name;

    await addSpartanPage.navigate();
    await addSpartanPage.expectLoaded();

    await addSpartanPage.createSpartan(spartan);

    // Verify redirected back to list page
    await spartanListPage.expectUrlToContain('/web/v2/spartans');

    // Search and verify newly created Spartan exists
    await spartanListPage.searchByName(spartan.name);
    expect(await spartanListPage.isSpartanPresent(spartan.name)).toBe(true);

    const row = spartanListPage.findRowByName(spartan.name);
    const data = await spartanListPage.getRowData(row);
    expect(data.name).toBe(spartan.name);
    expect(data.gender).toBe('MALE');
    expect(data.phone).toBe(spartan.phone);
  });

  test('should successfully register a new Female Spartan', async ({
    spartanListPage,
    addSpartanPage,
    dataGenerator,
  }) => {
    const spartan = dataGenerator.generateSpartanWithPrefix('FemTest', 'FEMALE');

    await spartanListPage.navigate();
    await spartanListPage.clickAddSpartan();
    await addSpartanPage.expectLoaded();

    await addSpartanPage.createSpartan(spartan);
    await spartanListPage.expectUrlToContain('/web/v2/spartans');

    await spartanListPage.searchByName(spartan.name);
    expect(await spartanListPage.isSpartanPresent(spartan.name)).toBe(true);
  });

  test('should navigate back to Spartan list when clicking Back without saving', async ({
    addSpartanPage,
    spartanListPage,
  }) => {
    await addSpartanPage.navigate();
    await addSpartanPage.clickBack();
    await spartanListPage.expectUrlToContain('/web/v2/spartans');
    await spartanListPage.expectLoaded();
  });

  // Cleanup after tests
  test.afterEach(async ({ spartanListPage }) => {
    if (createdSpartanName) {
      await spartanListPage.navigate();
      await spartanListPage.searchByName(createdSpartanName);
      if (await spartanListPage.isSpartanPresent(createdSpartanName)) {
        await spartanListPage.clickDeleteByName(createdSpartanName);
      }
      createdSpartanName = '';
    }
  });
});

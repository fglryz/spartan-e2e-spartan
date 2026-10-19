import { test, expect } from '../fixtures/test-base.js';

test.describe('Spartan Full End-to-End User Journey (CRUD Lifecycle)', () => {
  test('Complete E2E workflow: Create -> Search -> View -> Edit -> Delete', async ({
    homePage,
    spartanListPage,
    addSpartanPage,
    spartanDetailPage,
    editSpartanPage,
    dataGenerator,
  }) => {
    // ----------------------------------------------------
    // 1. Navigation from Home to Spartan List
    // ----------------------------------------------------
    await homePage.navigate();
    await homePage.expectLoaded();
    await homePage.clickWebData();

    await spartanListPage.expectUrlToContain('/web/v2/spartans');
    await spartanListPage.expectLoaded();

    const initialTotalCount = await spartanListPage.getTotalCount();

    // ----------------------------------------------------
    // 2. Add New Spartan
    // ----------------------------------------------------
    await spartanListPage.clickAddSpartan();
    await addSpartanPage.expectLoaded();

    const initialSpartan = dataGenerator.generateSpartanWithPrefix('E2EIn', 'MALE');
    await addSpartanPage.createSpartan(initialSpartan);

    // ----------------------------------------------------
    // 3. Verify in List & Total Count incremented
    // ----------------------------------------------------
    await spartanListPage.expectUrlToContain('/web/v2/spartans');
    await spartanListPage.searchByName(initialSpartan.name);

    expect(await spartanListPage.isSpartanPresent(initialSpartan.name)).toBe(true);
    const createdRow = spartanListPage.findRowByName(initialSpartan.name);
    const rowData = await spartanListPage.getRowData(createdRow);

    expect(rowData.name).toBe(initialSpartan.name);
    expect(rowData.gender).toBe(initialSpartan.gender);
    expect(rowData.phone).toBe(initialSpartan.phone);

    // ----------------------------------------------------
    // 4. View Details View
    // ----------------------------------------------------
    await spartanListPage.clickViewByName(initialSpartan.name);
    await spartanDetailPage.expectUrlToContain('/web/v2/spartans/');
    await spartanDetailPage.expectLoaded();
    await spartanDetailPage.expectDetailsToMatch({
      name: initialSpartan.name,
      phone: initialSpartan.phone,
    });

    await spartanDetailPage.clickBackToList();
    await spartanListPage.expectUrlToContain('/web/v2/spartans');

    // ----------------------------------------------------
    // 5. Edit Spartan
    // ----------------------------------------------------
    await spartanListPage.searchByName(initialSpartan.name);
    await spartanListPage.clickEditByName(initialSpartan.name);
    await editSpartanPage.expectLoaded();

    const updatedSpartan = dataGenerator.generateSpartanWithPrefix('E2EUp', 'FEMALE');
    await editSpartanPage.updateSpartan({
      name: updatedSpartan.name,
      gender: updatedSpartan.gender,
      phone: updatedSpartan.phone,
    });

    // ----------------------------------------------------
    // 6. Verify Updated Spartan in Table
    // ----------------------------------------------------
    await spartanListPage.expectUrlToContain('/web/v2/spartans');
    await spartanListPage.searchByName(updatedSpartan.name);

    expect(await spartanListPage.isSpartanPresent(updatedSpartan.name)).toBe(true);
    const updatedRow = spartanListPage.findRowByName(updatedSpartan.name);
    const updatedData = await spartanListPage.getRowData(updatedRow);

    expect(updatedData.name).toBe(updatedSpartan.name);
    expect(updatedData.gender).toBe(updatedSpartan.gender);
    expect(updatedData.phone).toBe(updatedSpartan.phone);

    // ----------------------------------------------------
    // 7. Delete Spartan & Verify Removal
    // ----------------------------------------------------
    await spartanListPage.clickDeleteByName(updatedSpartan.name);
    await spartanListPage.expectUrlToContain('/web/v2/spartans');

    await spartanListPage.searchByName(updatedSpartan.name);
    expect(await spartanListPage.isSpartanPresent(updatedSpartan.name)).toBe(false);

    // Verify overall total count returned to initial count
    await spartanListPage.clearSearch();
    const finalTotalCount = await spartanListPage.getTotalCount();
    expect(finalTotalCount).toBe(initialTotalCount);
  });
});

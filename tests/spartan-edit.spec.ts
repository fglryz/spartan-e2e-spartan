import { test, expect } from '../fixtures/test-base.js';

test.describe('Spartan Edit & Update Lifecycle', () => {
  let activeSpartanName = '';

  test('should pre-populate existing values and successfully update a Spartan', async ({
    spartanListPage,
    addSpartanPage,
    editSpartanPage,
    dataGenerator,
  }) => {
    // 1. Create a Spartan to edit
    const initialSpartan = dataGenerator.generateSpartanWithPrefix('EditInit', 'MALE');
    await addSpartanPage.navigate();
    await addSpartanPage.createSpartan(initialSpartan);

    activeSpartanName = initialSpartan.name;

    // 2. Locate and open edit page
    await spartanListPage.searchByName(initialSpartan.name);
    await spartanListPage.clickEditByName(initialSpartan.name);

    await editSpartanPage.expectUrlToContain('/web/v2/spartans/edit/');
    await editSpartanPage.expectLoaded();

    // 3. Verify pre-populated values
    const currentValues = await editSpartanPage.getFormValues();
    expect(currentValues.name).toBe(initialSpartan.name);
    expect(currentValues.phone).toBe(initialSpartan.phone);

    // 4. Update the Spartan's name and phone
    const updatedSpartan = dataGenerator.generateSpartanWithPrefix('EditDone', 'MALE');
    await editSpartanPage.updateSpartan({
      name: updatedSpartan.name,
      phone: updatedSpartan.phone,
    });

    activeSpartanName = updatedSpartan.name;

    // 5. Verify redirection and updated record in list
    await spartanListPage.expectUrlToContain('/web/v2/spartans');
    await spartanListPage.searchByName(updatedSpartan.name);

    expect(await spartanListPage.isSpartanPresent(updatedSpartan.name)).toBe(true);
    const updatedRow = spartanListPage.findRowByName(updatedSpartan.name);
    const rowData = await spartanListPage.getRowData(updatedRow);

    expect(rowData.name).toBe(updatedSpartan.name);
    expect(rowData.phone).toBe(updatedSpartan.phone);
  });

  // Cleanup
  test.afterEach(async ({ spartanListPage }) => {
    if (activeSpartanName) {
      await spartanListPage.navigate();
      await spartanListPage.searchByName(activeSpartanName);
      if (await spartanListPage.isSpartanPresent(activeSpartanName)) {
        await spartanListPage.clickDeleteByName(activeSpartanName);
      }
      activeSpartanName = '';
    }
  });
});

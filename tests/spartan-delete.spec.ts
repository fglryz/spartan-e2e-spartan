import { test, expect } from '../fixtures/test-base.js';

test.describe('Spartan Deletion Lifecycle', () => {
  test('should delete a Spartan and decrement the total counter', async ({
    spartanListPage,
    addSpartanPage,
    dataGenerator,
  }) => {
    // 1. Create a Spartan specifically for deletion
    const spartanToDelete = dataGenerator.generateSpartanWithPrefix('DelTest', 'FEMALE');
    await addSpartanPage.navigate();
    await addSpartanPage.createSpartan(spartanToDelete);

    // 2. Navigate to list and record count
    await spartanListPage.navigate();
    const countBefore = await spartanListPage.getTotalCount();

    // 3. Search and delete the target Spartan
    await spartanListPage.searchByName(spartanToDelete.name);
    expect(await spartanListPage.isSpartanPresent(spartanToDelete.name)).toBe(true);

    await spartanListPage.clickDeleteByName(spartanToDelete.name);

    // 4. Verify redirected to list and total count decremented
    await spartanListPage.expectUrlToContain('/web/v2/spartans');
    const countAfter = await spartanListPage.getTotalCount();
    expect(countAfter).toBe(countBefore - 1);

    // 5. Verify the deleted Spartan can no longer be found
    await spartanListPage.searchByName(spartanToDelete.name);
    expect(await spartanListPage.isSpartanPresent(spartanToDelete.name)).toBe(false);
  });
});

import { test, expect } from '../fixtures/test-base.js';

test.describe('Spartan Details View', () => {
  let testSpartanName = '';

  test('should display accurate Spartan information on the Details page', async ({
    spartanListPage,
    addSpartanPage,
    spartanDetailPage,
    dataGenerator,
  }) => {
    // 1. Create a known test Spartan
    const newSpartan = dataGenerator.generateSpartanWithPrefix('ViewT', 'MALE');
    testSpartanName = newSpartan.name;

    await addSpartanPage.navigate();
    await addSpartanPage.createSpartan(newSpartan);

    // 2. Search for the Spartan and open Details view
    await spartanListPage.searchByName(newSpartan.name);
    await spartanListPage.clickViewByName(newSpartan.name);

    // 3. Verify Details page content
    await spartanDetailPage.expectUrlToContain('/web/v2/spartans/');
    await spartanDetailPage.expectLoaded();
    await spartanDetailPage.expectDetailsToMatch({
      name: newSpartan.name,
      phone: newSpartan.phone,
    });

    // 4. Test Back to List button
    await spartanDetailPage.clickBackToList();
    await spartanListPage.expectUrlToContain('/web/v2/spartans');
    await spartanListPage.expectLoaded();
  });

  // Cleanup
  test.afterEach(async ({ spartanListPage }) => {
    if (testSpartanName) {
      await spartanListPage.navigate();
      await spartanListPage.searchByName(testSpartanName);
      if (await spartanListPage.isSpartanPresent(testSpartanName)) {
        await spartanListPage.clickDeleteByName(testSpartanName);
      }
      testSpartanName = '';
    }
  });
});

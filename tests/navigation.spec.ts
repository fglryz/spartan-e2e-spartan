import { test, expect } from '../fixtures/test-base.js';

test.describe('Spartan App Navigation & UI Smoke Tests', () => {
  test('should display home page elements correctly', async ({ homePage }) => {
    await homePage.navigate();
    await homePage.expectLoaded();
    const title = await homePage.getTitle();
    expect(title).toMatch(/spartan/i);
  });

  test('should navigate to Web Data (Spartans List) from Home', async ({ homePage, spartanListPage }) => {
    await homePage.navigate();
    await homePage.clickWebData();
    await spartanListPage.expectUrlToContain('/web/v2/spartans');
    await spartanListPage.expectLoaded();
  });

  test('should navigate to Add Spartan form from Home', async ({ homePage, addSpartanPage }) => {
    await homePage.navigate();
    await homePage.clickAddSpartan();
    await addSpartanPage.expectUrlToContain('/web/v2/spartans/add');
    await addSpartanPage.expectLoaded();
  });
});

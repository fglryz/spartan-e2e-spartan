import { test, expect } from '../../fixtures/test-base.js';
import { SpartanDTO } from '../../models/spartan.model.js';

test.describe('Spartan Hybrid (API + UI) E2E Journey', () => {
  let seededId: number | undefined;

  test('Fast API Seed -> UI Verification & Edit -> Fast API Teardown', async ({
    apiClient,
    spartanListPage,
    spartanDetailPage,
    editSpartanPage,
    dataGenerator,
  }) => {
    // ----------------------------------------------------
    // 1. FAST API SEEDING (Bypass UI for pre-conditions)
    // ----------------------------------------------------
    const seedData: SpartanDTO = dataGenerator.generateSpartanDTOWithPrefix('Hyb', 'Female');
    seededId = await apiClient.createSpartanAndGetId(seedData);
    expect(seededId).toBeGreaterThan(0);

    // ----------------------------------------------------
    // 2. UI VERIFICATION: Find Spartan on List & View Details
    // ----------------------------------------------------
    await spartanListPage.navigate();
    await spartanListPage.searchByName(seedData.name);
    expect(await spartanListPage.isSpartanPresent(seedData.name)).toBe(true);

    // Open Details view in UI
    await spartanListPage.clickViewByName(seedData.name);
    await spartanDetailPage.expectLoaded();
    await spartanDetailPage.expectDetailsToMatch({
      name: seedData.name,
      phone: seedData.phone,
    });

    await spartanDetailPage.clickBackToList();
    await spartanListPage.expectUrlToContain('/web/v2/spartans');

    // ----------------------------------------------------
    // 3. UI EDIT: Update Phone Number via UI
    // ----------------------------------------------------
    await spartanListPage.searchByName(seedData.name);
    await spartanListPage.clickEditByName(seedData.name);
    await editSpartanPage.expectLoaded();

    const newPhone = '9998887776';
    await editSpartanPage.updateSpartan({ phone: newPhone });

    // ----------------------------------------------------
    // 4. BACKEND API ASSERTION: Verify UI update persisted to DB
    // ----------------------------------------------------
    const apiResponse = await apiClient.getSpartanById(seededId);
    expect(apiResponse.status()).toBe(200);
    const body = await apiResponse.json();
    expect(body.data?.phone).toBe(newPhone);
  });

  // Fast, deterministic API teardown
  test.afterEach(async ({ apiClient }) => {
    if (seededId) {
      await apiClient.deleteSpartanIfExists(seededId);
      seededId = undefined;
    }
  });
});

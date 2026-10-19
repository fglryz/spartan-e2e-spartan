import { test as baseTest, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';
import { SpartanListPage } from '../pages/SpartanListPage.js';
import { AddSpartanPage } from '../pages/AddSpartanPage.js';
import { SpartanDetailPage } from '../pages/SpartanDetailPage.js';
import { EditSpartanPage } from '../pages/EditSpartanPage.js';
import { SpartanApiClient } from '../services/spartan-api-client.js';
import { TestDataGenerator } from '../utilities/test-data-generator.js';

/**
 * Fixture type definition declaring all custom UI and API fixtures available to tests.
 */
export type SpartanFixtures = {
  homePage: HomePage;
  spartanListPage: SpartanListPage;
  addSpartanPage: AddSpartanPage;
  spartanDetailPage: SpartanDetailPage;
  editSpartanPage: EditSpartanPage;
  apiClient: SpartanApiClient;
  dataGenerator: typeof TestDataGenerator;
};

/**
 * Custom Playwright test runner extended with Spartan Page Objects and API Client.
 * Tests import { test, expect } from this file to leverage POM and API fixtures.
 */
export const test = baseTest.extend<SpartanFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  spartanListPage: async ({ page }, use) => {
    await use(new SpartanListPage(page));
  },

  addSpartanPage: async ({ page }, use) => {
    await use(new AddSpartanPage(page));
  },

  spartanDetailPage: async ({ page }, use) => {
    await use(new SpartanDetailPage(page));
  },

  editSpartanPage: async ({ page }, use) => {
    await use(new EditSpartanPage(page));
  },

  apiClient: async ({ request }, use) => {
    await use(new SpartanApiClient(request));
  },

  dataGenerator: async ({}, use) => {
    await use(TestDataGenerator);
  },
});

export { expect };

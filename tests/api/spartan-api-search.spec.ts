import { test, expect } from '../../fixtures/test-base.js';
import { SpartanDTO, ResponseWrapper } from '../../models/spartan.model.js';

test.describe('Spartan REST API: Search Functionality', () => {
  let seededSpartanId: number | undefined;

  test.beforeEach(async ({ apiClient, dataGenerator }) => {
    // Seed a known test Spartan
    const spartan = dataGenerator.generateSpartanDTOWithPrefix('SrchT', 'Female');
    seededSpartanId = await apiClient.createSpartanAndGetId(spartan);
  });

  test('GET /api/v2/spartans/search - Search by nameContains', async ({ apiClient }) => {
    const response = await apiClient.searchSpartans({ nameContains: 'SrchT' });
    expect(response.status()).toBe(200);

    const body: ResponseWrapper<SpartanDTO[]> = await response.json();
    expect(body.message).toBe('Successfully queried all the Spartans.');
    expect(body.totalElement).toBeGreaterThan(0);
    expect(Array.isArray(body.data)).toBe(true);

    // Verify all returned items match search criteria
    if (body.data) {
      for (const item of body.data) {
        expect(item.name.toLowerCase()).toContain('srcht');
      }
    }
  });

  test('GET /api/v2/spartans/search - Search by gender', async ({ apiClient }) => {
    const response = await apiClient.searchSpartans({ gender: 'Female' });
    expect(response.status()).toBe(200);

    const body: ResponseWrapper<SpartanDTO[]> = await response.json();
    expect(Array.isArray(body.data)).toBe(true);

    if (body.data && body.data.length > 0) {
      for (const item of body.data.slice(0, 5)) {
        expect(item.gender).toBe('Female');
      }
    }
  });

  test('GET /api/v2/spartans/search - Combined search (nameContains and gender)', async ({ apiClient }) => {
    const response = await apiClient.searchSpartans({
      nameContains: 'SrchT',
      gender: 'Female',
    });
    expect(response.status()).toBe(200);

    const body: ResponseWrapper<SpartanDTO[]> = await response.json();
    expect(body.totalElement).toBeGreaterThan(0);

    if (body.data) {
      for (const item of body.data) {
        expect(item.name.toLowerCase()).toContain('srcht');
        expect(item.gender).toBe('Female');
      }
    }
  });

  test.afterEach(async ({ apiClient }) => {
    if (seededSpartanId) {
      await apiClient.deleteSpartanIfExists(seededSpartanId);
      seededSpartanId = undefined;
    }
  });
});

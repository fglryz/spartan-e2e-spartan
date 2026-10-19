import { test, expect } from '../../fixtures/test-base.js';
import { ExceptionWrapper, SpartanDTO } from '../../models/spartan.model.js';

test.describe('Spartan REST API: Negative & Boundary Validation Tests', () => {
  test('POST /api/v2/spartans - 400 Bad Request on empty name', async ({ apiClient }) => {
    const invalidPayload: SpartanDTO = {
      name: '',
      gender: 'Male',
      phone: '1234567890',
    };

    const response = await apiClient.createSpartan(invalidPayload);
    expect(response.status()).toBe(400);

    const body: ExceptionWrapper = await response.json();
    expect(body.httpStatus).toBe('BAD_REQUEST');
    expect(body.message).toBe('Invalid Input(s)');
    expect(body.errorCount).toBeGreaterThan(0);

    const nameError = body.validationExceptions?.find((e) => e.errorField === 'name');
    expect(nameError).toBeDefined();
    expect(nameError?.reason).toContain('name is required');
  });

  test('POST /api/v2/spartans - 400 Bad Request on invalid phone number length', async ({ apiClient }) => {
    const invalidPayload: SpartanDTO = {
      name: 'ValidName',
      gender: 'Male',
      phone: '123', // Too short (min 10 required)
    };

    const response = await apiClient.createSpartan(invalidPayload);
    expect(response.status()).toBe(400);

    const body: ExceptionWrapper = await response.json();
    expect(body.httpStatus).toBe('BAD_REQUEST');

    const phoneError = body.validationExceptions?.find((e) => e.errorField === 'phone');
    expect(phoneError).toBeDefined();
    expect(phoneError?.reason).toContain('phone number should be 10 to 13 characters long');
  });

  test('GET /api/v2/spartans/{id} - 404 Not Found for non-existent ID', async ({ apiClient }) => {
    const nonExistentId = 99999999;
    const response = await apiClient.getSpartanById(nonExistentId);
    expect(response.status()).toBe(404);

    const body: ExceptionWrapper = await response.json();
    expect(body.httpStatus).toBe('NOT_FOUND');
    expect(body.message).toContain('could not be found');
  });

  test('DELETE /api/v2/spartans/{id} - 404 Not Found for non-existent ID', async ({ apiClient }) => {
    const nonExistentId = 99999999;
    const response = await apiClient.deleteSpartan(nonExistentId);
    expect(response.status()).toBe(404);

    const body: ExceptionWrapper = await response.json();
    expect(body.httpStatus).toBe('NOT_FOUND');
  });
});

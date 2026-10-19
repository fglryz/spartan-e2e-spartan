import { test, expect } from '../../fixtures/test-base.js';
import { SpartanDTO, ResponseWrapper } from '../../models/spartan.model.js';

test.describe('Spartan REST API: Full CRUD Operations', () => {
  let createdSpartanId: number | undefined;

  test('GET /api/v2/hello - Health check endpoint', async ({ apiClient }) => {
    const response = await apiClient.getHello();
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toBe('Hello World!');
  });

  test('GET /api/v2/spartans - Retrieve all Spartans', async ({ apiClient }) => {
    const response = await apiClient.getAllSpartans();
    expect(response.status()).toBe(200);

    const body: ResponseWrapper<SpartanDTO[]> = await response.json();
    expect(body.totalElement).toBeGreaterThan(0);
    expect(Array.isArray(body.data)).toBe(true);

    if (body.data && body.data.length > 0) {
      const first = body.data[0];
      expect(first).toHaveProperty('id');
      expect(first).toHaveProperty('name');
      expect(first).toHaveProperty('gender');
      expect(first).toHaveProperty('phone');
    }
  });

  test('POST /api/v2/spartans - Create a new Spartan', async ({ apiClient, dataGenerator }) => {
    const newSpartan = dataGenerator.generateSpartanDTOWithPrefix('ApiCrt', 'Male');

    const response = await apiClient.createSpartan(newSpartan);
    expect(response.status()).toBe(201);

    const body: ResponseWrapper<SpartanDTO> = await response.json();
    expect(body.message).toBe('Successfully created the Spartan.');
    expect(body.totalElement).toBe(1);
    expect(body.data).toBeDefined();

    if (body.data) {
      createdSpartanId = body.data.id;
      expect(body.data.name).toBe(newSpartan.name);
      expect(body.data.gender).toBe(newSpartan.gender);
      expect(body.data.phone).toBe(newSpartan.phone);
      expect(typeof body.data.id).toBe('number');
    }
  });

  test('GET /api/v2/spartans/{id} - Retrieve Spartan by ID', async ({ apiClient, dataGenerator }) => {
    // Seed a Spartan
    const payload = dataGenerator.generateSpartanDTOWithPrefix('ApiGet', 'Female');
    const id = await apiClient.createSpartanAndGetId(payload);

    try {
      const response = await apiClient.getSpartanById(id);
      expect(response.status()).toBe(200);

      const body: ResponseWrapper<SpartanDTO> = await response.json();
      expect(body.message).toBe('Successfully retrieved the Spartan.');
      expect(body.data?.id).toBe(id);
      expect(body.data?.name).toBe(payload.name);
      expect(body.data?.gender).toBe(payload.gender);
      expect(body.data?.phone).toBe(payload.phone);
    } finally {
      await apiClient.deleteSpartanIfExists(id);
    }
  });

  test('PUT /api/v2/spartans/{id} - Full update of a Spartan', async ({ apiClient, dataGenerator }) => {
    const initial = dataGenerator.generateSpartanDTOWithPrefix('ApiPutI', 'Male');
    const id = await apiClient.createSpartanAndGetId(initial);

    try {
      const updatedData = dataGenerator.generateSpartanDTOWithPrefix('ApiPutU', 'Female');
      const response = await apiClient.updateSpartan(id, updatedData);
      expect(response.status()).toBe(200);

      const body: ResponseWrapper<SpartanDTO> = await response.json();
      expect(body.message).toBe('Successfully updated the Spartan.');
      expect(body.data?.name).toBe(updatedData.name);
      expect(body.data?.gender).toBe(updatedData.gender);
      expect(body.data?.phone).toBe(updatedData.phone);
    } finally {
      await apiClient.deleteSpartanIfExists(id);
    }
  });

  test('PATCH /api/v2/spartans/{id} - Partial update of a Spartan', async ({ apiClient, dataGenerator }) => {
    const initial = dataGenerator.generateSpartanDTOWithPrefix('ApiPatI', 'Male');
    const id = await apiClient.createSpartanAndGetId(initial);

    try {
      const newName = 'PatchedName';
      const patchResponse = await apiClient.patchSpartan(id, { name: newName });
      expect(patchResponse.status()).toBe(200);

      const body: ResponseWrapper<SpartanDTO> = await patchResponse.json();
      expect(body.message).toBe('Successfully updated the Spartan.');
      expect(body.data?.name).toBe(newName);
      // Gender and phone should remain untouched
      expect(body.data?.gender).toBe(initial.gender);
      expect(body.data?.phone).toBe(initial.phone);
    } finally {
      await apiClient.deleteSpartanIfExists(id);
    }
  });

  test('DELETE /api/v2/spartans/{id} - Delete Spartan and verify 404 on subsequent get', async ({
    apiClient,
    dataGenerator,
  }) => {
    const payload = dataGenerator.generateSpartanDTOWithPrefix('ApiDel', 'Male');
    const id = await apiClient.createSpartanAndGetId(payload);

    const deleteResponse = await apiClient.deleteSpartan(id);
    expect(deleteResponse.status()).toBe(200);

    const deleteBody: ResponseWrapper = await deleteResponse.json();
    expect(deleteBody.message).toBe('Successfully deleted the Spartan.');

    // Verify Spartan is no longer found
    const getResponse = await apiClient.getSpartanById(id);
    expect(getResponse.status()).toBe(404);
  });

  test.afterEach(async ({ apiClient }) => {
    if (createdSpartanId) {
      await apiClient.deleteSpartanIfExists(createdSpartanId);
      createdSpartanId = undefined;
    }
  });
});

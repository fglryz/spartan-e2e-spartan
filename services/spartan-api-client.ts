import { APIRequestContext, APIResponse } from '@playwright/test';
import {
  SpartanDTO,
  SpartanPartialUpdateDTO,
  SpartanSearchParams,
  ResponseWrapper,
} from '../models/spartan.model.js';

/**
 * Service client encapsulating all Spartan REST API endpoints.
 * Interacts directly with backend controllers via Playwright APIRequestContext.
 */
export class SpartanApiClient {
  readonly request: APIRequestContext;
  readonly basePath: string = '/api/v2';

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * GET /api/v2/hello
   * Health check / welcome endpoint returning text.
   */
  async getHello(): Promise<APIResponse> {
    return await this.request.get(`${this.basePath}/hello`);
  }

  /**
   * GET /api/v2/spartans
   * Retrieves all Spartans.
   */
  async getAllSpartans(): Promise<APIResponse> {
    return await this.request.get(`${this.basePath}/spartans`, {
      headers: { Accept: 'application/json' },
    });
  }

  /**
   * GET /api/v2/spartans/{id}
   * Retrieves a single Spartan by ID.
   */
  async getSpartanById(id: number | string): Promise<APIResponse> {
    return await this.request.get(`${this.basePath}/spartans/${id}`, {
      headers: { Accept: 'application/json' },
    });
  }

  /**
   * POST /api/v2/spartans
   * Creates a new Spartan.
   */
  async createSpartan(payload: SpartanDTO): Promise<APIResponse> {
    return await this.request.post(`${this.basePath}/spartans`, {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  /**
   * PUT /api/v2/spartans/{id}
   * Replaces/updates an entire Spartan record.
   */
  async updateSpartan(id: number | string, payload: SpartanDTO): Promise<APIResponse> {
    return await this.request.put(`${this.basePath}/spartans/${id}`, {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  /**
   * PATCH /api/v2/spartans/{id}
   * Partially updates one or more fields of a Spartan.
   */
  async patchSpartan(
    id: number | string,
    payload: SpartanPartialUpdateDTO
  ): Promise<APIResponse> {
    return await this.request.patch(`${this.basePath}/spartans/${id}`, {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  /**
   * DELETE /api/v2/spartans/{id}
   * Deletes a Spartan record by ID.
   */
  async deleteSpartan(id: number | string): Promise<APIResponse> {
    return await this.request.delete(`${this.basePath}/spartans/${id}`, {
      headers: { Accept: 'application/json' },
    });
  }

  /**
   * GET /api/v2/spartans/search
   * Queries Spartans using query parameters (nameContains, gender).
   */
  async searchSpartans(params: SpartanSearchParams): Promise<APIResponse> {
    return await this.request.get(`${this.basePath}/spartans/search`, {
      params: params as Record<string, string>,
      headers: { Accept: 'application/json' },
    });
  }

  /**
   * Utility method to create a Spartan and directly return the created ID.
   * Useful for pre-condition seeding in UI and API tests.
   */
  async createSpartanAndGetId(payload: SpartanDTO): Promise<number> {
    const response = await this.createSpartan(payload);
    if (!response.ok()) {
      throw new Error(`Failed to create Spartan. Status: ${response.status()}, body: ${await response.text()}`);
    }
    const body: ResponseWrapper<SpartanDTO> = await response.json();
    if (!body.data?.id) {
      throw new Error('Created Spartan response did not include an ID.');
    }
    return body.data.id;
  }

  /**
   * Utility method to safely delete a Spartan without throwing if already deleted.
   * Useful for teardown hooks.
   */
  async deleteSpartanIfExists(id: number | string): Promise<boolean> {
    try {
      const response = await this.deleteSpartan(id);
      return response.status() === 200 || response.status() === 204;
    } catch {
      return false;
    }
  }
}

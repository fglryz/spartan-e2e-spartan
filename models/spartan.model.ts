/**
 * Spartan domain models, DTOs, and API response envelopes
 * matching the Spartan OpenAPI 3.0 specification.
 */

export type SpartanGender = 'Male' | 'Female' | 'MALE' | 'FEMALE';

/**
 * Core Spartan Entity / DTO used for creation and retrieval.
 */
export interface SpartanDTO {
  id?: number;
  name: string;
  gender: 'Male' | 'Female';
  phone: string;
}

/**
 * Partial update payload for PATCH operations.
 */
export interface SpartanPartialUpdateDTO {
  name?: string;
  gender?: 'Male' | 'Female';
  phone?: string;
}

/**
 * Standard Success Response Wrapper envelope.
 */
export interface ResponseWrapper<T = SpartanDTO | SpartanDTO[]> {
  message: string;
  totalElement?: number;
  data?: T;
}

/**
 * Field-level validation exception detail.
 */
export interface ValidationExceptionWrapper {
  errorField: string;
  rejectedValue: unknown;
  reason: string;
}

/**
 * Standard Error Exception Wrapper envelope.
 */
export interface ExceptionWrapper {
  message: string;
  httpStatus: string;
  localDateTime: string;
  errorCount?: number;
  validationExceptions?: ValidationExceptionWrapper[];
}

/**
 * Query parameters for Spartan search endpoint.
 */
export interface SpartanSearchParams {
  nameContains?: string;
  gender?: 'Male' | 'Female';
}

/**
 * UI Form Data representation.
 */
export interface SpartanFormData {
  name: string;
  gender: SpartanGender;
  phone: string;
}

/**
 * UI Table row data representation.
 */
export interface SpartanRowData {
  id: string;
  name: string;
  gender: SpartanGender;
  phone: string;
}

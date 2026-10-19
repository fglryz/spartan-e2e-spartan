import { faker } from '@faker-js/faker';
import { SpartanFormData, SpartanGender, SpartanDTO } from '../models/spartan.model.js';

/**
 * Utility for generating randomized, realistic, and boundary test data
 * for Spartan UI and API tests.
 */
export class TestDataGenerator {
  /**
   * Generates a valid Spartan payload matching application validation constraints.
   * Name: 2 - 15 characters, letters only.
   * Phone: Exactly 10 digits.
   */
  static generateValidSpartan(gender?: SpartanGender): SpartanFormData {
    const selectedGender = (gender
      ? gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase()
      : faker.helpers.arrayElement(['Male', 'Female'])) as 'Male' | 'Female';
    
    // Generate valid firstname between 3 and 10 letters without special characters
    let rawName = selectedGender === 'Male' ? faker.person.firstName('male') : faker.person.firstName('female');
    rawName = rawName.replace(/[^a-zA-Z]/g, '');
    if (rawName.length < 3) rawName = 'Alex';
    if (rawName.length > 14) rawName = rawName.substring(0, 14);

    // Generate valid 10-digit phone number (avoid leading 0 for safety)
    const phone = `${faker.number.int({ min: 1, max: 9 })}${faker.string.numeric(9)}`;

    return {
      name: rawName,
      gender: selectedGender,
      phone,
    };
  }

  /**
   * Generates a Spartan with a custom name prefix for easy test tracing.
   */
  static generateSpartanWithPrefix(prefix: string, gender?: SpartanGender): SpartanFormData {
    const spartan = this.generateValidSpartan(gender);
    // Keep total name length <= 15 chars
    const maxPrefixLen = 6;
    const truncatedPrefix = prefix.substring(0, maxPrefixLen);
    const suffix = faker.string.alphanumeric(4);
    spartan.name = `${truncatedPrefix}${suffix}`;
    return spartan;
  }

  /**
   * Generates a valid SpartanDTO payload for REST API requests.
   */
  static generateSpartanDTO(gender?: 'Male' | 'Female'): SpartanDTO {
    const base = this.generateValidSpartan(gender);
    return {
      name: base.name,
      gender: (base.gender === 'Female' ? 'Female' : 'Male'),
      phone: base.phone,
    };
  }

  /**
   * Generates a SpartanDTO with a recognizable prefix for API tests.
   */
  static generateSpartanDTOWithPrefix(prefix: string, gender?: 'Male' | 'Female'): SpartanDTO {
    const base = this.generateSpartanWithPrefix(prefix, gender);
    return {
      name: base.name,
      gender: (base.gender === 'Female' ? 'Female' : 'Male'),
      phone: base.phone,
    };
  }

  /**
   * Generates boundary/invalid payloads for negative validation tests.
   */
  static generateInvalidSpartanCases() {
    return {
      emptyName: {
        name: '',
        gender: 'Male' as const,
        phone: '1234567890',
      },
      nameTooShort: {
        name: 'A',
        gender: 'Female' as const,
        phone: '1234567890',
      },
      nameTooLong: {
        name: 'ThisNameIsWayTooLongForSpartanAPI',
        gender: 'Male' as const,
        phone: '1234567890',
      },
      phoneWithLetters: {
        name: 'ValidName',
        gender: 'Male' as const,
        phone: '12345abcde',
      },
      phoneTooShort: {
        name: 'ValidName',
        gender: 'Female' as const,
        phone: '12345',
      },
    };
  }
}

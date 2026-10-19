/**
 * Lightweight logger for structured test reporting.
 */
export class Logger {
  static info(message: string): void {
    console.log(`[INFO]  ${new Date().toISOString()} - ${message}`);
  }

  static step(stepNumber: number | string, description: string): void {
    console.log(`[STEP ${stepNumber}] ${description}`);
  }

  static warn(message: string): void {
    console.warn(`[WARN]  ${new Date().toISOString()} - ${message}`);
  }

  static error(message: string, error?: unknown): void {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error || '');
  }
}

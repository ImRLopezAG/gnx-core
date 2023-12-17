import type { GNXFluentValidatorErrorsConstructor } from './types'
/**
 * Custom error class for GNXFluentValidator.
 */
export class GNXFluentValidatorError extends Error {
  errors: string[]
  count: number
  /**
   * Creates a new instance of the GNXFluentValidatorErrorsConstructor class.
   * @param {GNXFluentValidatorErrorsConstructor} options - The options for the constructor.
   * @param {string} options.message - The error message.
   * @param {string[]} options.errors - The array of errors.
   * @param {number} options.count - The count of errors.
   */
  constructor ({ message, errors, count }: GNXFluentValidatorErrorsConstructor) {
    super(message)
    this.name = 'GNXFluentValidatorError'
    this.errors = errors
    this.count = count
  }
}

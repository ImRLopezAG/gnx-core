import { randomUUID } from 'crypto'
import type { ModelValidations, Start, Identifier, SoftValidation } from './types'
import { GNXFluentValidatorError } from './errors'

export class ModelValidator {
  private static instance: ModelValidator
  private constructor () {}

  /**
   * Returns the ModelValidator instance.
   * @returns The ModelValidator instance.
   */
  public static create (): ModelValidator {
    if (!ModelValidator.instance) this.instance = new ModelValidator()
    return this.instance
  }

  /**
   * Returns a ModelValidations instance.
   * @param {ModelValidatorOptions} options - The options for the ModelValidations instance.
   * @returns {ModelValidations} The ModelValidations instance.
   */
  public for<T = Record<string, any> | any> ({ model }: Start<T>): ModelValidations<T> {
    return new FluentAPIModel<T>({ model })
  }
}

/**
 * Represents a model validator that performs validations on a given model.
 * @template T - The type of the model.
 */
class FluentAPIModel<T = Record<string, any> | any> implements ModelValidations<T> {
  private readonly validations = new Map<string, (value: any) => boolean>()
  private readonly model: T
  /**
   * Constructs a new instance of the ModelValidator class.
   * @param {Start<T>} options - The options for the ModelValidator.
   * @param {T} options.model - The model to be validated.
   */
  constructor ({ model }: Start<T>) {
    this.model = model as T
    Object.assign(this, { ...model })
  }

  /**
   * Returns the validations map.
   *
   * @returns The validations map.
   */
  public getValidations (): Map<string, (value: any) => boolean> {
    return this.validations
  }

  /**
   * Checks if the model is valid by evaluating all validations.
   * @returns {boolean} True if the model is valid, false otherwise.
   */
  public validate (): boolean {
    return !this.getErrors().length
  }

  /**
   * Returns an array of keys for invalid validations.
   * @returns {string[]} Array of keys for invalid validations.
   */
  public getErrors (): string[] {
    return Array.from(this.validations).filter(([key, validator]) => {
      return !validator(this.model)
    }).map(([key]) => key)
  }

  /**
   * Adds a validation function for a specific property of the model.
   * @param callback - The validation function that takes an object of type T and returns a boolean indicating if the property is valid.
   * @param identifier - Optional identifier for the validation. If not provided, a random UUID will be generated.
   * @returns The ModelValidations instance for method chaining.
   */
  public withProperty (callback: (obj: T) => boolean, { identifier }: Identifier = { identifier: randomUUID() }): ModelValidations<T> {
    this.validations.set(`${identifier ?? randomUUID()}`, callback)
    return this
  }

  /**
   * Performs a soft validation on the model.
   * @returns {SoftValidation} The result of the soft validation. which includes a boolean indicating if the model is valid, an array of keys for invalid validations and the total number of errors.
   */
  public softValidation (): SoftValidation {
    return {
      isValid: this.validate(),
      errors: this.getErrors(),
      totalErrors: this.getErrors().length
    }
  }

  /**
   * Performs a hard validation on the model.
   * @returns {void} Throws an error if the model is not valid.
   */
  public hardValidation (): void {
    if (!this.validate()) {
      throw new GNXFluentValidatorError({
        message: 'The model is not valid.',
        errors: this.getErrors(),
        count: this.getErrors().length
      })
    }
  }
}

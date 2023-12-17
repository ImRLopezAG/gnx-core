import type { FluentValidations, Between, FluentValidationsOptions, Validations, SoftValidation } from './types'
import { GNXFluentValidatorError } from './errors'
/**
 * Represents a FluentValidation instance that allows for chaining validation rules.
 */
export class FluentValidation {
  private static instance: FluentValidation
  private constructor () {}

  /**
   * Starts the validations for the given value.
   * @param value - The value to be validated.
   * @returns An instance of FluentValidation.
   */
  public static create (): FluentValidation {
    if (!this.instance) this.instance = new FluentValidation()
    return this.instance
  }

  public for<T = any> ({ value }: { value: T }): FluentValidations {
    return new FluentAPI<T>({ value })
  }
}

class FluentAPI<T = any> implements FluentValidations {
  private readonly validations: Map<Validations, boolean> = new Map<Validations, boolean>()
  private readonly base: any
  constructor ({ value }: { value: T }) {
    this.base = value
  }

  /**
   * Retrieves the validations map.
   *
   * @returns The validations map.
   */
  public getValidations (): Map<Validations, boolean> {
    return this.validations
  }

  /**
   * Checks if the value is valid based on the validations.
   * @returns {boolean} True if the value is valid, false otherwise.
   */
  public validate (): boolean {
    return !Array.from(this.validations.values()).includes(false)
  }

  /**
   * Returns an array of invalid validations.
   * @returns {string[]} Array of invalid validations.
   */
  public getErrors (): string[] {
    return Array.from(this.validations.entries()).filter(([, value]) => !value).map(([key]) => key)
  }

  /**
   * Performs a hard validation, throwing an error if the value is invalid.
   * @returns The FluentValidations instance.
   */
  public hardValidation (): void {
    if (!this.validate()) {
      throw new GNXFluentValidatorError({
        message: 'Validation failed',
        errors: this.getErrors(),
        count: this.getErrors().length
      })
    }
  }

  /**
   * Performs a soft validation, returning an object with the validation results.
   * @returns The FluentValidations instance.
   */
  public softValidation (): SoftValidation {
    return {
      isValid: this.validate(),
      errors: this.getErrors(),
      totalErrors: this.getErrors().length
    }
  }

  /**
   * Sets a validation rule that checks if the value is a string.
   * @returns The FluentValidations instance for method chaining.
   */
  public isString (): FluentValidations {
    this.validations.set('isString', typeof this.base === 'string')
    return this
  }

  /**
   * Sets a validation rule that checks if the value is a boolean.
   * @returns The FluentValidations instance for method chaining.
   */
  public isBoolean (): FluentValidations {
    this.validations.set('isBoolean', typeof this.base === 'boolean')
    return this
  }

  /**
   * Checks if the value is an array.
   * @returns {FluentValidations} The FluentValidations instance.
   */
  public isArray (): FluentValidations {
    this.validations.set('isArray', Array.isArray(this.base))
    return this
  }

  /**
   * Checks if the value is an object.
   * @param value - The value to be checked.
   * @returns {boolean} Returns true if the value is an object, false otherwise.
   */
  public isObject (): FluentValidations {
    this.validations.set('isObject', typeof this.base === 'object')
    return this
  }

  /**
   * Checks if the value is a function.
   * @returns {FluentValidations} The FluentValidations instance.
   */
  public isFunction (): FluentValidations {
    this.validations.set('isFunction', typeof this.base === 'function')
    return this
  }

  /**
   * Sets a validation rule that checks if the value should be undefined.
   * @returns The FluentValidations instance for method chaining.
   */
  /**
   * Checks if the value should be undefined.
   * @returns The FluentValidations instance.
   */
  public isUndefined (): FluentValidations {
    this.validations.set('isUndefined', typeof this.base === 'undefined')
    return this
  }

  /**
   * Checks if the value should be required.
   * @returns The FluentValidations instance.
   */
  public isRequired (): FluentValidations {
    this.validations.set('isRequired', typeof this.base !== 'undefined' && this.base !== null && this.base !== '')
    return this
  }

  /**
   * Sets a validation rule that checks if the value is equal to the specified number.
   * @param value - The number to compare against.
   * @returns The FluentValidations instance for method chaining.
   */
  public isEqualTo ({ value }: FluentValidationsOptions): FluentValidations {
    this.validations.set('isEqualTo', this.base === value)
    return this
  }

  /**
   * Sets a validation rule that checks if the value should be greater than a specified number.
   * @param value - The number that the value should be greater than.
   * @returns The FluentValidations instance for method chaining.
   */
  public isGreaterThan ({ value }: FluentValidationsOptions): FluentValidations {
    this.validations.set('isGreaterThan', this.base > value)
    return this
  }

  /**
    * Sets a validation rule that the value should be greater than or equal to the specified value.
    * @param value The value to compare against.
    * @returns The FluentValidations instance for method chaining.
    */
  public isGreaterThanOrEqualTo ({ value }: FluentValidationsOptions): FluentValidations {
    this.validations.set('isGreaterThanOrEqualTo', this.base >= value)
    return this
  }

  /**
   * Sets a validation rule that the value should be less than the specified number.
   * @param value - The number that the value should be less than.
   * @returns The FluentValidations instance for method chaining.
   */
  public isLessThan ({ value }: FluentValidationsOptions): FluentValidations {
    this.validations.set('isLessThan', this.base < value)
    return this
  }

  /**
   * Sets a validation rule that checks if the value is less than or equal to the specified value.
   * @param value - The value to compare against.
   * @returns The FluentValidations instance for method chaining.
   */
  public isLessThanOrEqualTo ({ value }: FluentValidationsOptions): FluentValidations {
    this.validations.set('isLessThanOrEqualTo', this.base <= value)
    return this
  }

  /**
   * Sets a validation rule that checks if the value is between the specified minimum and maximum values.
   * @param {Between} options - The minimum and maximum values to check against.
   * @returns {FluentValidations} - The FluentValidations instance for method chaining.
   */
  public isBetween ({ min, max }: Between): FluentValidations {
    this.validations.set('isBetween', this.base > min && this.base < max)
    return this
  }

  /**
   * Sets the maximum length validation rule for the fluent validation chain.
   * @param value The maximum length value to compare against.
   * @returns The FluentValidations instance.
   */
  public isMaxLength ({ value }: FluentValidationsOptions): FluentValidations {
    this.validations.set('isMaxLength', this.base.length <= value)
    return this
  }

  /**
   * Sets the minimum length validation rule for the fluent validator.
   * @param value The minimum length value to be validated against.
   * @returns The fluent validator instance.
   */
  public isMinLength ({ value }: FluentValidationsOptions): FluentValidations {
    this.validations.set('isMinLength', this.base.length >= value)
    return this
  }

  /**
   * Sets a validation rule that checks if the length of the value is between the specified minimum and maximum values.
   * @param {Between} options - The minimum and maximum values for the length.
   * @returns {FluentValidations} - The FluentValidations instance for method chaining.
   */
  public isLengthBetween ({ min, max }: Between): FluentValidations {
    this.validations.set('isLengthBetween', this.base.length > min && this.base.length < max)
    return this
  }

  /**
   * Sets a validation rule that checks if the length of the value is equal to the specified value.
   * @param value The expected length of the value.
   * @returns The FluentValidations instance for method chaining.
   */
  public isLengthEqual ({ value }: FluentValidationsOptions): FluentValidations {
    this.validations.set('isLengthEqual', this.base.length === value)
    return this
  }

  /**
   * Sets a validation rule that checks if the length of the value is greater than the specified value.
   * @param value The minimum length that the value should be greater than.
   * @returns The FluentValidations instance for method chaining.
   */
  public isLengthGreaterThan ({ value }: FluentValidationsOptions): FluentValidations {
    this.validations.set('isLengthGreaterThan', this.base.length > value)
    return this
  }

  /**
   * Sets a validation rule that checks if the length of the value is greater than or equal to the specified value.
   * @param value The minimum length that the value should be greater than or equal to.
   * @returns The FluentValidations instance for method chaining.
   */
  public isLengthGreaterThanOrEqualTo ({ value }: FluentValidationsOptions): FluentValidations {
    this.validations.set('isLengthGreaterThanOrEqualTo', this.base.length >= value)
    return this
  }

  /**
   * Sets a validation rule that checks if the length of the value is less than the specified value.
   * @param value The maximum length allowed.
   * @returns The FluentValidations instance for method chaining.
   */
  public isLengthLessThan ({ value }: FluentValidationsOptions): FluentValidations {
    this.validations.set('isLengthLessThan', this.base.length < value)
    return this
  }

  /**
   * Sets a validation rule that checks if the length of the value is less than or equal to the specified value.
   * @param value The maximum length allowed for the value.
   * @returns The FluentValidations instance for method chaining.
   */
  public isLengthLessThanOrEqualTo ({ value }: FluentValidationsOptions): FluentValidations {
    this.validations.set('isLengthLessThanOrEqualTo', this.base.length <= value)
    return this
  }

  /**
   * Sets the validation rule that the value should be a number.
   * @returns The FluentValidations instance for method chaining.
   */
  public isNumber (): FluentValidations {
    this.validations.set('isNumber', typeof this.base === 'number')
    return this
  }

  /**
   * Sets the validation rule that the value should be divisible by the specified number.
   * @param value - The number by which the value should be divisible.
   * @returns The FluentValidations instance for method chaining.
   */
  public isDivisibleBy ({ value }: FluentValidationsOptions): FluentValidations {
    this.validations.set('isDivisibleBy', this.base % Number(value) === 0)
    return this
  }

  /**
   * Sets a validation rule that checks if the value is positive.
   * @returns The current instance of FluentValidations.
   */
  public isPositive (): FluentValidations {
    this.validations.set('isPositive', this.base > 0)
    return this
  }

  /**
   * Sets the validation rule that the value should be negative.
   *
   * @returns The FluentValidations instance for method chaining.
   */
  public isNegative (): FluentValidations {
    this.validations.set('isNegative', this.base < 0)
    return this
  }

  /**
   * Checks if the value should be a valid email address.
   * @returns The FluentValidations instance.
   */
  public isEmail (): FluentValidations {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    this.validations.set('isEmail', emailRegex.test(String(this.base)))
    return this
  }

  /**
   * Checks if the value should be a valid date in the format MM/DD/YYYY.
   * @returns The FluentValidations instance.
   */
  public isDate (): FluentValidations {
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|1[0-9]|2[0-9]|3[01])\/(19|20)\d\d$/
    this.validations.set('isDate', dateRegex.test(String(this.base)))
    return this
  }

  /**
   * Checks if the current date is after the specified date.
   * @param value - The date to compare against.
   * @returns The FluentValidations instance for method chaining.
   */
  public isDateAfter ({ value }: FluentValidationsOptions): FluentValidations {
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|1[0-9]|2[0-9]|3[01])\/(19|20)\d\d$/
    if (!dateRegex.test(String(this.base))) {
      this.validations.set('isDate', false)
      return this
    }
    const currentDate = new Date(String(this.base))
    const dateToCompare = new Date(String(value))
    this.validations.set('isDateAfter', currentDate > dateToCompare)
    return this
  }

  /**
   * Checks if the base date should be before the specified date.
   * @param value - The date to compare against the base date.
   * @returns The FluentValidations instance for method chaining.
   */
  public isDateBefore ({ value }: FluentValidationsOptions): FluentValidations {
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|1[0-9]|2[0-9]|3[01])\/(19|20)\d\d$/
    if (!dateRegex.test(String(this.base))) {
      this.validations.set('isDate', false)
      return this
    }
    const currentDate = new Date(String(this.base))
    const dateToCompare = new Date(String(value))
    this.validations.set('isDateBefore', currentDate < dateToCompare)
    return this
  }

  /**
   * Checks if the value should be a date between the specified minimum and maximum dates.
   * @param {Between} options - The minimum and maximum dates to compare against.
   * @returns {FluentValidations} - The FluentValidations instance for method chaining.
   */
  public isDateBetween ({ min, max }: Between): FluentValidations {
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|1[0-9]|2[0-9]|3[01])\/(19|20)\d\d$/
    if (!dateRegex.test(String(this.base)) && !dateRegex.test(String(min)) && !dateRegex.test(String(max))) {
      this.validations.set('isDate', false)
      return this
    }
    const currentDate = new Date(String(this.base))
    const minDate = new Date(String(min))
    const maxDate = new Date(String(max))
    this.validations.set('isDateBetween', currentDate > minDate && currentDate < maxDate)
    return this
  }

  /**
   * Validates whether the value is a valid GUID.
   * @returns The FluentValidations instance.
   */
  public isGuid (): FluentValidations {
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    this.validations.set('isGuid', guidRegex.test(String(this.base)))
    return this
  }

  /**
   * Validates whether the value is a valid hexadecimal color code.
   *
   * @returns The FluentValidations instance for method chaining.
   */
  public isHexColor (): FluentValidations {
    const hexColorRegex = /^#?([a-f0-9]{6}|[a-f0-9]{3})$/
    this.validations.set('isHexColor', hexColorRegex.test(String(this.base)))
    return this
  }

  /**
   * Checks if the value is a hexadecimal string.
   * @returns The FluentValidations instance.
   */
  public isHexadecimal (): FluentValidations {
    const hexRegex = /^[0-9a-f]+$/
    this.validations.set('isHexadecimal', hexRegex.test(String(this.base)))
    return this
  }

  /**
   * Checks if the value is a valid IP address.
   * @returns The FluentValidations instance.
   */
  public isIP (): FluentValidations {
    const ipRegex = /^(?:(?:^|\.)(?:2(?:5[0-5]|[0-4]\d)|1?\d?\d)){4}$/
    this.validations.set('isIP', ipRegex.test(String(this.base)))
    return this
  }

  /**
   * Validates whether the input is a valid IPv4 address.
   * @returns The FluentValidations instance for method chaining.
   */
  public isIPv4 (): FluentValidations {
    const ipRegex = /^(?:(?:^|\.)(?:2(?:5[0-5]|[0-4]\d)|1?\d?\d)){4}$/
    this.validations.set('isIPv4', ipRegex.test(String(this.base)))
    return this
  }

  /**
   * Checks if the value should be a valid IPv6 address.
   * @returns The FluentValidations instance for method chaining.
   */
  public isIPv6 (): FluentValidations {
    const ipRegex = /^(?:(?:^|\.)(?:2(?:5[0-5]|[0-4]\d)|1?\d?\d)){4}$/
    this.validations.set('isIPv6', ipRegex.test(String(this.base)))
    return this
  }

  /**
   * Checks if the input value is a valid JSON string.
   * @returns {FluentValidations} The FluentValidations instance.
   */
  public isJSON (): FluentValidations {
    const jsonRegex = /^[\],:{}\s]*$/
    this.validations.set('isJSON', jsonRegex.test(String(this.base)))
    return this
  }

  /**
   * Checks if the value should be lowercase.
   * @returns The FluentValidations instance.
   */
  public isLowercase (): FluentValidations {
    const lowercaseRegex = /^[a-z]+$/
    this.validations.set('isLowercase', lowercaseRegex.test(String(this.base)))
    return this
  }

  /**
   * Checks if the value should be in uppercase.
   * @returns The FluentValidations instance.
   */
  public isUppercase (): FluentValidations {
    const uppercaseRegex = /^[A-Z]+$/
    this.validations.set('isUppercase', uppercaseRegex.test(String(this.base)))
    return this
  }

  /**
   * Checks if the value should be a valid UUID (Universally Unique Identifier).
   * @returns The FluentValidations instance.
   */
  public isUUID (): FluentValidations {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    this.validations.set('isUUID', uuidRegex.test(String(this.base)))
    return this
  }

  /**
   * Checks if the value should be a valid credit card number.
   * @returns The FluentValidations instance.
   */
  public isCreditCard (): FluentValidations {
    const creditCardRegex = /^((4\d{3})|(5[1-5]\d{2})|(6011))-?\d{4}-?\d{4}-?\d{4}|3[4,7]\d{13}$/
    this.validations.set('isCreditCard', creditCardRegex.test(String(this.base)))
    return this
  }

  /**
   * Checks if the value should be a valid URL.
   * @returns The FluentValidations instance.
   */
  public isURL (): FluentValidations {
    const urlRegex = /^(?:\w+:)?\/\/([^\s]+\.\S{2}|localhost[?\d]*)\S*$/
    this.validations.set('isURL', urlRegex.test(String(this.base)))
    return this
  }

  /**
   * Checks if the value should be a valid Gmail address.
   * @returns The FluentValidations instance.
   */
  public isGmail (): FluentValidations {
    const gmailRegex = /^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/
    this.validations.set('isGmail', gmailRegex.test(String(this.base)))
    return this
  }

  /**
   * Checks if the value should be a valid Outlook address.
   * @returns The FluentValidations instance.
   */
  public isOutlook (): FluentValidations {
    const outlookRegex = /^[a-z0-9](\.?[a-z0-9]){5,}@outlook\.com$/
    this.validations.set('isOutlook', outlookRegex.test(String(this.base)))
    return this
  }
}

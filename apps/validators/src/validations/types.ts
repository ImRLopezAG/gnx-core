export type FluentValidations = ValidationsOptions & {
  getValidations: () => Map<Validations, boolean>
  getErrors: () => string[]
  softValidation: () => SoftValidation
  hardValidation: () => void
  validate: () => boolean
}

export interface SoftValidation {
  isValid: boolean
  errors: string[]
  totalErrors: number
}

export type ValidationsOptions = BasicsValidation & NumbersValidation & StringsValidation

export type Validations = KeyOf<ValidationsOptions>

export type KeyOf<T> = {
  [K in keyof T]: T[K] extends any ? K : never
}[keyof T]

export interface Between {
  min: any
  max: any
}

export interface FluentValidationsOptions<T = any> {
  value: string | number | T
}

export interface GNXFluentValidatorErrorsConstructor {
  message: string
  errors: string[]
  count: number
}

interface BasicsValidation {
  isString: () => FluentValidations
  isBoolean: () => FluentValidations
  isArray: () => FluentValidations
  isObject: () => FluentValidations
  isFunction: () => FluentValidations
  isUndefined: () => FluentValidations
  isRequired: () => FluentValidations
}

interface NumbersValidation {
  isNumber: () => FluentValidations
  isEqualTo: ({ value }: FluentValidationsOptions) => FluentValidations
  isGreaterThan: ({ value }: FluentValidationsOptions) => FluentValidations
  isGreaterThanOrEqualTo: ({ value }: FluentValidationsOptions) => FluentValidations
  isLessThan: ({ value }: FluentValidationsOptions) => FluentValidations
  isLessThanOrEqualTo: ({ value }: FluentValidationsOptions) => FluentValidations
  isBetween: ({ min, max }: Between) => FluentValidations
  isMaxLength: ({ value }: FluentValidationsOptions) => FluentValidations
  isMinLength: ({ value }: FluentValidationsOptions) => FluentValidations
  isLengthBetween: ({ min, max }: Between) => FluentValidations
  isLengthEqual: ({ value }: FluentValidationsOptions) => FluentValidations
  isLengthGreaterThan: ({ value }: FluentValidationsOptions) => FluentValidations
  isLengthGreaterThanOrEqualTo: ({ value }: FluentValidationsOptions) => FluentValidations
  isLengthLessThan: ({ value }: FluentValidationsOptions) => FluentValidations
  isLengthLessThanOrEqualTo: ({ value }: FluentValidationsOptions) => FluentValidations
  isDivisibleBy: ({ value }: FluentValidationsOptions) => FluentValidations
  isPositive: () => FluentValidations
  isNegative: () => FluentValidations
}

interface StringsValidation {
  isEmail: () => FluentValidations
  isURL: () => FluentValidations
  isGmail: () => FluentValidations
  isOutlook: () => FluentValidations
  isDate: () => FluentValidations
  isDateAfter: ({ value }: FluentValidationsOptions) => FluentValidations
  isDateBefore: ({ value }: FluentValidationsOptions) => FluentValidations
  isDateBetween: ({ min, max }: Between) => FluentValidations
  isGuid: () => FluentValidations
  isHexColor: () => FluentValidations
  isHexadecimal: () => FluentValidations
  isIP: () => FluentValidations
  isIPv4: () => FluentValidations
  isIPv6: () => FluentValidations
  isJSON: () => FluentValidations
  isLowercase: () => FluentValidations
  isUppercase: () => FluentValidations
  isUUID: () => FluentValidations
  isCreditCard: () => FluentValidations
}

export interface ModelValidatorOptions<T = any> {
  identifier: string
  model: Record<string, any> | T
}
export type Start<T> = Omit<ModelValidatorOptions<T>, 'identifier'>
export type Identifier<T = any > = Omit<ModelValidatorOptions<T>, 'model'>
export interface ModelValidations<T = any> {
  withProperty: (callback: (obj: T, { identifier }?: Identifier) => boolean) => ModelValidations<T>
  validate: () => boolean
  getErrors: () => string[]
  getValidations: () => Map<string, (value: any) => boolean>
  softValidation: () => SoftValidation
  hardValidation: () => void
}

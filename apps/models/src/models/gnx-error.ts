import type { GNXError, GNXErrorTypes } from './types'

export class GNXErrorHandler extends Error {
  public errorType: GNXErrorTypes
  constructor ({ message, errorType }: GNXError) {
    super(message)
    this.errorType = errorType
  }
}

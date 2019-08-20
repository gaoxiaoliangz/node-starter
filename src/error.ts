export const ERROR_CODES = {
  UNAUTHORIZED: 1001,
  INVALID_TOKEN: 1002,
}

const isEnvDevelopment = process.env.NODE_ENV === 'development'

interface Exts {
  code?: number
  details?: any
  errors?: DefinedError[]
}

export class DefinedError extends Error {
  code?: number
  details?: any
  message: string
  errors?: DefinedError[]

  // error stack 会出现问题
  static clone(error: DefinedError | Error) {
    if (error instanceof DefinedError) {
      return new DefinedError(error.message, error)
    }
    return new Error(error.message)
  }

  static toObject(err: DefinedError | Error) {
    if (err instanceof DefinedError) {
      return err.toObject()
    }
    return {
      message: err.message,
      ...(isEnvDevelopment && { stack: err.stack }),
    }
  }

  constructor(msg: string, { code, details, errors }: Exts = {}) {
    super(msg)
    this.code = code
    this.details = details
    this.errors = errors
    // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, DefinedError.prototype)
  }

  getContent() {
    return this.message
  }

  toObject() {
    return {
      message: this.message,
      code: this.code,
      details: this.details,
      errors: this.errors,
      ...(isEnvDevelopment && { stack: this.stack }),
    }
  }
}

export class ValidationError extends DefinedError {
  constructor(msg: string, exts?: Exts) {
    super(msg, exts)
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

export class UnauthorizedError extends DefinedError {
  constructor(msg: string = 'Unauthorized', exts?: Exts) {
    super(msg, exts)
    this.code = ERROR_CODES.UNAUTHORIZED
    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }
}

export class NotFoundError extends DefinedError {
  constructor(msg: string, exts?: Exts) {
    super(msg, exts)
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

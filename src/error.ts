const isEnvDevelopment = process.env.NODE_ENV === 'development'

type Exts = {
  code?: number
  details?: any
  errors?: DefinedError[]
}

export const errorToPlainObject = (error: Error | DefinedError) => {
  if (error instanceof DefinedError) {
    return error.toPlainObject()
  }

  const errObj = {}
  Object.keys(error).forEach(key => {
    const val = error[key]
    errObj[key] = val
  })

  return {
    ...errObj,
    ...(isEnvDevelopment && { stack: error.stack }),
  }
}

// https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
// compilerOptions target 设置为 es2015 及以上可以规避问题
export class DefinedError extends Error {
  code?: number
  details?: any
  message: string

  constructor(msg: string, { code = 1000, details }: Exts = {}) {
    super(msg)
    this.code = code
    this.details = details
  }

  toPlainObject() {
    return {
      message: this.message,
      code: this.code,
      details: this.details,
      ...(isEnvDevelopment && { stack: this.stack }),
    }
  }
}

export class ValidationError extends DefinedError {}

export class UnauthorizedError extends DefinedError {}

export class NotFoundError extends DefinedError {}

export class RuntimeError extends DefinedError {}

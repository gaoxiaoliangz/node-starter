class CommonError extends Error {
  constructor(data: { statusCode: number; message: string }) {
    const defaultError = {
      statusCode: 400,
    }
    if (typeof data === 'object') {
      super(data.message)
      Object.assign(this, {
        ...defaultError,
        ...data,
      })
    } else {
      super(data)
      Object.assign(this, defaultError)
    }
  }
}

export { CommonError }

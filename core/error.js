class CommonError extends Error {
  /**
   * @param {object} data 
   * @param {number} data.statusCode
   * @param {string} data.message
   */
  constructor(data = {}) {
    const defaultError = {
      statusCode: 400
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

module.exports = {
  CommonError,
}

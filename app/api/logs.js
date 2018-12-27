const models = require('../models')
const { CommonError } = require('../error')

module.exports = {
  browse() {
    return {
      logs: models.Log.find(),
    }
  },
  read(options) {
    const logs = models.Log.find()
    const found = logs.find(log => log.id.toString() === options.log)
    if (!found) {
      throw new CommonError({
        statusCode: 404,
        message: 'Log not found!'
      })
    }
    return {
      logs: [found]
    }
  }
}

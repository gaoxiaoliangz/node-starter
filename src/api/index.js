const _ = require('lodash')
const logs = require('./logs')
const uploads = require('./uploads')

/**
 * ### HTTP
 *
 * Decorator for API functions which are called via an HTTP request. Takes the API method and wraps it so that it gets
 * data from the request and returns a sensible JSON response.
 *
 * @public
 * @param {Function} apiMethod API method to call
 * @return {Function} middleware format function to be called by the route when a matching request is made
 */
const http = (apiMethod) => {
  return function apiHandler(req, res, next) {
    // We define 2 properties for using as arguments in API calls:
    let object = req.body
    let options = _.extend({}, req.file, { ip: req.ip }, req.query, req.params, {
      context: {
        // @todo
        // user: ((req.user && req.user.id) || (req.user && models.User.isExternalUser(req.user.id))) ? req.user.id : null,
        client: (req.client && req.client.slug) ? req.client.slug : null,
        client_id: (req.client && req.client.id) ? req.client.id : null
      }
    })

    // If this is a GET, or a DELETE, req.body should be null, so we only have options (route and query params)
    // If this is a PUT, POST, or PATCH, req.body is an object
    if (_.isEmpty(object)) {
      object = options
      options = {}
    }

    try {
      return Promise.resolve(apiMethod(object, options))
        .then(response => {
          if (req.method === 'DELETE') {
            return res.status(204).end()
          }
          // Keep CSV header and formatting
          if (res.get('Content-Type') && res.get('Content-Type').indexOf('text/csv') === 0) {
            return res.status(200).send(response)
          }

          // CASE: api method response wants to handle the express response
          // example: serve files (stream)
          if (_.isFunction(response)) {
            return response(req, res, next)
          }

          // Send a properly formatting HTTP response containing the data with correct headers
          res.json(response || {})
        })
        .catch((error) => {
          // To be handled by the API middleware
          next(error)
        })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = {
  http,
  logs,
  uploads,
}

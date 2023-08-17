const wreck = require('wreck').defaults({
  timeout: 10000
})

function request (method, url, options) {
  return wreck[method](url, options)
    .then(response => {
      const res = response.res
      const payload = response.payload

      if (res.statusCode !== 200) {
        throw payload || new Error('Unknown error')
      }

      return payload
    })
}

function get (url, options) {
  return request('get', url, options)
}

function post (url, options) {
  return request('post', url, options)
}

function postJson (url, options) {
  options = options || {}
  options.json = true

  return post(url, options)
}

function getJson (url) {
  return get(url, { json: true })
}

module.exports = {
  get,
  post,
  getJson,
  postJson,
  request
}

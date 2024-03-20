'use strict'

const { HTTP_OK } = require('./constants')

const wreck = require('wreck').defaults({
  timeout: 10000
})

async function request (method, url, options) {
  let res, payload
  try {
    const response = await wreck[method](url, options)
    res = response.res
    payload = response.payload
  } catch (error) {
    if (error?.message?.startsWith('Response Error:')) {
      error.message += ` on ${method.toUpperCase()} ${url.replace(/\?.*$/, '')}`
    }
    throw error
  }
  if (res.statusCode !== HTTP_OK) {
    throw (payload || new Error('Unknown error'))
  }
  return payload
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

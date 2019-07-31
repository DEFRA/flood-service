module.exports = {
  replace: function replace (obj, name, fn) {
    // Store the original function
    const original = obj[name]

    // Override the function
    obj[name] = fn

    // Return a handy cleanup function
    return {
      revert: function () {
        obj[name] = original
      }
    }
  },
  makePromise: function makePromise (...args) {
    return function () {
      return args[0] ? Promise.reject(args[0]) : Promise.resolve(args[1])
    }
  }
}

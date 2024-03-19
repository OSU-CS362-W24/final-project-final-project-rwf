const JSDOMEnvironment = require('jest-environment-jsdom').default

class FixJSDomEnvironment extends JSDOMEnvironment {
  constructor(arg1, arg2) {
    super(arg1, arg2)

    this.global.URL = URL
    this.global.Blob = Blob
  }
}

module.exports = FixJSDomEnvironment
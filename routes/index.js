const logger = require('../logger')

module.exports = app => {
  require('./games')(app)
  require('./teams')(app)
  require('./round-scores')(app)
}

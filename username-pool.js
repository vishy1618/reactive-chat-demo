var _ = require('lodash')

const PREFIX = 'User'
var pool = []

module.exports = {
  allocate: function() {
    var maxPlusOne = pool.length ? _.max(pool)+1 : 1
    pool.push(maxPlusOne)

    return PREFIX + maxPlusOne
  },
  deallocate: function(username) {
    var toRemove = +username.split(PREFIX)[1]
    _.remove(pool, function(n) {return n==toRemove})
  }
}
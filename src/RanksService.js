'use strict'

// @ngInject
module.exports = function ($q, $timeout, User) {
  this.query = (users, query) => {
    var d = $q.defer()
    $timeout(function () {
      d.resolve('Result')
    }, 2000)
    return d.promise
  }

  this.initialize = function initialize () {
    var defer = $q.defer()

    User.query().$promise
    .then(function (users) {
      defer.resolve(users)
    })
    .catch(function (res) {
      defer.reject(res)
    })

    return defer.promise
  }
}

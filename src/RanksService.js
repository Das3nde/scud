'use strict'

var angular = require('angular')

// @ngInject
module.exports = function ($q, User) {
  this.ranks = {}

  function rankFilter (user) {
    return user.rank === rank
  }

  this.initialize = function initialize () {
    var defer = $q.defer()

    User.query().$promise
    .then(function (users) {
      /*
      let ranks = ['Yokozuna', 'Jonokuchi']

      ranks.forEach(function (rank) {
        console.log(users.filter(function (user) {
          return user.rank === rank
        }))
      })
     */

      defer.resolve(users)
    })
    .catch(function (res) {
      defer.reject(res)
    })

    return defer.promise
  }
}

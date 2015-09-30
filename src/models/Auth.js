'use strict'

// @ngInject
module.exports = function ($q, $timeout, $http, Session) {
  return {
    getUser: () => {
      if (Session.user) {
        return Session.user
      } else {
        var d = $q.defer()

        $http.get('/user')
        .success(function (user) {
          Session.create(user)
          d.resolve(user)
        })
        .error(function () {
          d.reject()
        })

        return d.promise
      }
    }
  }
}

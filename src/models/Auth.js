'use strict'

// @ngInject
module.exports = function () {
  var currentUser

  return {
    login: function () {},
    logout: function () {},
    isLoggedIn: function () {},
    currentUser: function () { return currentUser }
  }
}

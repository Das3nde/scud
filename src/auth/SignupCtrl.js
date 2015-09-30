'use strict'

// @ngInject
module.exports = function ($scope, $http, $state, $window, $timeout) {
  let vm = this

  vm.signup = () => {
    $http
    .post('/signup', {
      first_name: vm.first_name,
      last_name: vm.last_name,
      email: vm.email,
      password: vm.password
    })
    .success(function () {
      $window.alert('You should receive a confirmation email shortly!')
      $state.go('login')
    })
    .error(function (err) {
      vm.flash = err.message
      $timeout(() => {
        vm.flash = null
      }, 5000)
    })
  }
}

'use strict'

// @ngInject
module.exports = function ($scope, $http, $state, $timeout) {
  let vm = this

  vm.login = () => {
    $http
    .post('/login', {email: vm.email, password: vm.password})
    .success(res => {
      $state.go('home')
    })
    .error(err => {
      vm.flash = err.message
      $timeout(() => {
        vm.flash = null
      }, 5000)
    })
  }
}

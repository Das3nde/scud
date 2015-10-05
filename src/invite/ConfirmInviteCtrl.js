'use strict'

// @ngInject
module.exports = function ($http, $state, $stateParams, $window) {
  let vm = this

  vm.submit = () => {
    $http.post('/invite/confirm/', {id: $stateParams.id, password: vm.password})
    .success(function (data) {
      console.log(data)
      $state.go('home')
    })
    .error(function (err) {
      $window.alert(err.message)
    })
  }
}

'use strict'

// @ngInject
module.exports = function ($scope, $http, $window) {
  let vm = this

  vm.submit = () => {
    $http.post('/invite', {
      first_name: vm.first_name,
      last_name: vm.last_name,
      email: vm.email
    })
    .success(function (data) {
      $window.alert(data)
    })
    .error(function (err) {
      $window.alert(err.message)
    })
  }

}

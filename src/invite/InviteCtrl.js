'use strict'

// @ngInject
module.exports = function ($scope, $window) {
  let vm = this

  vm.submit = () => {
    $window.alert('test')
  }

}

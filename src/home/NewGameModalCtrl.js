'use strict'

// @ngInject
module.exports = function ($scope, $modalInstance, $http) {
  var vm = this

  vm.game = {
    winner: '',
    loser: '',
    victory_condition: 'SCUD',
    notes: ''
  }

  vm.submit = function () {
    $modalInstance.close(vm.game)
  }
}


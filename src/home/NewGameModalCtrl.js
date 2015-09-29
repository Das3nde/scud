'use strict'

// @ngInject
module.exports = function ($scope, $modalInstance, $http, users) {
  var vm = this

  vm.users = users

  vm.loserFilter = (value, index, arr) => {
    if (vm.game.loser._id) {
      return value._id !== vm.game.loser._id
    } else return true
  }

  vm.winnerFilter = (value, index, arr) => {
    if (vm.game.winner._id) {
      return value._id !== vm.game.winner._id
    } else return true
  }

  vm.game = {
    winner: '',
    loser: '',
    victory_condition: 'SCUD',
    advantaged: true,
    notes: ''
  }

  vm.submit = () => {
    $modalInstance.close(vm.game)
  }
}

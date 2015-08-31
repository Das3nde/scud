'use strict'

// @ngInject
module.exports = function ($scope, $modalInstance, stables) {
  this.stables = stables
  this.chosenStable = stables[0]
}


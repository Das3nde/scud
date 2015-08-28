'use strict'

var angular = require('angular')

function HomeCtrl ($scope) {
  $scope.test = "TEST"
}

angular.module('scud.controllers')
  .controller('HomeCtrl', HomeCtrl)

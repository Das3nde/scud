'use strict'

var angular = require('angular')

angular.module('SCUDApp')
  .controller('HomeCtrl', require('./HomeCtrl.js'))
  .controller('JoinStableModalCtrl', require('./JoinStableModalCtrl.js'))
  .directive('jkFilterRanks', require('./JKFilterRanks.js'))

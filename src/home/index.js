'use strict'

var angular = require('angular')

angular.module('SCUDApp')
  .controller('HomeCtrl', require('./HomeCtrl.js'))
  .controller('JoinStableModalCtrl', require('./JoinStableModalCtrl.js'))
  .controller('NewGameModalCtrl', require('./NewGameModalCtrl.js'))
  .directive('jkFilterRanks', require('./JKFilterRanks.js'))

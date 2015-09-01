'use strict'

var angular = require('angular')

angular.module('SCUDApp')
  .factory('Stable', require('./Stable.js'))
  .factory('User', require('./User.js'))

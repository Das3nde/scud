'use strict'

var angular = require('angular')

require('babelify/polyfill')
require('angular-ui-router')
require('angular-ui-bootstrap')

angular.module('SCUDApp', [
  'ngResource',
  'ui.router',
  'ui.bootstrap'
])

.config(['$logProvider', function ($logProvider) {
  $logProvider.debugEnabled(true)
}])

.config(['$locationProvider', function ($locationProvider) {
  $locationProvider.html5Mode({enabled: true, requireBase: true})
}])

.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/')

  $stateProvider
    .state('home', {
      url: '/',
      template: require('./home/templates/home.jade'),
      controller: 'HomeCtrl',
      controllerAs: 'home',
      resolve: {
        stables: function (Stable) {
          return Stable.query().$promise
        }
      }
    })
})

require('./home')
require('./models')

'use strict'

var angular = require('angular')
require('angular-ui-router')
require('./controllers')

var app = angular.module('SCUDApp', [
  'ui.router',
  'scud.controllers',
  'scud.templates'
])

app.config(['$logProvider', function ($logProvider) {
  $logProvider.debugEnabled(true)
}])

app.config(['$locationProvider', function ($locationProvider) {
  $locationProvider.html5Mode({enabled: true, requireBase: true})
}])

app.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/')

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl as home'
    })
})

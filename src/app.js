'use strict'

var angular = require('angular')

var app = angular.module('SCUDApp', [
])

app.config(['$logProvider', function ($logProvider) {
  $logProvider.debugEnabled(true)
}])

app.config(['$locationProvider', function ($locationProvider) {
  $locationProvider.html5Mode({enabled: true, requireBase: true})
}])

'use strict'

var angular = require('angular')

// Babelify for ES6 Syntax

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
      controllerAs: 'vm',
      resolve: {
        stables: function (Stable) {
          return Stable.query().$promise
        },
        games: function(Game) {
          return Game.query().$promise
        },
        /*
        users: function (User) {
          return User.query().$promise
        },
       */
        users: function (RanksService) {
          return RanksService.initialize()
        },
        currentUser: function ($q, $http) {
          var d = $q.defer()
          $http.get('/user').then(function (user) {
            d.resolve(user.data)
          })

          return d.promise
        }
      }
    })
    .state('login', {
      url: '/login',
      template: require('./auth/templates/login.jade'),
      controller: 'LoginCtrl',
      controllerAs: 'vm'
    })
    .state('signup', {
      url: '/signup',
      template: require('./auth/templates/signup.jade'),
      controller: 'LoginCtrl',
      controllerAs: 'vm'
    })
})

// Using $state directly causes a circular dependency error
// Must use $injector to get $state when using ui-router

.factory('authHttpResponseInterceptor', function ($q, $injector) {
  return {
    response: function (response) {
      if (response.status === 401) {
        console.log('401: Unauthorized')
      }
      return response || $q.when(response)
    },
    responseError: function (rejection) {
      if (rejection.status === 401) {
        $injector.get('$state').transitionTo('login')
        return $q.reject(rejection)
      }
    }
  }
})

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authHttpResponseInterceptor')
})

.service('RanksService', require('./RanksService'))

require('./home')
require('./auth')
require('./models')

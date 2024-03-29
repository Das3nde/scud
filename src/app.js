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
        games: function (Game) {
          return Game.query().$promise
        },
        users: function (User) {
          return User.query().$promise
        },
        currentUser: authorize
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
      controller: 'SignupCtrl',
      controllerAs: 'vm'
    })
    .state('ranks', {
      url: '/ranks',
      template: require('./ranks/ranks.jade')
    })
    .state('invite', {
      url: '/invite',
      template: '<ui-view></ui-view>'
    })
    .state('invite.new', {
      url: '/new',
      template: require('./invite/new.jade'),
      controller: 'NewInviteCtrl',
      controllerAs: 'vm'
    })
    .state('invite.confirm', {
      url: '/confirm/:id',
      template: require('./invite/confirm.jade'),
      controller: 'ConfirmInviteCtrl',
      controllerAs: 'vm'
    })
    .state('games', {
      url: '/games',
      template: require('./games/list.jade'),
      controller: 'GamesListCtrl',
      controllerAs: 'vm',
      resolve: {
        games: function (Game) {
          return Game.query().$promise
        }
      }
    })

  function authorize (Auth) {
    return Auth.getUser()
  }
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
      }
      return $q.reject(rejection)
    }
  }
})

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authHttpResponseInterceptor')
})

require('./home')
require('./auth')
require('./models')
require('./invite')
require('./games')

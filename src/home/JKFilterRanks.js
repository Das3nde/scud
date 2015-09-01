'use strict'

// @ngInject

module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      rank: '@',
      users: '='
    },
    template: require('./templates/jk-filter-ranks.jade'),
    link: function (scope, elem, attrs) {
      console.log(scope.users)
      scope.rankedUsers = scope.users.filter(function (user) {
        return user.rank === scope.rank
      })
    }
  }
}

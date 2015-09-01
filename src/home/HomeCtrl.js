'use strict'

// @ngInject
module.exports = function ($scope, $modal, stables, users, currentUser) {
  this.stables = stables
  this.users = users
  this.currentUser = currentUser

  this.filterRank = function (rank) {
    return this.users.filter(function (user) {
      return user.rank === rank
    })
  }

  this.joinStable = () => {
    let modalInstance = $modal.open({
      template: require('./templates/join_stable_modal.jade'),
      controller: 'JoinStableModalCtrl',
      controllerAs: 'modal',
      resolve: {
        stables: function () {
          return stables
        }
      }
    })

    modalInstance.result.then(function (selection) {
    }, function () {
      console.log('Modal dismissed at: ' + new Date())
    })
  }
}

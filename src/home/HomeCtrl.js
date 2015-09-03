'use strict'

// @ngInject
module.exports = function ($scope, $http, $modal, stables, users, currentUser, RanksService) {
  this.stables = stables
  $scope.users = users
  this.currentUser = currentUser

  /*
  RanksService
    .query(this.users, {test: 'Test'})
    .then(function (result) {
      $scope.users.pop()
      console.log(result, $scope.users)
    })
   */

  this.filterRank = function (rank) {
    return this.users.filter(function (user) {
      return user.rank === rank
    })
  }

  this.joinStable = () => {
    let modalInstance = $modal.open({
      template: require('./templates/join-stable-modal.jade'),
      controller: 'JoinStableModalCtrl',
      controllerAs: 'modal',
      resolve: {
        stables: function () {
          return stables
        }
      }
    })

    modalInstance.result.then(function (chosenStable) {
      console.log(chosenStable)
      $http.post('/join-stable', {stable: chosenStable._id})
        .success(function (err, res) {
          if (err) throw err
          console.log(res)
        })
    }, function () {
      console.log('Modal dismissed at: ' + new Date())
    })
  }
}

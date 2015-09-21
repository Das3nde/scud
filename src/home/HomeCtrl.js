'use strict'

// @ngInject
module.exports = function ($scope, $http, $modal, stables, users, currentUser, RanksService) {
  this.stables = stables
  $scope.users = users
  this.currentUser = currentUser

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
    })
  }

  this.newGame = () => {
    let modalInstance = $modal.open({
      template: require('./templates/new-game-modal.jade'),
      controller: 'NewGameModalCtrl',
      controllerAs: 'vm'
    })

    modalInstance.result.then(function () {
      // Submit game to back-end
    }, function () {
      console.log('Modal dismissed at: ' + new Date())
    })
  }
}

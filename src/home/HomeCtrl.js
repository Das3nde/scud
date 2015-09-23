'use strict'

// @ngInject
module.exports = function ($scope, $http, $modal, stables, users, currentUser, RanksService) {
  let vm = this
  vm.stables = stables
  vm.users = users
  vm.currentUser = currentUser

  vm.filterRank = function (rank) {
    return this.users.filter(function (user) {
      return user.rank === rank
    })
  }

  vm.joinStable = () => {
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

  vm.newGame = () => {
    let modalInstance = $modal.open({
      template: require('./templates/new-game-modal.jade'),
      controller: 'NewGameModalCtrl',
      controllerAs: 'vm'
    })

    modalInstance.result.then(function (game) {
      console.log(game.winner)
      // Submit game to back-end
    }, function () {
      console.log('Modal dismissed at: ' + new Date())
    })
  }
}

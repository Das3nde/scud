'use strict'

// @ngInject
module.exports = function ($scope, $http, $modal, $state, stables, users, games, currentUser, RanksService) {
  console.log(games)
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
      controllerAs: 'vm',
      resolve: {
        users: function () {
          return users
        }
      }
    })

    modalInstance.result.then(function (game) {
      game.winner = game.winner._id
      game.loser = game.loser._id

      $http.post('/api/games', {game: game})
      .success(function () {
        // @TODO Force refresh to update dom
        // $state.go('.', null, {reload: true})
      })
      .error(function (error) {
        alert(error.message)
      })
    }, function () {
      console.log('Modal dismissed at: ' + new Date())
    })
  }
}

'use strict'

// @ngInject
module.exports = function ($scope, $modal, stables, user) {
  this.user = user
  console.log(user)
  this.stables = stables
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

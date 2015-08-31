'use strict'

// @ngInject
module.exports = function ($scope, $modal, stables) {
  this.stables = stables

  this.joinStable = () => {
    let modalInstance = $modal.open({
      template: require('./templates/join_stable_modal.jade')
    })

    modalInstance.result.then(function (selection) {
    }, function () {
      console.log('Modal dismissed at: ' + new Date())
    })
  }
}

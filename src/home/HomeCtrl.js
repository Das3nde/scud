'use strict'

// @ngInject
module.exports = function ($scope, $modal) {
  this.joinStable = () => {
    $modal.open({
      template: require('./templates/join_stable_modal.jade')
    })
  }
}

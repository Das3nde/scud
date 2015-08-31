'use strict'

// @ngInject
module.exports = function ($scope, $modal) {
  $modal.open({
    template: require('./templates/join_stable_modal.jade')
  })
}

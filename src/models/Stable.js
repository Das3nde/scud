'use strict'

// @ngInject
module.exports = function ($resource, $cacheFactory) {
  let Stable = $resource('/api/stables/:id',
    {id: '@_id'},
    {
      query: {
        method: 'GET',
        isArray: true,
        cache: $cacheFactory('Stable')
      },
      update: {
        method: 'PUT'
      }
    })

  return Stable
}

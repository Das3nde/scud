'use strict'

// @ngInject
module.exports = function ($resource, $cacheFactory) {
  let User = $resource('/api/users/:id',
    {id: '@_id'},
    {
      query: {
        method: 'GET',
        isArray: true,
        cache: $cacheFactory('User')
      },
      update: {
        method: 'PUT'
      }
    })

  return User
}

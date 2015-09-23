'use strict'

// @ngInject
module.exports = function ($resource, $cacheFactory) {
  let Game = $resource('/api/games/:id',
    {id: '@_id'},
    {
      query: {
        method: 'GET',
        isArray: true,
        cache: $cacheFactory('Game')
      },
      update: {
        method: 'PUT'
      }
    })

  return Game
}

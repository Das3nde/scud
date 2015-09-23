var express = require('express')
var router = express.Router()

router.use('/users', require('./users'))
router.use('/stables', require('./stables'))
router.use('/games', require('./games'))

module.exports = router

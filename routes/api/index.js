var express = require('express')
var router = express.Router()

router.use('/users', require('./users'))
router.use('/stables', require('./stables'))

module.exports = router

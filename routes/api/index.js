var express = require('express')
var router = express.Router()

router.use('/competitors', require('./competitors'))

module.exports = router

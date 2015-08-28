var express = require('express')
var router = express.Router()

router.use('/api', require('./api'))

router.use(function(req, res) {
  res.render('index', {title: 'SCUD Registry'})
})

module.exports = router

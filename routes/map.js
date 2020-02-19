var db = require('./db/model')
var path = require('path')
var express = require('express')
var router = express.Router()

router.get('/', async (req, res) => {
    var data = req.body
    var session = req.session

    let mainMap = await db.mainInfo(session.userId, session.familyId)

    res.status(200)
    res.render('map', {mainInfo: mainMap.info})
})

module.exports = router
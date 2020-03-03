var db = require('./db/model/map')
var path = require('path')
var express = require('express')
var router = express.Router()

router.get('/', async (req, res) => {
    var data = req.body
    var session = req.session

    if(session.familyId === undefined || session.userId === undefined || session.username === undefined) {
        res.redirect('/auth')
    }

    let mainMap = await db.mainInfo(session.userId, session.familyId)
    let getCount = await db.countObjects(session.familyId)

    res.status(200)
    res.render('map', {mainInfo: mainMap.info, count: getCount.count})
})

router.get('/getPoints', async (req, res) => {
    var session = req.session

    let getPoints = await db.getPoints(session.familyId)

    if(getPoints.status) {
        res.json({code: 1, result: getPoints.result})
    } else {
        res.json({code: 2})
    }
})

router.post('/addNewObject', async (req, res) => {
    var data = req.body
    var session = req.session

    let newObject = await db.addNewObject(session.familyId, data.title, data.description, data.lat, data.lng, data.color)

    if(newObject) {
        res.json({code: 1})
    } else {
        res.json({code: 2})
    }

})

module.exports = router
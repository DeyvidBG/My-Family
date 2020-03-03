var express = require('express')
var router = express.Router()
var db = require('./db/model/garage')

router.get('/', async (req, res) => {
    var session = req.session

    if(session.familyId === undefined || session.userId === undefined || session.username === undefined) {
        res.redirect('/auth')
    }

    let autos = await db.getAutos(session.familyId)
    let count = await db.getAutosCount(session.familyId)
    let checkForGtp = await db.checkForGtp(session.familyId)

    res.status(200)
    res.render('garage', {autos: autos.result, count: count.result, gtp: checkForGtp.result})
})

router.post('/addNewCar', async (req, res) => {
    var session = req.session
    var data = req.body

    let addCar = await db.addCar(session.familyId, data.name, data.description, data.gtp, data.service)

    if(addCar.status) {
        res.json({code: 1})
    } else {
        res.json({code: 2, id: addCar.id})
    }

})

router.post('/deleteCar', async (req, res) => {
    var session = req.session
    var data = req.body

    let deleteCar = await db.deleteCar(session.familyId, data.id)

    if(deleteCar) {
        res.json({code: 1})
    } else {
        res.json({code: 2})
    }

})

router.post('/setNewGtp', async (req, res) => {
    var session = req.session
    var data = req.body

    let setNewGtp = await db.setNewGtp(session.familyId, data.id, data.newDate)

    if(setNewGtp) {
        res.json({code: 1})
    } else {
        res.json({code: 2})
    }

})

module.exports = router
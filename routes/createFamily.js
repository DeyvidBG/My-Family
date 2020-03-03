var db = require('./db/model')
var path = require('path')
var express = require('express')
var router = express.Router()

router.get('/', (req, res) => {
    var session = req.session

    if(session.familyId === undefined || session.userId === undefined || session.username === undefined) {
        res.redirect('/auth')
    }

    res.sendFile(path.join(__dirname, '../public/createFamily.html'))
})

router.post('/create', async (req, res) => {
    var session = req.session
    var data = req.body

    if(await db.createFamily(data.name, session.userId)) {
        res.json({code: 1})
    } else {
        res.json({code: 2})
    }
})

router.post('/accessFamily', async (req, res) => {
    var session = req.session
    var data = req.body 

    var result =  await db.joinFamily(data.number, session.userId)

    if(result.status) {
        session.familyId = result.familyId
        session.save()
        res.json({code: 1})
    } else {
        res.json({code: 2})
    }
})



module.exports = router

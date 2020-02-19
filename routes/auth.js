var db = require('./db/model')
var path = require('path')
var express = require('express')
var router = express.Router()

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/auth.html'))
})

router.post('/', async (req, res) => {
    var data = req.body

    var signIn = await db.signIn(data.email, data.pass)

    if(signIn.successful && signIn.familyId !== 0) {
        // Return successful login
        req.session.userId = signIn.userId 
        req.session.familyId = signIn.familyId
        req.session.username = signIn.username
        req.session.save()
        res.json({code: 1})
    } else if(signIn.successful && signIn.familyId === 0) {
        // Return successful login but no family member
        req.session.userId = signIn.userId
        req.session.username = signIn.username
        req.session.save()
        res.json({code: 2})
    } else {
        // Return unsuccessful login
        res.json({code: 3})
    }
})

module.exports = router
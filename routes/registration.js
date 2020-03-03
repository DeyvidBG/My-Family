var db = require('./db/model')
var security = require('./scripts/security')
var dateConverter = require('./scripts/dateConverter')
var path = require('path')
var express= require('express')
var router = express.Router()

router.get('/', (req, res) => {
    var session = req.session

    if(session.familyId === undefined || session.userId === undefined || session.username === undefined) {
        res.redirect('/auth')
    }

    res.sendFile(path.join(__dirname, '../public/registration.html'))
    console.log(req.session.allowed)
})

router.post('/', async (req, res) => {

    var data = req.body

    if(security.passwordValidator(data.pass) && security.dateValidator(data.bday) && security.emailValidator(data.email)) {

        if(await db.checkForExistingAccount(data.email)) {

            // Inserting info in DB
            if(await db.registration(data.name, data.email, data.bday, data.phone, data.pass)) {
                res.json({code: 1})
            } else {
                res.json({code: 2})
            }


        } else {

            res.json({code: 3})
            
        }

    } else {

        res.json({code: 0})  

    }
})

module.exports = router
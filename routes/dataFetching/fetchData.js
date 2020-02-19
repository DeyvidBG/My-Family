var db = require('../db/model')
var express = require('express')
var router = express.Router()

router.get('/dashboard', async (req, res) => {
    var session = req.session

    // Retrieving data from DB
    let user = await db.getUserInfoForDashboard(session.userId, session.familyId)
    res.json({name: user.Name})

})

router.get('')

module.exports = router
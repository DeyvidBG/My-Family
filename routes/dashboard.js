var db = require('./db/model')
var path = require('path')
var express = require('express')
var router = express.Router()

router.get('/', async (req, res) => {
    var session = req.session

    if(session.familyId === undefined || session.userId === undefined || session.username === undefined) {
        res.redirect('/auth')
    }

    res.status(200)
    res.sendFile(path.join(__dirname, '../public/dashboard.html'))
    
})

router.get('/user', async (req, res) => {
    
    var session = req.session

    // Retrieving data from DB
    let user = await db.getUserInfo(session.userId, session.familyId)
    let stats = await db.getStats(session.userId, session.familyId)
    let familyMembers = await db.getFamilyMembers(session.userId, session.familyId)
    // let randomNumber = await db.createRandomInvitationCode(session.familyId, 527451)

    res.json({name: user.Name, stats: stats.data, familyMembers: familyMembers.members})

})

router.get('/events', async (req, res) => {
    var session = req.session

    // Retrieving data from DB
    let events = await db.displayEvents(session.familyId)

    if(events.status) {
        res.json({error: false, events: events.results})
    } else {
        res.json({error: true})
    }
})

router.post('/addTask', async (req, res) => {
    var data = req.body
    var session = req.session

    var addTask = await db.addNewTask(session.familyId, session.userId, data.title, data.description, data.date, data.type)

    if(addTask.status) {
        res.json({status: true, taskId: addTask.id})
    } else {
        res.json({status: false})
    }
})

router.post('/setRepetition', (req, res) => {
    var data = req.body

    db.setRepetition(data.taskId, data.newDate)
    res.json({status: true})
})

router.post('/newMember', async (req, res) => {
    var data = req.body
    var session = req.session

    if(await db.createRandomInvitationCode(session.familyId)) {
        res.json({status: true})
    } else {
        res.json({status: false})
    }
})

router.post('/deleteTask', (req, res) => {
    var data = req.body
    db.deleteTask(data.taskId)
    res.json({status: true})
})

module.exports = router

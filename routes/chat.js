var db = require('./db/model')
var path = require('path')
var express = require('express')
var router = express.Router()

router.get('/', async (req, res) => {
    var data = req.body
    var session = req.session

    let user = await db.getUserInfo(session.userId, session.familyId)
    let mainChatInfo = await db.mainInfo(session.userId, session.familyId)
    let getFamilyMembers = await db.getFamilyMembers(session.userId, session.familyId)
    let previousMessages = await db.getMessages(session.familyId)

    res.status(200)
    res.render('chat', {user: user.Name, chatInfo: mainChatInfo.info, members: getFamilyMembers.members, messages: previousMessages.messages})
})

module.exports = router
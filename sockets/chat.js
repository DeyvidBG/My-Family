var socketio = require('socket.io')
var db = require('../routes/db/model')

module.exports.listen = (app) => {
    io = socketio.listen(app)

    chat = io.of('/chat')
    chat.on('connection', (socket) => {
        var session = socket.request.session
        socket.on('joinRoom', () => {
            socket.join(session.familyId)
            socket.in(session.familyId).emit('memberJoined', {memberName: session.username})
        })
        socket.on('startWriting', () => {
            socket.in(session.familyId).emit('writing', {memberName: session.username})
        })

        socket.on('sendMessage', (data) => {
            chat.in(session.familyId).emit('newMessage', {memberName: session.username, message: data.message})
            socket.in(session.familyId).emit('cancelWriting', {memberName: session.username})
            db.newMessage(session.familyId, session.userId, data.message, new Date().toISOString().slice(0, 19).replace('T', ' '))
        })

        socket.on('cancelWriting', () => {
            socket.in(session.familyId).emit('cancelWriting', {memberName: session.username})
        })

        socket.on('disconnect', () => {
            socket.in(session.familyId).emit('leftChat', {memberName: session.username})
        })
        
    })

    return io
}
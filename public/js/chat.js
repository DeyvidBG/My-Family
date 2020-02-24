window.addEventListener('load', () => {

    scrollToBottom()

    // socket's configuration and setting up some events
    var socket = io('http://localhost:3000/chat')

    // set the client to listen to given room
    socket.emit('joinRoom')

    // looking for somebody who have joined the room
    socket.on('memberJoined', (data) => {
        joiningHtml(data.memberName)
        scrollToBottom()
    })

    // Send event to the server that someone is writing
    $('#message').on('focus', () => {
        socket.emit('startWriting')
    })
    
    // Send event to the server that someone is writing no longer
    $('#message').on('focusout', () => {
        socket.emit('cancelWriting')
    })

    // Send event to the server that there is new message
    $('#sendMessage').on('submit', (e) => {
        e.preventDefault()
        socket.emit('sendMessage', {message: $('#message').val()})
        $('#message').val('')
    })

    // Receiving info that there is new message
    socket.on('newMessage', (data) => {
        var date = new Date()
        messageHtml(data.memberName, data.message, dateObjects.fullDate(date), dateObjects.fullHour(date))
        scrollToBottom()
    })

    // Receiving info that somebody stopped writing
    socket.on('cancelWriting', (data) => {
        $(`.messageBox[data-writer="${data.memberName}"]`).remove()
        scrollToBottom()
    })

    // Receiving info that somebody is writing
    socket.on('writing', (data) => {
        writingHtml(data.memberName)
        scrollToBottom()
    })

    // Listening for clients who have disconnected
    socket.on('leftChat', (data) => {
        leavingChat(data.memberName)
        scrollToBottom()
    })

})

var memberHtml = (name) => {
    var htmlCode = `<div class="member">
                        <img src="./assets/profile.svg" alt="profile picture" class="profilePicture" draggable="false">
                        <h4>${name}</h4>
                    </div>`
    $('.membersOfChat').append(htmlCode)
}

var joiningHtml = (name) => {
    var htmlCode = `<div class="messageBox">
                        <img src="./assets/profile.svg" alt="profile picture" class="profilePicture" draggable="false">
                        <div class="message">${name} се присъедини към чата!</div>
                    </div>`
    $('.placeForMessages').append(htmlCode)
}

var messageHtml = (name, message, date, hour) => {
    var htmlCode = `<div class="messageBox">
                        <img src="./assets/profile.svg" alt="profile picture" class="profilePicture" draggable="false">
                        <div class="message">${name} написа на ${date} в ${hour} :<br>${message}</div>
                    </div>`
    $('.placeForMessages').append(htmlCode)
}

var writingHtml = (name) => {
    var htmlCode = `<div class="messageBox" data-writer="${name}">
                        <img src="./assets/profile.svg" alt="profile picture" class="profilePicture" draggable="false">
                        <div class="message">${name} пише в момента...</div>
                    </div>`
    $('.placeForMessages').append(htmlCode)
}

var leavingChat = (name) => {
    var htmlCode = `<div class="messageBox">
                        <img src="./assets/profile.svg" alt="profile picture" class="profilePicture" draggable="false">
                        <div class="message">${name} напусна чата!</div>
                    </div>`
    $('.placeForMessages').append(htmlCode)
}

var scrollToBottom = () => {
    var height = 0
    $('.placeForMessages .messageBox').each(function(i, value){
        height += parseInt($(this).height());
    })
    
    height += ''
    
    $('.chatBox').animate({scrollTop: height});
}
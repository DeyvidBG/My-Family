var path = require('path')
var bodyParser = require('body-parser')
var cron = require('node-cron')
var db = require('./routes/db/model')
var express = require('express')
var helmet = require('helmet')
var app = require('express')()
var server = require('http').Server(app)
var io = require('./sockets/chat').listen(server)

// Prevent common attacks
app.use(helmet())

// set the view engine to ejs
app.set('view engine', 'ejs')
// set ejs files public directory
app.set('views', path.join(__dirname, '/public'))

// Set some cron-jobs
cron.schedule('49 19 * * *', () => {
    db.updateEventStatusTo1()
    db.updateEventStatusTo2()
    db.deleteFinishedEvents()
    db.deleteExpiredInvitations()
}, 
{
    scheduled: true,
    timezone: 'Europe/Sofia'
})

var connection = require('./routes/db/conn')
var session = require('express-session')
var MySQLStore = require('express-mysql-session')(session)

var options = {
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'session_expire',
            data: 'session_data'
        }
    }
}

var sessionStore = new MySQLStore(options, connection)

var sess = {
    key: 'security is important',
    secret: 'security is not a secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}

var sessionMiddleWare = session(sess)

if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
}

// Use shared session middleware for socket.io
io.use((socket, next) => {
    sessionMiddleWare(socket.request, socket.request.res, next);
})

// Use express-session middleware for express
app.use(sessionMiddleWare)

// requiring routers
var registration = require('./routes/registration')
var auth = require('./routes/auth')
var dashboard = require('./routes/dashboard')
var createFamily = require('./routes/createFamily')
var chat = require('./routes/chat')
var map = require('./routes/map')
var gallery = require('./routes/gallery')
var garage = require('./routes/garage')
var logout = require('./routes/logout')

const PORT = process.env.PORT || 3000

// for parsing application/json
app.use(bodyParser.json())
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }))
//form-urlencoded

app.get('/', (req, res) => {
    if(req.session.userId) {
        res.redirect('/dashboard')
    } else {
        res.status(200)
        res.sendFile(path.join(__dirname, 'public/index.html'))
    }
})

// handle all requests sent to '/registration'
app.use('/registration', registration)

// handle all requests sent to '/auth'
app.use('/auth', auth)

// handle all requests sent to '/createFamily'
app.use('/createFamily', createFamily)

// handle all requests sent to '/dashboard'
app.use('/dashboard', dashboard)

// handle all requests sent to '/chat'
app.use('/chat', chat)

// handle all requests sent to '/map'
app.use('/map', map)

// handle all requests sent to '/gallery'
app.use('/gallery', gallery)

// handle all requests sent to '/garage'
app.use('/garage', garage)

//handle all requests sent to '/logout'
app.use('/logout', logout)

// serving static files such as .css, .js, .jpg, .png
app.use(express.static(path.join(__dirname, 'public')))

// handle 404
app.get('*', function(req, res){
    res.status(404).render('404')
})

server.listen(PORT)
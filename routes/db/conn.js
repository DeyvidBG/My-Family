var mysql = require('mysql')

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    dateStrings: true,
    database: 'familyapp',
    timezone: 'Europe/Sofia',
})

conn.connect(err => {
    if(err) {
        console.log(err.message)
    } 

    console.log('A connection was established!')
    
})

module.exports = conn
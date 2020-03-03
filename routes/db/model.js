var bcrypt = require('bcryptjs')
var conn = require('./conn')
var randomNumber = require('../scripts/randomNumber')


// Property for hashing
var salt = bcrypt.genSaltSync(10)

var db = {}

db.registration = (name, email, bday, phone, pass) => {
    return new Promise((resolve, reject) => {

        // Hashing the password
        var hash = bcrypt.hashSync(pass, salt)

        conn.query('INSERT INTO users(Name, Email, dateOfJoining, Family, Birthday, PhoneNumber, Password) VALUES(?, ?, DATE(NOW()), 0, ?, ?, ?)',
        [name, email, bday, phone, hash], (err) => {
            if(err) {
                resolve(false)
            } else {
                reject(true)
            }
        })
    })
    .then((message) => {
        return message
    })
    .catch((message) => {
        return message
    })
}

db.checkForExistingAccount = (email) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT COUNT(Email) AS count FROM users WHERE Email = ?', [email], (err, rows) => {
            if(err) console.log(err.message)

            if(rows[0].count > 0) {
                resolve(false)
            } else {
                reject(true)
            }
        })
    })
    .then((message) => {
        return message
    })
    .catch((message) => {
        return message
    })
}

db.signIn = (email, pass) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM users WHERE Email = ?', [email], (err, result, fields) => {
            if(err) console.log(err.message)

            if(result.length > 0) {
                // Checking for right password
                if(bcrypt.compareSync(pass, result[0].Password)) {
                    resolve({successful: true, userId: result[0].UserId, familyId: result[0].Family, username: result[0].Name})
                } else {
                    reject({successful: false})
                }
            } else {
                reject({successful: false})
            }

        })
    })
    .then((message) => {
        return message
    })
    .catch((message) => {
        return message
    })
}

db.createFamily = (name, userId) => {
    return new Promise((resolve, reject) => {
        // Creating a new family
        conn.query('INSERT INTO families (familyName, members) VALUES (?, ?)', [name, 1], (err, result) => {
            if(err) console.log(err.message)
            var familyId = result.insertId
            // Updating user's relation
            conn.query('UPDATE users SET Family = ? WHERE UserId = ?', [familyId, userId], (err, result) => {
                if(err) console.log(err.message)
                resolve(true)
            })
        })
    })
    .then((message) => {
        return message
    })
}

db.joinFamily = (accessCode, userId) => {
    return new Promise((resolve, reject) => {
        // Checking the database for the code
        conn.query('SELECT * FROM invitations WHERE invitationCode = ?', [accessCode], (err, result) => {
            if(err) console.log(err.message)
            if(result.length > 0) {
                var familyId = result[0].familyId
                conn.query('UPDATE users SET Family = ? WHERE UserId = ?', [familyId, userId], (err, result) => {
                    if(err) {
                        reject({status: false})
                    } else {
                        conn.query('UPDATE families SET members = members + 1 WHERE id = ?', [familyId], (err, result) => {
                            if(err) {
                                reject({status: false})
                            } else {
                                resolve({status: true, familyId: familyId})
                            }
                        })
                    }
                })
            } else {
                reject({status: false})
            }
        })
    })
    .then((message) => {
        return message
    })
    .catch((message) => {
        return message
    })
}

db.getUserInfo = (userId, familyId) => {
    return new Promise((resolve, reject) => {
        // Retrieving client's data
        conn.query('SELECT * FROM users WHERE UserId = ?', [userId], (err, result, fields) => {
            if(err) {console.log(err.message)}
            resolve(result[0])
        })
    })
    .then((message) => {
        return(message)
    })
}

db.addNewTask = (familyId, userId, title, description, startdate, kind) => {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO calendar (familyId, addedBy, title, description, startdate, kind, status) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [familyId, userId, title, description, startdate, kind, 4], (err, result) => {
            if(err) {
                console.log(JSON.stringify(err))
                reject({status: false})
            } else {
                resolve({status: true, id: result.insertId})
            }
        })
    })
    .then((message) => {
        return message
    })
    .catch((message) => {
        return message
    })
}

db.setRepetition = (taskId, newDate) => {
    conn.query('UPDATE calendar SET startdate = ? WHERE id = ?', [newDate, taskId], (err, result) => {
        if(err) console.log(err)
    })
}

db.displayEvents = (familyId) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT calendar.id, calendar.title, users.Name, calendar.description, DATE(calendar.startdate) AS date, calendar.kind, calendar.status FROM calendar INNER JOIN users ON calendar.addedBy = users.UserId WHERE calendar.familyId = ? ORDER BY startdate ASC', [familyId], (err, result, fields) => {
            if(err) {
                reject({status: false})
            } else {
                resolve({status: true, results: result})
            }
        })
    })
    .then((message) => {
        return message
    })
    .catch((message) => {
        return message
    })
}

db.getStats = (userId, familyId) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT calendarstatus.statusType AS "key", COUNT(calendar.id) AS value FROM calendar INNER JOIN calendarstatus ON calendar.status = calendarstatus.id WHERE calendar.familyId = ? GROUP BY calendarstatus.statusType', [familyId], (err, result) => {
            if(err) {
                console.log(JSON.stringify(err))
                reject({status: false})
            } else {
                resolve({status: true, data: result})
            }
        })
    })
    .then((message) => {
        return message
    })
    .catch((message) => {
        return message
    })
}

// Update events for today as in progress
db.updateEventStatusTo1 = () => {
    conn.query('UPDATE calendar SET status = 1 WHERE DATE(startdate) = DATE(NOW())', (err, result) => {
        if(err) console.log(err.message)
    })
}

// Update unfinished events for yesterdat as off sheduled
db.updateEventStatusTo2 = () => {
    conn.query('UPDATE calendar SET status = 2 WHERE DATE(startdate) = DATE(SUBDATE(NOW(), INTERVAL 1 DAY)) AND status = 1', (err, result) => {
        if(err) console.log(err.message)
    })
}

// Delete finished events which are older (>=) than 1 week
db.deleteFinishedEvents = () => {
    conn.query('DELETE FROM calendar WHERE DATE(startdate) = DATE(SUBDATE(NOW(), INTERVAL 7 DAY)) AND status = 3', (err, result) => {
        if(err) console.log(err.message)
    })
}


// Get family members
db.getFamilyMembers = (userId, familyId) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT Name, DATE_FORMAT(DATE(dateOfJoining), "%d/%m/%Y") AS date FROM users WHERE Family = ?', [familyId, userId], (err, result) => {
            if(err) {
                reject({status: false})
            } else {
                resolve({status: true, members: result})
            }
        })
    })
    .then((message) => {
        return message
    })
    .catch((message) => {
        return message
    })
} 

db.createRandomInvitationCode = (familyId) => {
    return new Promise((resolve, reject) => {
        var invitationCode = randomNumber.sixdigits()
        conn.query('SELECT * FROM invitations WHERE invitationCode = ?', [invitationCode], (err, result) => {
            if(err) console.log(err.message)
            if(result.length === 0) {
                conn.query('INSERT INTO invitations(familyId, invitationCode, validFor) VALUES(?, ?, DATE(NOW()))', [familyId, invitationCode], (err, result) => {
                    if(err) {
                        reject({status: false})
                    } else {
                        resolve({status: true})
                    }
                })
            } else {
                db.createRandomInvitationCode(familyId)
            }
        })
    })
    .then((message) => {
        return message
    })
    .catch((message) => {
        return message
    })
}

db.deleteExpiredInvitations = () => {
    conn.query('DELETE FROM invitations WHERE DATE(validFor) = DATE(SUBDATE(NOW(), INTERVAL 1 DAY))', (err, result) => {
        if(err) console.log(err.message)
    })
}

db.deleteTask = (taskId) => {
    conn.query('DELETE FROM calendar WHERE id = ?', [taskId], (err, result) => {
        if(err) console.log(err.message)
    })
}

db.mainInfo = (userId, familyId) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM families WHERE id = ?', [familyId], (err, result) => {
            if(err) {
                reject({status: false})
            } else {
                resolve({status: true, info: result})
            }

        })
    })
    .then((message) => {
        return message
    })
    .catch((message) => {
        return message
    })
}

db.newMessage = (familyId, userId, message, senddate) => {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO message (familyId, userId, text, senddate) VALUES (?, ?, ?, ?)', [familyId, userId, message, senddate], (err, result) => {
            if(err) {
                reject(false)
            } else {
                resolve(true)
            } 
        })
    })
    .then((message) => {
        return message
    })
    .catch((message) => {
        return message
    })
}

// Get previous messages
db.getMessages = (familyId) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT users.Name AS username, message.text AS message, DATE_FORMAT(DATE(senddate), "%d/%m/%Y") AS "date", HOUR(message.senddate) AS hour, MINUTE(message.senddate) AS minute FROM message INNER JOIN users ON message.userId = users.UserId WHERE familyId = ?', [familyId], (err, result) => {
            if(err) {
                reject({status: false})
            } else {
                resolve({status: true, messages: result})
            }
        })
    })
    .then((message) => {
        return message
    })
    .catch((message) => {
        return message
    })
}

module.exports = db

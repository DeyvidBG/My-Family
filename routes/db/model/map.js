var conn = require('../conn')

var db = {}

db.countObjects = (familyId) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT COUNT(*) AS count FROM objects WHERE familyId = ?', [familyId], (err, result) => {
            if(err) {
                reject({status: false})
            } else {
                resolve({status: true, count: result[0]})
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

db.addNewObject = (familyId, title, description, lat, lng, color) => {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO objects(familyId, title, description, lat, lng, color) VALUES(?, ?, ?, ?, ?, ?)', [familyId, title, description, lat, lng, color], (err, result) => {
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

db.getPoints = (familyId) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM objects WHERE familyId = ?', [familyId], (err, result) => {
            if(err) {
                reject({status: false})
            } else {
                resolve({status: true, result: result})
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
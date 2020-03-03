var conn = require('../conn')

var db = {}

db.getAutos = (familyId) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT id, name, description, DATE_FORMAT(DATE(gtp), "%d/%m/%Y") AS "gtp", DATE_FORMAT(DATE(service), "%d/%m/%Y") AS "service" FROM cars WHERE familyId = ?', [familyId], (err, result) => {
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

db.getAutosCount = (familyId) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT COUNT(*) AS count FROM cars WHERE familyId = ?', [familyId], (err, result) => {
            if(err) {
                reject({status: false})
            } else {
                resolve({status: true, result: result[0].count})
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

db.addCar = (familyId, name, description, gtp, service) => {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO cars(familyId, name, description, gtp, service) VALUES(?, ?, ?, ?, ?)', [familyId, name, description, gtp, service], (err, result) => {
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

db.deleteCar = (familyId, id) => {
    return new Promise((resolve, reject) => {
        conn.query('DELETE FROM cars WHERE familyId = ? AND id = ?', [familyId, id], (err, result) => {
            if(err) {
                console.log(err.message)
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

db.checkForGtp = (familyId) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM cars WHERE familyId = ? AND gtp = DATE(NOW())', [familyId], (err, result) => {
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

db.setNewGtp = (familyId, id, newDate) => {
    return new Promise((resolve, reject) => {
        conn.query('UPDATE cars SET gtp = ? WHERE familyId = ? AND id = ?', [newDate, familyId, id], (err, result) => {
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

module.exports = db
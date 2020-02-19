var conn = require('../conn')

var gallery = {}

// Get all created albums
gallery.getAlbums = (familyId) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM gallery_albums WHERE familyId = ?', [familyId], (err, result) => {
            if(err) {
                reject({status: false})
            } else {
                resolve({status: true, albums: result})
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

// Add new album
gallery.addNewAlbum = (familyId, userId, title, description) => {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO gallery_albums(familyId, createdBy, title, description, createdOn) VALUES(?, ?, ?, ?, NOW())', [familyId, userId, title, description], (err, result) => {
            if(err) {
                console.log(err.message)
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

// Get all photos from an album
gallery.getPhotos = (familyId, albumId) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM gallery_photos WHERE familyId = ? AND album_id = ?', [familyId, albumId], (err, result) => {
            if(err) {
                reject({status: false})
            } else {
                resolve({status: true, photos: result})
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

// Add new photo
gallery.addNewPhoto = (familyId, album_id, photo_link) => {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO gallery_photos(familyId, album_id, dateOfUploading, photo_link) VALUES(?, ?, NOW(), ?)', [familyId, album_id, photo_link], (err, result) => {
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

// Delete photo from DB and get photo_link 
gallery.deletePhoto = (photo_id, familyId) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT photo_link FROM gallery_photos WHERE photo_id = ? AND familyId = ?', [photo_id, familyId], (err, result) => {
            if(err) {
                reject({status: false})
            } else {
                var photo_link = result[0].photo_link
                conn.query('DELETE FROM gallery_photos WHERE photo_id = ? AND familyId = ?', [photo_id, familyId], (err, result) => {
                    if(err) {
                        reject({status: false})
                    } else {
                        resolve({status: true, photo_link: photo_link})
                    }
                })
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

module.exports = gallery
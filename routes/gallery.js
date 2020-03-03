var gallery = require('./db/model/gallery')
var path = require('path')
var fs = require('fs')
var express = require('express')
var multer = require('multer')
var router = express.Router()

// Set storage engine
var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, '../public/upload'))
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

// Init multer
var upload = multer({ storage: storage, 
                    limits: {fileSize: 2000000},
                    fileFilter: (req, file, callback) => {
                        checkFileType(file, callback)
                    }
                }).single('myFile')

// Check file type
var checkFileType = (file, callback) => {
    // Allowed ext
    const fileTypes = /jpeg|jpg|png|gif/
    // Check ext
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
    // Check mime
    const mimeType = fileTypes.test(file.mimetype)

    if(extname && mimeType) {
        callback(null, true)
    } else {
        callback('Имате право да качвате само снимки, които са по-малки от 2mb!')
    }
}

router.get('/', async (req, res) => {
    var session = req.session

    if(session.familyId === undefined || session.userId === undefined || session.username === undefined) {
        res.redirect('/auth')
    }

    let albums = await gallery.getAlbums(session.familyId)

    res.status(200)
    res.render('gallery', {albums: albums.albums})
})

router.get('/:albumId', async (req, res) => {
    var session = req.session
    var params = req.params

    session.albumId = params.albumId
    session.save()

    let photosInAlbum = await gallery.getPhotos(session.familyId, params.albumId)

    res.status(200)
    res.render('album', {photos: photosInAlbum.photos})
})

router.post('/upload', (req, res) => {
    var session = req.session
    upload(req, res, async (err) => {
        if(err) {
            res.render('upload', {
                msg: err,
                albumId: session.albumId
            })
        } else {

            if(await gallery.addNewPhoto(session.familyId, session.albumId, req.file.filename)) {
                res.render('upload', {
                    msg: 'Вашата снимка беше качена успешно!',
                    albumId: session.albumId
                })
            } else {
                res.render('upload', {
                    msg: 'Възникна проблем с качването на снимката Ви!',
                    albumId: session.albumId
                })
            }
        }
    })
})

router.post('/addAlbum', async (req, res) => {
    var data = req.body
    var session = req.session

    let addAlbum = await gallery.addNewAlbum(session.familyId, session.userId, data.title, data.description)

    // Adding new Album to our gallery
    if(addAlbum.status){
        res.json({code: 1, id: addAlbum.id})
    } else {
        res.json({code: 2})
    }
})

// Delete photo
router.post('/deletePhoto', async (req, res) => {
    var data = req.body
    var session = req.session

    let delPhoto = await gallery.deletePhoto(data.photoId, session.familyId)

    if(delPhoto.status) {
        fs.unlink(path.join(__dirname, `../public/upload/${delPhoto.photo_link}`), (err) => {
            if (err) {
                console.log(JSON.stringify(err))
            } else {
                res.json({code: 1})
            }
        })
    }
})

module.exports = router
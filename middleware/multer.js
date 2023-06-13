const multer = require('multer')
const path = require('path')
const cloudinary = require('./cloudinary')
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "images",
    },
})

module.exports = multer({ storage: storage });
const express = require('express');
const multer = require('multer');
const { registerCtrl, loginCtrl, logoutCtrl, userDetailsCtrl, profileCtrl, uploadProfilePhotoCtrl, uploadCoverPhotoCtrl, updatePasswordCtrl, updateUserCtrl } = require('../../controllers/users/users');
const protected = require('../../middlewares/protected.js');
const storage = require('../../config/cloudinary');
const userRoutes = express.Router();

//instance of multer
const upload = multer({
    storage,
})

//rendering forms
userRoutes.get('/login', (req, res) => {
    res.render('users/login', {
        error: '',
    });
})

userRoutes.get('/register', (req, res) => {
    res.render('users/register', {
        error: '',
    });
})

userRoutes.get('/upload-profile-photo-form', (req, res) => {
    res.render('users/uploadProfilePhoto', {
        error:'',
    });
})

userRoutes.get('/upload-cover-photo-form', (req, res) => {
    res.render('users/uploadCoverPhoto', {
        error:'',
    });
})

userRoutes.get('/update-user-password', (req, res) => {
    res.render('users/updatePassword', {
        error: '',
    });
})


//POST/api/v1/users/register
userRoutes.post('/register', registerCtrl);

//POST/api/v1/users/login
userRoutes.post('/login', loginCtrl);

//GET/api/v1/users/logout
userRoutes.get('/logout', logoutCtrl);

//GET/api/v1/users/profile
userRoutes.get('/profile-page', protected, profileCtrl);

//PUT/api/v1/users/profile-photo-upload
userRoutes.put('/profile-photo-upload', protected, upload.single('profile'), uploadProfilePhotoCtrl);

//PUT/api/v1/users/cover-photo-upload
userRoutes.put('/cover-photo-upload', protected, upload.single('profile'), uploadCoverPhotoCtrl);

//PUT/api/v1/users/update-password
userRoutes.put('/update-password', updatePasswordCtrl);

//PUT/api/v1/users/update
userRoutes.put('/update', updateUserCtrl);

//GET/api/v1/users/:id
userRoutes.get('/:id', userDetailsCtrl);

module.exports = userRoutes;
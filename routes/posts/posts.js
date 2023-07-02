const express = require('express');
const { createPostCtrl, fetchPostsCtrl, fetchPostCtrl, deletePostCtrl, updatePostCtrl } = require('../../controllers/posts/posts');
const protected = require('../../middlewares/protected.js');
const multer = require('multer');
const storage = require('../../config/cloudinary');
const Post = require('../../model/post/Post');

const postRoutes = express.Router();

//instance of multer
const upload = multer({
    storage,
})

//forms
postRoutes.get('/get-post-form', (req, res) => {
    res.render('posts/addPost', {
        error: '',
    })
})

postRoutes.get('/get-update-form/:id', async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.render('posts/updatePost', {
            post,
            error: '',
        });
    } catch (error) {
        return res.render('posts/postDetails', {
            post: await Post.findById(req.params.id),
            error: error.message,
        });
    }
})

//POST/api/v1/posts
postRoutes.post('/', protected, upload.single('file'), createPostCtrl);

//GET/api/v1/posts
postRoutes.get('/', fetchPostsCtrl);

//GET/api/v1/posts/:id
postRoutes.get('/:id', fetchPostCtrl);

//DELETE/api/v1/posts/:id
postRoutes.delete('/:id', protected, deletePostCtrl);

//PUT/api/v1/posts/:id
postRoutes.put('/:id', protected, upload.single('file'), updatePostCtrl);

module.exports = postRoutes;
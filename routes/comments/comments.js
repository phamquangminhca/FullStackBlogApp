const express = require('express');
const { createCommentCtrl, commentDetailsCtrl, deleteCommentCtrl, updateCommentCtrl } = require('../../controllers/comments/comments');
const protected = require('../../middlewares/protected.js');
const Comment = require('../../model/comment/Comment');


const commentRoutes = express.Router();

//POST/api/v1/comments/:id
commentRoutes.post('/:id', protected, createCommentCtrl);

//GET/api/v1/comments/:postId/:id
commentRoutes.get('/:postId/:id', commentDetailsCtrl);

//DELETE/api/v1/comments/:id
commentRoutes.delete('/:id', protected, deleteCommentCtrl);

//PUT/api/v1/comments/:id
commentRoutes.put('/:id', protected, updateCommentCtrl);

module.exports = commentRoutes;
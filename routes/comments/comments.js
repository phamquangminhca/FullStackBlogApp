const express = require('express');
const { createCommentCtrl, commentDetailsCtrl, deleteCommentCtrl, updateCommentCtrl } = require('../../controllers/comments/comments');

const commentRoutes = express.Router();

//POST/api/v1/comments
commentRoutes.post('/', createCommentCtrl);

//GET/api/v1/comments/:id
commentRoutes.get('/:id', commentDetailsCtrl);

//DELETE/api/v1/comments/:id
commentRoutes.delete('/:id', deleteCommentCtrl);

//PUT/api/v1/comments/:id
commentRoutes.put('/:id', updateCommentCtrl);

module.exports = commentRoutes;
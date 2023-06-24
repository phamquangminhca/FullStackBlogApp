const Post = require("../../model/post/Post");
const User = require("../../model/user/User");

const createPostCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            user: 'Post created'
        })
    } catch (error) {
        res.json(error);
    }
}

const fetchPostsCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            user: 'Posts list'
        })
    } catch (error) {
        res.json(error);
    }
}

const fetchPostCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            user: 'Post details'
        })
    } catch (error) {
        res.json(error);
    }
}

const deletePostCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            user: 'Post deleted'
        })
    } catch (error) {
        res.json(error);
    }
}

const updatePostCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            user: 'Post updated'
        })
    } catch (error) {
        res.json(error);
    }
}

module.exports = {
    createPostCtrl,
    fetchPostsCtrl,
    fetchPostCtrl,
    deletePostCtrl,
    updatePostCtrl
}
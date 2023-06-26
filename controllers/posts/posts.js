const Post = require("../../model/post/Post");
const User = require("../../model/user/User");
const appErr = require("../../utils/appErr");

const createPostCtrl = async (req, res, next) => {
    const {title, description, category} = req.body;
    try {
        if (!title || !description || !category || !req.file) {
            return next(appErr('All fields are required'));
        }
        //Find the user
        const userId = req.session.userAuth;
        const userFound = await User.findById(userId);

        //Create the post
        const postCreated = await Post.create({
            title,
            description,
            category,
            user: userId,
            image: req.file.path,
        })

        //Push the post created into the array of user's posts
        userFound.posts.push(postCreated._id);

        //resave
        await userFound.save();

        res.json({
            status: 'success',
            data: postCreated,
        })
    } catch (error) {
        next(appErr(error.message));
    }
}

const fetchPostsCtrl = async (req, res, next) => {
    try {
        const posts = await Post.find().populate('comments');
        res.json({
            status: 'success',
            data: posts,
        })
    } catch (error) {
        next(appErr(error.message));
    }
}

const fetchPostCtrl = async (req, res, next) => {
    try {
        //get the id from params
        const id = req.params.id;

        //find the post
        const post = await Post.findById(id).populate('comments');

        res.json({
            status: 'success',
            data: post,
        })
    } catch (error) {
        next(appErr(error.message));
    }
}

const deletePostCtrl = async (req, res, next) => {
    try {
        //find the post
        const post = await Post.findById(req.params.id);

        //check if the post belongs to the logged in user
        if (post.user.toString() !== req.session.userAuth.toString()) {
            return next(appErr('You are not allowed to delete this post', 403));
        }

        //delete post
        await Post.findByIdAndDelete(req.params.id);
  
        // Remove the deleted post's ID from User
        await User.updateMany(
            { posts: req.params.id },
            { $pull: { posts: req.params.id } }
        );

        res.json({
            status: 'success',
            data: 'Post has been deleted successfully'
        })
    } catch (error) {
        next(appErr(error.message));
    }
}

const updatePostCtrl = async (req, res, next) => {
    const { title, description, category } = req.body;
    try {
        //find the post
        const post = await Post.findById(req.params.id);

        //check if the post belongs to the logged in user
        if (post.user.toString() !== req.session.userAuth.toString()) {
            return next(appErr('You are not allowed to update this post', 403));
        }

        //update
        const postUpdated = await Post.findByIdAndUpdate(req.params.id, {
            title,
            description,
            category,
            image: req.file.path,
        }, {
            new: true,
        });

        res.json({
            status: 'success',
            data: postUpdated,
        })
    } catch (error) {
        next(appErr(error.message));
    }
}

module.exports = {
    createPostCtrl,
    fetchPostsCtrl,
    fetchPostCtrl,
    deletePostCtrl,
    updatePostCtrl
}
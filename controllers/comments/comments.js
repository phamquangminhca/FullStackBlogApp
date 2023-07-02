const Comment = require("../../model/comment/Comment");
const Post = require("../../model/post/Post");
const User = require("../../model/user/User");
const appErr = require("../../utils/appErr");

const createCommentCtrl = async (req, res, next) => {
    const {message} = req.body;
    try {
        //Find the post
        const post = await Post.findById(req.params.id);

        //create the comment
        const comment = await Comment.create({
            user: req.session.userAuth,
            message,
        })

        //Push the comment to Post
        post.comments.push(comment._id);

        //Find the user
        const user = await User.findById(req.session.userAuth);

        //Push the comment to User
        user.comments.push(comment._id);

        //disable validation
        //resave
        await post.save({validateBeforeSave: false});
        await user.save({validateBeforeSave: false});

        res.redirect(`/api/v1/posts/${post._id}`);


    } catch (error) {
        res.render('posts/postDetails', {
            post: await Post.findById(req.params.id)
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })
            .populate('user'),
            error: error.message,
        });
    }
}

const commentDetailsCtrl = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        const post = await Post.findById(req.params.postId);
        res.render('comments/updateComment', {
            comment,
            post,
            error: '',
        })
    } catch (error) {
        return res.render('posts/postDetails', {
            post: '',
            error: error.message,
        });
    }
}

const deleteCommentCtrl = async (req, res, next) => {
    try {
        const postId = req.query.postId;

        //find the comment
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.render('posts/postDetails', {
                post: await Post.findById(postId)
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'user',
                        model: 'User'
                    }
                })
                .populate('user'),
                error: 'Comment Not Found',
            });
        }

        //check if the comment belongs to the logged in user
        if (comment.user.toString() !== req.session.userAuth.toString()) {
            return res.render('posts/postDetails', {
                post: await Post.findById(postId)
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'user',
                        model: 'User'
                    }
                })
                .populate('user'),
                error: 'You are not allowed to delete this comment',
            });
        }
        
        //delete comment
        await Comment.findByIdAndDelete(req.params.id);
          
        // Remove the deleted comment's ID from User
        await User.updateMany(
            { comments: req.params.id },
            { $pull: { comments: req.params.id } }
        );

        // Remove the deleted comment's ID from Post
        await Post.updateMany(
            { comments: req.params.id },
            { $pull: { comments: req.params.id } }
        );
        
        res.redirect(`/api/v1/posts/${postId}`);

    } catch (error) {
        next(appErr(error.message));
    }
}

const updateCommentCtrl = async (req, res, next) => {
    const { message } = req.body;
    try {
        const postId = req.query.postId;
        //find the comment
        const comment = await Comment.findById(req.params.id);

        //check if the comment belongs to the logged in user
        if (comment.user.toString() !== req.session.userAuth.toString()) {
            return res.render('comments/updateComment', {
                comment,
                post: await Post.findById(postId),
                error: 'You are not allowed to update this comment',
            })
        }
        
        //update
        const commentUpdated = await Comment.findByIdAndUpdate(req.params.id, {
            message,
        }, {
            new: true,
        });
        
        res.redirect(`/api/v1/posts/${postId}`);
    } catch (error) {
        return res.render('comments/updateComment', {
            comment: await Comment.findById(req.params.id),
            post: await Post.findById(req.query.postId),
            error: error.message,
        })
    }
}

module.exports = {
    createCommentCtrl,
    commentDetailsCtrl,
    deleteCommentCtrl,
    updateCommentCtrl
}
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


        res.json({
            status: 'success',
            data: comment,
        })
    } catch (error) {
        next(appErr(error.message));
    }
}

const commentDetailsCtrl = async (req, res, next) => {
    try {
        res.json({
            status: 'success',
            user: 'Comment details'
        })
    } catch (error) {
        next(appErr(error.message));
    }
}

const deleteCommentCtrl = async (req, res, next) => {
    try {
        //find the comment
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return next(appErr('Comment Not Found'));
        }

        //check if the comment belongs to the logged in user
        if (comment.user.toString() !== req.session.userAuth.toString()) {
            return next(appErr('You are not allowed to delete this comment', 403));
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
        
        res.json({
            status: 'success',
            data: 'Comment has been deleted successfully'
        })
    } catch (error) {
        next(appErr(error.message));
    }
}

const updateCommentCtrl = async (req, res, next) => {
    const { message } = req.body;
    try {
        //find the comment
        const comment = await Comment.findById(req.params.id);

        //check if the comment belongs to the logged in user
        if (comment.user.toString() !== req.session.userAuth.toString()) {
            return next(appErr('You are not allowed to update this comment', 403));
        }
        
        //update
        const commentUpdated = await Comment.findByIdAndUpdate(req.params.id, {
            message,
        }, {
            new: true,
        });
        
        res.json({
            status: 'success',
            data: commentUpdated,
        })
    } catch (error) {
        next(appErr(error.message));
    }
}

module.exports = {
    createCommentCtrl,
    commentDetailsCtrl,
    deleteCommentCtrl,
    updateCommentCtrl
}
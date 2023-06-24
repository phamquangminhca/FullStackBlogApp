const createCommentCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            user: 'Comment created'
        })
    } catch (error) {
        res.json(error);
    }
}

const commentDetailsCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            user: 'Comment details'
        })
    } catch (error) {
        res.json(error);
    }
}

const deleteCommentCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            user: 'Comment deleted'
        })
    } catch (error) {
        res.json(error);
    }
}

const updateCommentCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            user: 'Comment updated'
        })
    } catch (error) {
        res.json(error);
    }
}

module.exports = {
    createCommentCtrl,
    commentDetailsCtrl,
    deleteCommentCtrl,
    updateCommentCtrl
}
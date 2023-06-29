const appErr = require("../utils/appErr");

const protected = (req, res, next) => {
    //Check if user is logged in
    if (req.session.userAuth) {
        next();
    } else {
        res.render('users/notAuthorize');
    }
}

module.exports = protected;
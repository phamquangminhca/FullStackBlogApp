const bcrypt = require('bcryptjs');
const User = require("../../model/user/User");
const appErr = require('../../utils/appErr');
const { log } = require('console');

const registerCtrl = async (req, res, next) => {
    const { fullname, email, password } = req.body;
    //check if field is empty
    if(!fullname || !email || !password) {
        return next(appErr('All field are required'));
    }
    try {
        //Check if user exists (email)
        const userFound = await User.findOne({email});
        //Throw an error
        if(userFound) {
            return next(appErr('User already exist'))
        }
        //Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHashed = await bcrypt.hash(password, salt);
        //Register user
        const user = await User.create({
            fullname,
            email,
            password: passwordHashed,
        })
        res.json({
            status: 'success',
            data: user
        })
    } catch (error) {
        res.json(error);
        // return next(appErr(error))
    }
}

const loginCtrl = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(appErr('Email and password fields are required'));
    }
    try {
        //Check if email exists
        const userFound = await User.findOne({ email });
        if (!userFound) {
            return next(appErr('Invalid login credentials'));
        }
        //Verify password
        const isPasswordValid = await bcrypt.compare(password, userFound.password);
        if (!isPasswordValid) {
            return next(appErr('Invalid login credentials'));
        }
        //save the user into session
        req.session.userAuth = userFound._id;
        console.log(req.session);
        res.json({
            status: 'success',
            data: userFound
        })
    } catch (error) {
        res.json(error);
    }
}

const logoutCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            user: 'Logout'
        })
    } catch (error) {
        res.json(error);
    }
}

const userDetailsCtrl = async (req, res) => {
    try {
        //get user's id from params
        const userId = req.params.id;
        //find the user
        const user = await User.findById(userId);
        res.json({
            status: 'success',
            data: user,
        })
    } catch (error) {
        res.json(error);
    }
}

const profileCtrl = async (req, res) => {
    try {
        // console.log(req.session.userAuth);
        //get the logged in user
        const user = await User.findById(req.session.userAuth);
        res.json({
            status: 'success',
            data: user,
        })
    } catch (error) {
        res.json(error);
    }
}

const uploadProfilePhotoCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            user: 'Upload profile photo'
        })
    } catch (error) {
        res.json(error);
    }
}

const uploadCoverPhotoCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            user: 'Upload cover photo'
        })
    } catch (error) {
        res.json(error);
    }
}

const updatePasswordCtrl = async (req, res) => {
    const { password } = req.body;
    try {
        //Check if user is updating the password
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const passwordHashed = await bcrypt.hash(password, salt);
             //Update user
            await User.findByIdAndUpdate(req.params.id, {
                password: passwordHashed,
            }, {
                new: true,
            })
        }
        res.json({
            status: 'success',
            user: 'Password has been changed successfully',
        })
    } catch (error) {
        res.json(error);
    }
}

const updateUserCtrl = async (req, res, next) => {
    const { fullname, email } = req.body;
    try {
        //check if email is not taken
        if(email) {
            const emailTaken = await User.findOne({email});
            if (emailTaken) {
                return next(appErr('Email is taken', 400));
            }
        }
        //update the user
        const user = await User.findByIdAndUpdate(req.params.id, {
            fullname,
            email,
        }, {
            new: true,
        })
        res.json({
            status: 'success',
            data: user
        })
    } catch (error) {
        return next(appErr(error));
    }
}

module.exports = {
    registerCtrl,
    loginCtrl,
    logoutCtrl,
    userDetailsCtrl,
    profileCtrl,
    uploadProfilePhotoCtrl,
    uploadCoverPhotoCtrl,
    updatePasswordCtrl,
    updateUserCtrl
}
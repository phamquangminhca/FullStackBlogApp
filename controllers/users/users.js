const bcrypt = require('bcryptjs');
const User = require("../../model/user/User");
const appErr = require('../../utils/appErr');
const { log } = require('console');

const registerCtrl = async (req, res, next) => {
    const { fullname, email, password } = req.body;
    //check if field is empty
    if(!fullname || !email || !password) {
        return res.render('users/register', {
            error: 'All fields are required',
        });
    }
    try {
        //Check if user exists (email)
        const userFound = await User.findOne({email});
        //Throw an error
        if(userFound) {
            // return next(appErr('User already exist'))
            return res.render('users/register', {
                error: 'User already exist',
            });
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
        //redirect
        res.redirect('/api/v1/users/profile-page')
    } catch (error) {
        // res.json(error);
        return next(appErr(error))
    }
}

const loginCtrl = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        // return next(appErr('Email and password fields are required'));
        return res.render('users/login', {
            error: 'Email and password fields are required',
        });
    }
    try {
        //Check if email exists
        const userFound = await User.findOne({ email });
        if (!userFound) {
            // return next(appErr('Invalid login credentials'));
            return res.render('users/login', {
                error: 'Invalid login credentials',
            });
        }
        //Verify password
        const isPasswordValid = await bcrypt.compare(password, userFound.password);
        if (!isPasswordValid) {
            // return next(appErr('Invalid login credentials'));
            return res.render('users/login', {
                error: 'Invalid login credentials',
            });
        }
        //save the user into session
        req.session.userAuth = userFound._id;
        console.log(req.session);

        //redirect
        res.redirect('/api/v1/users/profile-page')
    } catch (error) {
        res.json(error);
    }
}

const logoutCtrl = async (req, res) => {
    //destroy session
    req.session.destroy(() => {
        res.redirect('/api/v1/users/login');
    });
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
        const user = await User.findById(req.session.userAuth).populate('posts').populate('comments');
        res.render('users/profile', { user })
    } catch (error) {
        res.json(error);
    }
}

const uploadProfilePhotoCtrl = async (req, res, next) => {
    try {
        //check if file exist
        if(!req.file) {
            return res.render('users/uploadProfilePhoto', {
                error: 'Please upload image',
            })
        }

        //Find the user to be updated
        const userId = req.session.userAuth;
        const userFound = await User.findById(userId);

        //Check if user is found
        if (!userFound) {
            return res.render('users/uploadProfilePhoto', {
                error: 'User not found',
            })
        }

        //Update profile photo
        const user = await User.findByIdAndUpdate(userId, {
            profileImage: req.file.path,
        }, {
            new: true,
        });

        res.redirect('/api/v1/users/profile-page')
    } catch (error) {
        return res.render('users/uploadProfilePhoto', {
            error: error.message,
        })
    }
}

const uploadCoverPhotoCtrl = async (req, res) => {
    console.log(req.file.path);
    try {
        //Find the user to be updated
        const userId = req.session.userAuth;
        const userFound = await User.findById(userId);

        //Check if user is found
        if (!userFound) {
            return next(appErr('User not found', 403));
        }

        //Update profile photo
        await User.findByIdAndUpdate(userId, {
            coverImage: req.file.path,
        }, {
            new: true,
        });
        res.json({
            status: 'success',
            data: 'You have successfully updated your cover photo',
        })
    } catch (error) {
        res.json(error);
    }
}

const updatePasswordCtrl = async (req, res, next) => {
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
        return next(appErr('Please provide password field'));
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
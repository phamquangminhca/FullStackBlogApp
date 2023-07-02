const bcrypt = require('bcryptjs');
const User = require("../../model/user/User");
const appErr = require('../../utils/appErr');
const { log } = require('console');

const registerCtrl = async (req, res, next) => {
    const { fullname, email, password, role, bio } = req.body;
    //check if field is empty
    if(!fullname || !email || !password || !role || !bio) {
        return res.render('users/register', {
            error: 'All fields are required',
        });
    }
    try {
        //Check if user exists (email)
        const userFound = await User.findOne({email});
        //Throw an error
        if(userFound) {
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
            role,
            bio,
            password: passwordHashed,
        })

        //save the user into session
        req.session.userAuth = user._id;
        console.log(req.session);

        //redirect
        res.redirect('/api/v1/users/profile-page')
    } catch (error) {
        return res.render('users/register', {
            error: error.message,
        });
    }
}

const loginCtrl = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.render('users/login', {
            error: 'Email and password fields are required',
        });
    }
    try {
        //Check if email exists
        const userFound = await User.findOne({ email });
        if (!userFound) {
            return res.render('users/login', {
                error: 'Invalid login credentials',
            });
        }
        //Verify password
        const isPasswordValid = await bcrypt.compare(password, userFound.password);
        if (!isPasswordValid) {
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
        return res.render('users/login', {
            error: error.message,
        });
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
        // res.json({
        //     status: 'success',
        //     data: user,
        // });
        res.render('users/updateUser', {
            user,
            error:'',
        })
    } catch (error) {
        return res.render('users/updateUser', {
            user: await User.findById(req.params.id),
            error:error.message,
        })
    }
}

const profileCtrl = async (req, res) => {
    try {
        // console.log(req.session.userAuth);
        //get the logged in user
        const user = await User.findById(req.session.userAuth).populate('posts').populate('comments');
        console.log(user);
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
        await User.findByIdAndUpdate(userId, {
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
    try {
        //check if file exist
        if(!req.file) {
            return res.render('users/uploadCoverPhoto', {
                error: 'Please upload image',
            })
        }

        //Find the user to be updated
        const userId = req.session.userAuth;
        const userFound = await User.findById(userId);

        //Check if user is found
        if (!userFound) {
            return res.render('users/uploadCoverPhoto', {
                error: 'User not found',
            })
        }

        //Update profile photo
        await User.findByIdAndUpdate(userId, {
            coverImage: req.file.path,
        }, {
            new: true,
        });

        res.redirect('/api/v1/users/profile-page')
    } catch (error) {
        return res.render('users/uploadCoverPhoto', {
            error: error.message,
        })
    }
}

const updatePasswordCtrl = async (req, res, next) => {
    const { password } = req.body;
    try {
        if(!password) {
            return res.render('users/updatePassword', {
                error: 'Please provide password field',
            });
        }
        //Check if user is updating the password
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const passwordHashed = await bcrypt.hash(password, salt);
             //Update user
            await User.findByIdAndUpdate(req.session.userAuth, {
                password: passwordHashed,
            }, {
                new: true,
            })
        }
        res.redirect('/api/v1/users/profile-page')
    } catch (error) {
        return res.render('users/updatePassword', {
            error: error.message,
        });
    }
}

const updateUserCtrl = async (req, res, next) => {
    const { fullname, email, role, bio } = req.body;
    try {
        const user = await User.findById(req.session.userAuth);
        if (!fullname || !email || !role || !bio) {
            return res.render('users/updateUser', {
                error: 'Full name and email fields are required',
                user,
            });
        }
        //check if email is not taken
        if(email) {
            const emailTaken = await User.findOne({email});
            if (emailTaken && email !== user.email) {
                return res.render('users/updateUser', {
                    error: 'Email is taken',
                    user,
                })
            }
        }
        //update the user
        await User.findByIdAndUpdate(req.session.userAuth, {
            fullname,
            email,
            role,
            bio,
        }, {
            new: true,
        })
        res.redirect('/api/v1/users/profile-page')
    } catch (error) {
        return res.render('users/updateUser', {
            error: error.message,
            user: await User.findById(req.session.userAuth),
        })
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
const User = require('../models/UserModel');
const Post = require('../models/PostModel');
const { sendEmail } = require('../helper/sendMail');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user)
            return res.status(400).json({
                success: false,
                message: 'User already registered'
            })
        
        user = await User.create({
            name,
            email,
            password,
            avatar: {
                public_id: "sample id",
                url: 'sample url'
            }
        })

        res.status(201).json({
            success: true,
            user
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
};

exports.login = async (req, res) => {
    
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({
                success: false,
                message: `User does not exist`
            });
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect password'
            });
        }

        const token = await user.generateToken();

        const options = { 
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), httpOnly: true
        }

        res.status(201).cookie("token", token, options).json({
            success: true,
            user,
            token
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.logout = async (req, res) => {
    try {
        res.status(200).cookie("token", null, { expires: new Date(Date.now()), httpOnly: true }).json({
            success: true,
            message: "Logged out successfully"
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

exports.followUser = async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const loggedInUser = await User.findById(req.user.id);

        if (!userToFollow) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (loggedInUser.following.includes(userToFollow._id)) {
            const indexFollowing = loggedInUser.following.indexOf(userToFollow._id);
            loggedInUser.following.splice(indexFollowing, 1);

            
            const indexFollowers = loggedInUser.followers.indexOf(loggedInUser._id);
            userToFollow.followers.splice(indexFollowers, 1);

            await userToFollow.save();
            await loggedInUser.save();

            res.status(200).json({
                success: true,
                message: 'User Unfollowed',
            });
        } else {
            loggedInUser.following.push(userToFollow._id);
            userToFollow.followers.push(loggedInUser._id);

            await userToFollow.save();
            await loggedInUser.save();

            res.status(200).json({
                success: true,
                message: 'User Followed'
            })
        }


        await loggedInUser.save();
        await userToFollow.save();

        res.status(200).json({
            success: true,
            message: 'User Followed'
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

exports.updatePassword = async (req, res) => {
    try {

        const user = await User.findById(req.user._id).select('+password');
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: true,
                message: 'Please provide old & new password',
            });
        }

        const isMatch = await user.matchPassword(oldPassword);

        if (!isMatch) {
            return res.status(400).json({
                success: true,
                message: 'Incorrect old password',
            });
        }


        user.password = newPassword;

        await user.save();
        
        res.status(200).json({
            success: true,
            message: 'Password Updated',
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        const { name, email } = req.body;
        
        if (name) {
            user.name = name;
        }
        if (email) {
            user.email = email;
        }

        // TODO: User Avatar
        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile Updated"
        })
        
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

exports.deleteMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const posts = user.posts;
        const followers = user.followers;
        const following = user.following;
        const userId = user._id;

        await user.remove();

        // logout user after deleting profile
        res.cookie('token', null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });

        // deleting all posts of the user
        for (let i = 0; i < posts.length; i++) {
            const post = await Post.findById(posts[i]);
            await post.remove();
        }

        // removing User from Followers and Followings
        for (let i = 0; i < followers.length; i++) {
            const follower = await User.findById(followers[i]);
            const index = follower.following.indexOf(userId);
            follower.following.splice(index, 1);
            await follower.save();
            // await follower.remove();
        }

        // removing User from Followers and Followings
        for (let i = 0; i < following.length; i++) {
            const follows = await User.findById(following[i]);
            const index = follows.followers.indexOf(userId);
            follows.followers.splice(index, 1);
            await follows.save();
            // await follower.remove();
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

exports.myProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("posts");

        res.status(200).json({
            success: true,
            user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("posts");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});

        res.status(200).json({
            success: true,
            users
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const resetPasswordToken = user.getResetPasswordToken();

        await user.save();

        const resetUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetPasswordToken}`;

        const message = `Reset Your Password by clicking on the link below: \n\n ${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Reset Password',
                message,
            });

            res.status(200).json({
                success: true,
                message: `Email sent to ${user.email}`,
            });
        } catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();

            res.status(500).json({
                success: false,
                message: err.message,
            });
        }

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Token is invalid or has expired',
            });
        }

        user.password = req.body.password;

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password Updated',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getMyPosts = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        const posts = [];

        for (let i = 0; i < user.posts.length; i++) {
            const post = await Post.findById(user.posts[i]).populate(
                'likes comments.user owner'
            );
            posts.push(post);
        }

        res.status(200).json({
            success: true,
            posts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getUserPosts = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        const posts = [];

        for (let i = 0; i < user.posts.length; i++) {
            const post = await Post.findById(user.posts[i]).populate(
                'likes comments.user owner'
            );
            posts.push(post);
        }

        res.status(200).json({
            success: true,
            posts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
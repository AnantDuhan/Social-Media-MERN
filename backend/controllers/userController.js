const User = require('../models/UserModel');

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
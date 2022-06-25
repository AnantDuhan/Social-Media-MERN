const Post = require('../models/PostModel');
const User = require('../models/UserModel');

exports.createPost = async (req, res, next) => {
    try {
        const newPostData = {
            caption: req.body.caption,
            image: {
                public_id: 'sample id',
                url: 'sample url'
            },
            owner: req.user._id
        }

        const post = await Post.create(newPostData);

        const user = await User.findById(req.user._id);

        user.posts.push(post._id);

        await user.save();
        res.status(200).json({
            success: true,
            post
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
};

exports.deletePost = async (req, res, next) => {
    try {
        
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post Not Found',
            });
        }

        if (post.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }
        await post.remove();

        const user = await User.findById(req.user._id);

        const index = user.posts.indexOf(req.params.id);

        user.posts.splice(index, 1);

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Post Deleted'
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

exports.likeAndUnlikePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post Not Found'
            })
        }

        if (post.likes.includes(req.user._id)) {
            const index = post.likes.indexOf(req.user._id);
            post.likes.splice(index, 1);
            await post.save();

            return res.status(200).json({
                success: true,
                message: 'Post Unliked'
            })
        } else {
            post.likes.push(req.user._id);
            await post.save();

            return res.status(200).json({
                success: true,
                message: 'Post Liked'
            })
        }

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

exports.updateCaption = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        if (post.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
        }

        post.caption = req.body.caption;
        
        await post.save();
        
        res.status(200).json({
            success: true,
            message: 'Post updated',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getPostOfFollowing = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        const posts = await Post.find({
            owner: {
                $in: user.following
            }
        });
        res.status(200).json({
            success: true,
            posts
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
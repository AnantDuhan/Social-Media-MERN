import { Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createNewPost } from '../../Actions/postAction';
import { loadUser } from '../../Actions/userAction';
import './NewPost.css';

const NewPost = () => {

    const [image, setImage] = useState(null);
    const [caption, setCaption] = useState('');

    const { loading, error, message } = useSelector((state) => state.like);
    const dispatch = useDispatch();

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        const Reader = new FileReader();
        Reader.readAsDataURL(file);

        Reader.onload = () => {
            if (Reader.readyState === 2) {
                setImage(Reader.result);
            }
        };
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        await dispatch(createNewPost(caption, image));
        dispatch(loadUser());
    };

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch({ type: 'clearErrors' });
        }

        if (message) {
            toast.success(message);
            dispatch({ type: 'clearMessage' });
        }
    }, [dispatch, error, message]);

    return (
        <div className="newPost">
            <form className="newPostForm" onSubmit={submitHandler}>
                <Typography variant="h3">New Post</Typography>
                {image && <img src={image} alt="" />}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                <input
                    type="text"
                    placeholder="Caption..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                />
                <Button disabled={loading} type="submit">
                    Post
                </Button>
            </form>
        </div>
    );
};

export default NewPost;

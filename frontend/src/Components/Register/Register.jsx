import { Avatar, Typography, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './Register.css';
import { registerUser } from '../../Actions/userAction';
import { toast } from 'react-toastify';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [password, setPassword] = useState('');

    // const navigate = useNavigate();
    const dispatch = useDispatch();
    const { error } = useSelector((state) => state.user);

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        const Reader = new FileReader();
        Reader.readAsDataURL(file);

        Reader.onload = () => {
            if (Reader.readyState === 2) {
                setAvatar(Reader.result);
            }
        };
        e.preventDefault();
    };

    const submitHandler = (e) => {
        e.preventDefault();
        // navigate('/verify')
        dispatch(registerUser(name, email, password, avatar));
    };

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch({ type: 'clearErrors' });
        }
    }, [dispatch, error]);
    return (
        <div className="register">
            <form className="registerForm" onSubmit={submitHandler}>
                <Typography variant="h3" style={{ padding: '2vmax' }}>
                    Register
                </Typography>

                <Avatar
                    src={avatar}
                    alt="User"
                    sx={{ height: '10vmax', width: '10vmax' }}
                />

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />

                <input
                    type="text"
                    value={name}
                    placeholder="Name"
                    className="registerInputs"
                    required
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Email"
                    className="registerInputs"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    className="registerInputs"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Link to="/">
                    <Typography>Already Signed Up? Login Now</Typography>
                </Link>

                <Button type="submit">Sign Up</Button>
            </form>
        </div>
    );
};

export default Register;

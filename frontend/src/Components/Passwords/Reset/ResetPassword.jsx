import { Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../../../Actions/userAction';
import './ResetPassword.css';

const ResetPassword = () => {
    const [password, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const { error, loading, message } = useSelector((state) => state.like);

    const submitHandler = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set('password', password);
        myForm.set('confirmPassword', confirmPassword);

        dispatch(resetPassword(params.token, myForm));
    };

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch({ type: 'clearErrors' });
        }
        if (message) {
            toast.success('Password updated successfully');
            navigate('/login')
            dispatch({ type: 'clearMessage' });
        }
    }, [error, dispatch, message, navigate]);

    return (
        <div className="resetPassword">
            <form className="resetPasswordForm" onSubmit={submitHandler}>
                <Typography variant="h3" style={{ padding: '2vmax' }}>
                    Social App
                </Typography>

                <input
                    type="password"
                    placeholder="New Password"
                    required
                    className="updatePasswordInputs"
                    value={password}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    className="updatePasswordInputs"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <Link to="/">
                    <Typography>Login</Typography>
                </Link>
                <Typography>Or</Typography>

                <Link to="/forgot/password">
                    <Typography>Request Another Token!</Typography>
                </Link>

                <Button disabled={loading} type="submit">
                    Reset Password
                </Button>
            </form>
        </div>
    );
};

export default ResetPassword;

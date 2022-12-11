import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import { loadUser } from './Actions/userAction';
import Account from './Components/Account/Account';
import Header from './Components/Header/Header';
import Home from './Components/Home/Home';
import Search from './Components/Search/Search';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import NewPost from './Components/NewPost/NewPost';
import VerifyAccount from './Components/VerifyAccount/VerifyAccount';


import './App.css';
import UpdatePassword from './Components/Passwords/Update/UpdatePassword';
import ForgotPassword from './Components/Passwords/Forgot/ForgotPassword';
import ResetPassword from './Components/Passwords/Reset/ResetPassword';
import UserProfile from './Components/UserProfile/UserProfile';
import UpdateProfile from './Components/Update Profile/UpdateProfile';

function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);

    const { isAuthenticated } = useSelector((state) => state.user);
  return (
      <Router>
          {isAuthenticated && <Header />}
          <Routes>
              <Route
                  path="/"
                  element={isAuthenticated ? <Home /> : <Login />}
              />
              <Route
                  path="/account"
                  element={isAuthenticated ? <Account /> : <Login />}
              />

              <Route
                  path="/register"
                  element={isAuthenticated ? <Account /> : <Register />}
              />

              <Route
                  path="/verify"
                  element={<VerifyAccount />}
              />

              <Route
                  path="/newpost"
                  element={isAuthenticated ? <NewPost /> : <Login />}
              />

              <Route
                  path="/update/profile"
                  element={isAuthenticated ? <UpdateProfile /> : <Login />}
              />

              <Route
                  path="/update/password"
                  element={isAuthenticated ? <UpdatePassword /> : <Login />}
              />

              <Route
                  path="/forgot/password"
                  element={
                      isAuthenticated ? <UpdatePassword /> : <ForgotPassword />
                  }
              />

              <Route
                  path="/password/reset/:token"
                  element={
                      isAuthenticated ? <UpdatePassword /> : <ResetPassword />
                  }
              />

              <Route
                  path="/user/:id"
                  element={isAuthenticated ? <UserProfile /> : <Login />}
              />

              <Route path="search" element={<Search />} />

              {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
      </Router>
  );
}

export default App;

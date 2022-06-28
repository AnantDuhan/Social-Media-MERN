import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './Components/Header/Header';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './Actions/userAction';
import Home from './Components/Home/Home';
import Account from './Components/Account/Account';

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
          </Routes>
      </Router>
  );
}

export default App;

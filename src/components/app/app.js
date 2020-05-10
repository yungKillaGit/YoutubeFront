import React, { useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import Home from '../home/home';
import LoginPage from '../login-page/login-page';
import RegisterPage from '../register-page/register-page';
import { AuthContext } from '../../context/auth';

const App = () => {
  const existingToken = localStorage.getItem('authToken');
  const existingUserId = localStorage.getItem('userId');
  const existingUserName = localStorage.getItem('userName');

  const isAuthenticated = existingToken !== null && existingToken !== 'undefined';
  const [token, setToken] = useState(existingToken);
  const [user, setUser] = useState({ id: existingUserId, name: existingUserName });

  axios.interceptors.request.use((options) => {
    if (isAuthenticated) {
      options.headers.Authorization = `Bearer ${existingToken}`;
    }
    return options;
  });
  const setAuthInfo = (authToken) => {
    const decodedJwt = jwt_decode(authToken);

    localStorage.setItem('authToken', authToken);
    localStorage.setItem('userId', decodedJwt.id);
    localStorage.setItem('userName', decodedJwt.userName);

    setToken(authToken);
    setUser({ id: decodedJwt.id, name: decodedJwt.userName });
  };

  return (
    <AuthContext.Provider value={{
      token, setAuthInfo, isAuthenticated, user,
    }}
    >
      <Router>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
      </Router>
    </AuthContext.Provider>
  );
};

export default App;

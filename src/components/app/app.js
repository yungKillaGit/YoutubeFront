import React, { useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import Home from '../home/home';
import LoginPage from '../login-page/login-page';
import RegisterPage from '../register-page/register-page';
import { AuthContext } from '../../context/auth';

const checkIfTokenExpired = (tokenFromStorage) => {
  if (tokenFromStorage !== 'null' && tokenFromStorage !== null) {
    if (jwt_decode(tokenFromStorage).exp < Date.now() / 1000) {
      localStorage.clear();
      return true;
    }
    return false;
  }
  return true;
};

const App = () => {
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  const authToken = localStorage.getItem('authToken');
  const isTokenExpired = checkIfTokenExpired(authToken);

  const [token, setToken] = useState(isTokenExpired ? null : authToken);
  const [user, setUser] = useState(isTokenExpired ? null : { id: userId, name: userName });

  axios.interceptors.request.use((options) => {
    if (!isTokenExpired) {
      options.headers.Authorization = `Bearer ${authToken}`;
    }
    return options;
  });
  const setAuthInfo = (encodedJwt) => {
    const decodedJwt = jwt_decode(encodedJwt);

    localStorage.setItem('authToken', encodedJwt);
    localStorage.setItem('userId', decodedJwt.id);
    localStorage.setItem('userName', decodedJwt.userName);

    setToken(authToken);
    setUser({ id: decodedJwt.id, name: decodedJwt.userName });
  };
  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
  };
  const isAuthenticated = !isTokenExpired && userId && userName;

  return (
    <AuthContext.Provider value={{
      token, setAuthInfo, isAuthenticated, user, logout,
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

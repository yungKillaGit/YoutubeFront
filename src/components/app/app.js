import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import Home from '../home/home';
import LoginPage from '../login-page/login-page';
import RegisterPage from '../register-page/register-page';
import RegisterChannel from '../register-channel/register-channel';
import Layout from '../layout/layout';
import YourVideos from '../your-videos/your-videos';
import { AuthContext } from '../../context/auth';
import { b64toBlob } from '../../utils';

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
  const authToken = localStorage.getItem('authToken');
  const userInStorage = JSON.parse(localStorage.getItem('user'));
  const isTokenExpired = checkIfTokenExpired(authToken);
  const isAuthenticated = !isTokenExpired && userInStorage !== null;

  const [token, setToken] = useState(isTokenExpired ? null : authToken);
  const [user, setUser] = useState(isTokenExpired ? null : userInStorage);
  const [videos, setVideos] = useState(null);
  const [isBusy, setBusy] = useState(false);

  axios.defaults.headers.common.Authorization = token ? `Bearer ${token}` : null;

  const fetchAllVideos = async () => {
    await axios.get('https://localhost:5001/api/videos')
      .then((response) => {
        setBusy(false);
        setVideos(response.data);
      });
  };

  useEffect(() => {
    fetchAllVideos();
  }, [user]);

  const setAuthInfo = (encodedJwt) => {
    localStorage.setItem('authToken', encodedJwt);
    setToken(encodedJwt);
  };

  const setUserInfo = (userInfo) => {
    if (userInfo.image) {
      const imageBlob = b64toBlob(userInfo.image.encodedImage, userInfo.image.contentType);
      userInfo.avatarUrl = URL.createObjectURL(imageBlob);
    }
    localStorage.setItem('user', JSON.stringify(userInfo));
    setUser(userInfo);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      token, setAuthInfo, isAuthenticated, user, logout, setUserInfo,
    }}
    >
      <Router>
        <Route
          exact
          path="/"
          render={(props) => {
            if (isBusy) {
              return <Layout />;
            }
            return <Layout><Home {...props} videos={videos} /></Layout>;
          }}
        />
        <Route exact path="/login" render={(props) => <LoginPage {...props} test={setBusy} />} />
        <Route exact path="/register" component={RegisterPage} />
        <Route
          exact
          path="/your-videos"
          render={(props) => <Layout><YourVideos {...props} /></Layout>}
        />
        <Route
          exact
          path="/register-channel"
          render={(props) => <Layout><RegisterChannel {...props} /></Layout>}
        />
      </Router>
    </AuthContext.Provider>
  );
};

export default App;

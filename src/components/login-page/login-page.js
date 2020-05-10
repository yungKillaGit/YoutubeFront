import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import {
  Container, TextField, Grid, Button,
} from '@material-ui/core';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useAuth } from '../../context/auth';
import { formatErrors } from '../../utils';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState();
  const [isLogged, setIsLogged] = useState(false);
  const { setAuthInfo } = useAuth();

  const login = () => {
    axios.post('https://localhost:5001/api/auth/login', {
      email,
      password,
    }).then((response) => {
      if (response.status === 200) {
        const { authToken } = response.data.token;
        setAuthInfo(authToken);
        setIsLogged(true);
      }
    }).catch((error) => {
      setErrors(formatErrors(error.response.data));
    });
  };

  if (isLogged) {
    return <Redirect to="/"/>;
  }

  return (
    <Container component="form" maxWidth="sm" className="mt-5 border">
      <Grid container direction="column">
        <h3>Вход</h3>
        <h5>Перейдите на Artur`s YouTube</h5>
        {
          errors ? (
            <>
              <TextField
                error
                label="Адрес эл.почты"
                helperText={errors.Email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                error
                label="Пароль"
                helperText={errors.Password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </>
          ) : (
            <>
            <TextField
              label="Адрес эл.почты"
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Пароль"
              onChange={(e) => setPassword(e.target.value)}
            />
            </>
          )
        }
        <Grid container justify="space-between" className="mt-4 mb-2">
          <Link to="/register">Создать аккаунт</Link>
          <Button color="primary" variant="contained" onClick={login}>Войти</Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginPage;

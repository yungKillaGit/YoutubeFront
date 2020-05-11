import React, { useState, useEffect, useRef } from 'react';
import { Link, Redirect } from 'react-router-dom';
import {
  Container, TextField, Grid, Button,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import { createValidationMessagesFromErrors, createValidationMessages, validate } from '../../utils';

const defaultErrorProps = createValidationMessages(['email', 'password']);

const LoginPage = () => {
  const firstRender = useRef(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationMessages, setValidationMessages] = useState(defaultErrorProps);
  const [isLogged, setLogged] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const [isAlert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const { setAuthInfo } = useAuth();

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const validationResult = validate({ email, password }, validationMessages);
    setValidationMessages(validationResult.newValidationMessages);
    setDisabled(!validationResult.isOk);
  }, [email, password]);

  const login = () => {
    axios.post('https://localhost:5001/api/auth/login', {
      email,
      password,
    }).then((response) => {
      if (response.status === 200) {
        const { authToken } = response.data.token;
        setAuthInfo(authToken);
        setLogged(true);
      }
    }).catch((error) => {
      const responseBody = error.response.data;
      // Если свойства errors нет, то эту ошибку выбросил валидатор.
      if (!responseBody.errors) {
        const newValidationMessages = createValidationMessagesFromErrors(error.response.data, validationMessages);
        setValidationMessages(newValidationMessages);
      } else {
        setAlertMessage(responseBody.errors[0].description);
        setAlert(true);
      }
    });
  };

  if (isLogged) {
    return <Redirect to="/" />;
  }

  return (
    <Container component="form" maxWidth="sm" className="mt-5 border">
      <Grid container direction="column">
        <h3>Вход</h3>
        <h5>Перейдите на Artur`s YouTube</h5>
        <TextField
          label="Адрес эл.почты"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          {...validationMessages.Email}
        />
        <TextField
          label="Пароль"
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          {...validationMessages.Password}
        />
        {
          isAlert ? (
            <Alert className="mt-3" severity="error" onClose={() => setAlert(false)}>
              <AlertTitle>Error</AlertTitle>
              {alertMessage}
            </Alert>
          ) : null
        }
        <Grid container justify="space-between" className="mt-4 mb-2">
          <Link to="/register">Создать аккаунт</Link>
          <Button
            color="primary"
            variant="contained"
            onClick={login}
            disabled={isDisabled}
          >
            Войти
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default React.memo(LoginPage);

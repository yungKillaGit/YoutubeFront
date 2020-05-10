import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container, TextField, Grid, Button,
} from '@material-ui/core';

const LoginPage = () => (
    <Container component="form" maxWidth="sm" className="mt-5 border">
      <Grid container direction="column">
        <h3>Вход</h3>
        <h5>Перейдите на Artur`s YouTube</h5>
        <TextField label="Адрес эл.почты"/>
        <TextField label="Пароль"/>
        <Grid container justify="space-between" className="mt-4 mb-2">
          <Link to="register">Создать аккаунт</Link>
          <Button color="primary" variant="contained">Войти</Button>
        </Grid>
      </Grid>
    </Container>
);

export default LoginPage;

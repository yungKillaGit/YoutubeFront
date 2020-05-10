import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container, TextField, Grid, Button,
} from '@material-ui/core';

const RegisterPage = () => (
    <Container component="form" maxWidth="sm" className="mt-5 border">
      <Grid container direction="column">
        <h3>Создайте аккаунт</h3>
        <h5>Перейдите на Artur`s YouTube</h5>
        <TextField label="Имя"/>
        <TextField label="Адрес эл.почты"/>
        <TextField className="mt-2" label="Дата рождения" type="date" InputLabelProps={{ shrink: true }}/>
        <Grid container>
          <TextField label="Пароль"/>
          <TextField label="Подтвердите пароль" className="ml-3"/>
        </Grid>
        <Grid container justify="space-between" className="mt-4 mb-2">
          <Link to="/login">Войти</Link>
          <Button color="primary" variant="contained">Создать аккаунт</Button>
        </Grid>
      </Grid>
    </Container>
);

export default RegisterPage;

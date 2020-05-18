import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Container, TextField, Grid, Button,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import axios from 'axios';
import {
  createValidationMessages,
  createValidationMessagesFromErrors,
  validate,
} from '../../utils';
import ImageCapture from '../image-capture/image-capture';

const defaultErrorProps = createValidationMessages([
  'email', 'name', 'password', 'repassword', 'birthDay',
]);

const RegisterPage = () => {
  const firstRender = useRef(true);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [isDisabled, setDisabled] = useState(false);
  const [validationMessages, setValidationMessages] = useState(defaultErrorProps);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertSeverity, setAlertSeverity] = useState('');
  const [picture, setPicture] = useState();

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const validationResult = validate({ email, password }, validationMessages);
    setValidationMessages(validationResult.newValidationMessages);
    setDisabled(!validationResult.isOk);
  }, [email, name, password, repassword, birthDay]);

  const register = () => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('name', name);
    formData.append('password', password);
    formData.append('birthDay', birthDay);
    formData.append('picture', picture);
    axios.post('https://localhost:5001/api/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((response) => {
      if (response.status === 200) {
        setAlertSeverity('info');
        setAlertMessage('Поздравляю. Вы успешно прошли регистрацию');
      }
    }).catch((error) => {
      setAlertSeverity('error');
      const { response } = error;
      if (!response) {
        setAlertMessage('Запустите сервер, предоставляющий API');
      } else if (response.status === 500) {
        setAlertMessage('Внутренняя ошибка сервера. Проверьте бэк');
      } else if (response.status === 400) {
        const newValidationMessages = createValidationMessagesFromErrors(response.data, validationMessages);
        setValidationMessages(newValidationMessages);
      } else if (response.data.errors) {
        setAlertMessage(response.data.errors[0].description);
      }
    });
  };

  return (
    <Container component="form" maxWidth="sm" className="mt-5 border">
      <Grid container direction="column">
        <h3>Создайте аккаунт</h3>
        <h5>Перейдите на Artur`s YouTube</h5>
        <TextField
          label="Имя"
          onChange={(e) => setName(e.target.value)}
          {...validationMessages.Name}
        />
        <TextField
          label="Адрес эл.почты"
          onChange={(e) => setEmail(e.target.value)}
          {...validationMessages.Email}
        />
        <TextField
          className="mt-2"
          label="Дата рождения"
          type="date"
          InputLabelProps={{ shrink: true }}
          onChange={(e) => setBirthDay(e.target.value)}
          {...validationMessages.BirthDay}
        />
        <Grid container>
          <div className="mt-2">Изображение профиля: </div>
          <ImageCapture mediaType="image" setImage={setPicture} />
        </Grid>
        <Grid container>
          <TextField
            label="Пароль"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            {...validationMessages.Password}
          />
          <TextField
            label="Подтвердите пароль"
            className="ml-3"
            type="password"
            onChange={(e) => setRepassword(e.target.value)}
            {...validationMessages.Repassword}
          />
        </Grid>
        {
          alertMessage ? (
            <Alert className="mt-3" severity={alertSeverity} onClose={() => setAlertMessage(null)}>
              {alertMessage}
            </Alert>
          ) : null
        }
        <Grid container justify="space-between" className="mt-4 mb-2">
          <Link to="/login">Войти</Link>
          <Button
            color="primary"
            variant="contained"
            onClick={register}
            disabled={isDisabled}
          >
            Создать аккаунт
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RegisterPage;

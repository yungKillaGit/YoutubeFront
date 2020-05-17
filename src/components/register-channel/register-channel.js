import React, { useState, useEffect, useRef } from 'react';
import {
  Button, Grid, TextField,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import axios from 'axios';
import { Redirect, useHistory } from 'react-router-dom';
import {
  createValidationMessages,
  createValidationMessagesFromErrors,
  validate,
} from '../../utils';
import { useAuth } from '../../context/auth';

const defaultValidationMessages = createValidationMessages(['name']);

const RegisterChannel = (props) => {
  const { location } = props;
  const { state } = location;
  const history = useHistory();
  const { user, isAuthenticated, setUserInfo } = useAuth();
  const firstRender = useRef(true);

  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [isDisabled, setDisabled] = useState(false);
  const [validationMessages, setValidationMessages] = useState(defaultValidationMessages);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertSeverity, setAlertSeverity] = useState(null);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const validationResult = validate({ name }, validationMessages);
    setValidationMessages(validationResult.newValidationMessages);
    setDisabled(!validationResult.isOk);
  }, [name]);

  if (!isAuthenticated) {
    return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
  }

  if (alertSeverity === 'info') {
    setTimeout(() => {
      if (state && state.from) {
        history.replace(state.from);
      } else {
        history.replace('/');
      }
    }, 0);
  }

  const registerChannel = () => {
    axios.post('https://localhost:5001/api/channels', { name, description })
      .then((response) => {
        if (response.status === 200) {
          setAlertSeverity('info');
          setAlertMessage('Поздравляю. Вы успешно создали канал');
          const { channel } = response.data;
          const userWithChannel = { ...user };
          userWithChannel.channel = channel;
          setUserInfo(userWithChannel);
        }
      })
      .catch((error) => {
        setAlertSeverity('error');
        const { response } = error;
        if (!response) {
          setAlertMessage('Запустите сервер, предоставляющий API');
        } else if (response.status === 500) {
          setAlertMessage('Внутренняя ошибка сервера. Проверьте бэк');
        } else if (response.status === 400) {
          const newValidationMessages = createValidationMessagesFromErrors(error.response.data, validationMessages);
          setValidationMessages(newValidationMessages);
        } else if (response.data.errors) {
          setAlertMessage(response.data.errors[0].description);
        }
      });
  };

  return (
    <Grid container direction="column" xs={9}>
      <h3>Создайте ваш канал, чтобы загружать видео</h3>
      <TextField
        label="Название"
        onChange={(e) => setName(e.target.value)}
        {...validationMessages.Name}
      />
      <TextField
        label="Описание"
        onChange={(e) => setDescription(e.target.value)}
      />
      {
        alertMessage ? (
          <Alert className="mt-3" severity={alertSeverity} onClose={() => setAlertMessage(null)}>
            {alertMessage}
          </Alert>
        ) : null
      }
      <Button
        color="primary"
        variant="contained"
        onClick={registerChannel}
        className="mt-3"
        disabled={isDisabled}
      >
        Создать канал
      </Button>
    </Grid>
  );
};

export default React.memo(RegisterChannel);

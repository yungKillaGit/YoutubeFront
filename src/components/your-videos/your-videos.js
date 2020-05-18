import React, { useEffect, useRef, useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';
import {
  Button, Grid, TextField,
} from '@material-ui/core';
import { loadProgressBar } from 'axios-progress-bar';
import axios from 'axios';
import { Alert } from '@material-ui/lab';
import { Redirect } from 'react-router-dom';
import TabPanel from '../tab-panel/tab-panel';
import VideoCapture from '../video-capture/video-capture';
import {
  createValidationMessages,
  createValidationMessagesFromErrors,
  validate,
} from '../../utils';
import 'axios-progress-bar/dist/nprogress.css';
import ImageCapture from '../image-capture/image-capture';
import { useAuth } from '../../context/auth';
import VideoCard from '../video-card/video-card';

const a11yProps = (index) => ({
  id: `simple-tab-${index}`,
  'aria-controls': `simple-tabpanel-${index}`,
});

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  smallText: {
    fontSize: '10px',
  },
}));

const defaultValidationMessages = createValidationMessages(['name']);

const YourVideos = (props) => {
  const firstRender = useRef(true);
  const {
    user, isAuthenticated, setUserInfo,
  } = useAuth();
  const classes = useStyles();
  const theme = useTheme();
  const [validationMessages, setValidationMessages] = useState(defaultValidationMessages);
  const [value, setValue] = useState(0);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertSeverity, setAlertSeverity] = useState(null);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const validationResult = validate({ name }, validationMessages);
    setValidationMessages(validationResult.newValidationMessages);
  }, [name]);

  if (!isAuthenticated) {
    return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
  }

  if (!user.channel) {
    return <Redirect to={{ pathname: '/register-channel', state: { from: props.location } }} />;
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const uploadVideo = () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('videoFile', videoFile);
    formData.append('videoPreview', videoPreview);
    formData.append('description', description);
    axios.post('https://localhost:5001/api/videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onDownloadProgress: () => {
        loadProgressBar();
      },
    }).then((response) => {
      if (response.status === 200) {
        const newUser = { ...user };
        const { video } = response.data;
        newUser.videos.push(video);
        setUserInfo(newUser);
        setAlertSeverity('info');
        setAlertMessage('Видео было успешно опубликовано');
      }
    }).catch((error) => {
      setAlertSeverity('error');
      const { response } = error;
      if (!response) {
        setAlertMessage('Запустите сервер, предоставляющий API');
      } else if (response.status === 500) {
        setAlertMessage('Внутренняя ошибка сервера. Проверьте бэк');
      } else if (response.status === 400) {
        let isVideoOk = true;
        response.data.forEach((eachError) => {
          if (eachError.propertyName === 'VideoFile' || error.propertyName === 'VideoPreview') {
            setAlertMessage(eachError.errorMessage);
            isVideoOk = false;
          }
        });
        if (!isVideoOk) {
          return;
        }
        const newValidationMessages = createValidationMessagesFromErrors(response.data, validationMessages);
        setValidationMessages(newValidationMessages);
      } else if (response.status === 401) {
        setAlertMessage('Срок действия вашего JWT токена истек. Залогиньтесь заново');
      } else if (response.data.errors) {
        setAlertMessage(response.data.errors[0].description);
      }
    });
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Ваши видео" {...a11yProps(0)} />
          <Tab label="Загрузка видео" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Grid container direction="column" xs={6}>
            {
              user.videos.map((video) => (
                <Grid container item direction="column" className="w-100 mb-2">
                  <VideoCard video={video} user={user} />
                </Grid>
              ))
            }
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Grid container direction="column">
            <div>Пока вы не опубликуете видео доступ к ним будет ограничен</div>
            <div><VideoCapture setVideo={setVideoFile} /></div>
            <div>
              <TextField
                label="Название"
                onChange={(e) => setName(e.target.value)}
                {...validationMessages.Name}
              />
            </div>
            <div className="mb-2">
              <TextField
                label="Описание"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <Grid container>
                <div className="mt-2">Выберите превью видео: </div>
                <ImageCapture mediaType="image" setImage={setVideoPreview} />
              </Grid>
            </div>
            <div className={classes.smallText}>Добавляя видео, вы принимаете Условия использования и правила сообщества Artur`s YouTube.</div>
            <div className={classes.smallText}>Также вы обязуетесь соблюдать авторские права и конфиденциальность данных других пользователей.</div>
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
              onClick={uploadVideo}
              className="mt-3"
            >
              Опубликовать видео
            </Button>
          </Grid>
        </TabPanel>
      </SwipeableViews>
    </div>
  );
};

export default React.memo(YourVideos);

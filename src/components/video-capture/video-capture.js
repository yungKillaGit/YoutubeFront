import React from 'react';
import { IconButton, makeStyles, Grid } from '@material-ui/core';
import PublishIcon from '@material-ui/icons/Publish';

const useStyles = makeStyles(() => ({
  input: {
    display: 'none',
  },
}));

const VideoCapture = ({ setVideo }) => {
  const classes = useStyles();
  const handleCapture = ({ target }) => {
    setVideo(target.files[0]);
  };
  return (
    <>
      <input
        accept="video/*"
        id="icon-button-video"
        onChange={handleCapture}
        type="file"
        className={classes.input}
      />
      <label htmlFor="icon-button-video">
        <Grid container>
          <div className="mt-2">Выберите видео со своего компьютера: </div>
          <IconButton color="primary" component="span">
            <PublishIcon />
          </IconButton>
        </Grid>
      </label>
    </>
  );
};

export default VideoCapture;

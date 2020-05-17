import React from 'react';
import { IconButton, makeStyles } from '@material-ui/core';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

const useStyles = makeStyles(() => ({
  input: {
    display: 'none',
  },
}));

const ImageCapture = ({ setImage }) => {
  const classes = useStyles();
  const handleCapture = ({ target }) => {
    setImage(target.files[0]);
  };
  return (
    <>
      <input
        accept="image/*"
        id="icon-button-photo"
        onChange={handleCapture}
        className={classes.input}
        type="file"
      />
      <label htmlFor="icon-button-photo">
        <IconButton color="primary" component="span">
          <PhotoCamera />
        </IconButton>
      </label>
    </>
  );
};

export default React.memo(ImageCapture);

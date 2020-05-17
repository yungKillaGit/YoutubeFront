import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import './home.css';
import VideoCard from '../video-card/video-card';

const Home = ({ videos }) => {
  const [alertMessage, setAlertMessage] = useState('');

  if (alertMessage) {
    return (
      <Alert className="mt-3" severity="error" onClose={() => setAlertMessage(null)}>
        {alertMessage}
      </Alert>
    );
  }

  return (
    <>
      <Grid container item direction="column" className="w-100">
        <Grid container item>
          {
            videos && videos.map((video) => (
              <Grid container item xs={3} className="mr-4 h-100 mb-3">
                <VideoCard video={video} user={video.user} />
              </Grid>
            ))
          }
        </Grid>
      </Grid>
    </>
  );
};

export default React.memo(Home);

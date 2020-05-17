import React from 'react';
import { Grid } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import { b64toBlob } from '../../utils';

const VideoCard = ({ video, user }) => {
  const previewBlob = b64toBlob(video.previewImage.encodedImage, video.previewImage.contentType);
  const videoUrl = URL.createObjectURL(previewBlob);
  let channelImageUrl = '';
  if (user.image) {
    const channelImageBlob = b64toBlob(user.image.encodedImage, video.previewImage.contentType);
    channelImageUrl = URL.createObjectURL(channelImageBlob);
  }

  return (
    <>
      <img src={videoUrl} className="w-100 h-25" />
      <Grid container item className="mt-3">
        <Grid container item direction="column" xs={1}>
          <div>
            {
              user.image ? (
                <img src={channelImageUrl} className="w-100" alt="" />
              ) : (
                <PersonIcon />
              )
            }
          </div>
        </Grid>
        <Grid container item direction="column" xs={10} className="ml-2">
          <h3>{video.name}</h3>
          <div>{user.channel.name}</div>
          <div>{`${video.views} просмотров`}</div>
          <div>{`${user.channel.channelSubscribers.length} подписчиков`}</div>
        </Grid>
      </Grid>
    </>
  );
};

export default React.memo(VideoCard);

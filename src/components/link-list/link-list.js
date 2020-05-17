import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';

const LinkList = (props) => {
  const { items, linkColor } = props;
  return (
    <>
      {items.map((item) => (
        <Grid container item className={item.class ? item.class : ''}>
          <Grid container item direction="column" xs={3} />
          <Grid container item direction="column" xs={9}>
            <Link to={item.route ? item.route : '/'} style={linkColor}>{item.text}</Link>
          </Grid>
        </Grid>
      ))}
    </>
  );
};

LinkList.propTypes = {
  items: PropTypes.instanceOf(Array).isRequired,
};

export default React.memo(LinkList);

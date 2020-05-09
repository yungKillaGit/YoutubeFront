import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Link } from '@material-ui/core';

const LinkList = (props) => {
  const { items } = props;
  return (
    <>
      {items.map((item) => (
        <Grid container item className={item.class ? item.class : ''}>
          <Grid container item direction="column" xs={3}/>
          <Grid container item direction="column" xs={9}>
            <Link href="/#">{item.text}</Link>
          </Grid>
        </Grid>
      ))}
    </>
  );
};

LinkList.propTypes = {
  items: PropTypes.instanceOf(Array).isRequired,
};

export default LinkList;

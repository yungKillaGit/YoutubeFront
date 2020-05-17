import React from 'react';
import { Grid } from '@material-ui/core';
import Header from '../header/header';
import Sidebar from '../sidebar/sidebar';
import './layout.css';

const Layout = ({ children }) => (
  <>
    <Header />
    <Grid container wrap="nowrap" justify="space-between" className="wrap-hole">
      <Sidebar />
      <section className="container__main w-100 ml-5">
        {children}
      </section>
    </Grid>
  </>
);

export default React.memo(Layout);

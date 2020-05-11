import React from 'react';
import { Grid } from '@material-ui/core';
import Header from '../header/header';
import Sidebar from '../sidebar/sidebar';
import './home.css';

const Home = () => {
  return (
    <>
      <Header/>
      <Grid container wrap="nowrap" justify="space-between" className="wrap-hole">
        <Sidebar/>
        <section className="container__main">
          <header className="ml-3">
            <h1>Видео</h1>
          </header>
          <Grid container item justify="space-around">
            {[...Array(16)].map(() => (
              <div className="square"/>
            ))}
          </Grid>
        </section>
      </Grid>
    </>
  );
};

export default Home;

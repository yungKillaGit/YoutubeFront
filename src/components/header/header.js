import React from 'react';
import {
  Grid,
  CardMedia,
  TextField,
  makeStyles,
  Avatar,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import logo from '../images/logo.png';

const useStyles = makeStyles(() => ({
  root: {
    flex: '1 0 auto',
  },
}));

const Header = () => {
  const classes = useStyles();

  return (
    <header className="mt-3 ml-3 mr-3">
      <Grid container justify="space-between" wrap="nowrap" className={classes.root}>
        <Grid container item xs={3}>
          <Grid item direction="column" xs={3}>
            <MenuIcon/>
          </Grid>
          <Grid item direction="column" xs={9}>
            <CardMedia image={logo} className="w-25 h-50"/>
          </Grid>
        </Grid>
        <Grid container item xs={6}>
          <Grid item xs={10}>
            <TextField placeholder="Введите запрос" fullWidth/>
          </Grid>
          <Grid item xs={2}>
            <IconButton type="submit" aria-label="search">
              <SearchIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Grid container item xs={3} justify="flex-end">
          <Avatar>A</Avatar>
        </Grid>
      </Grid>
    </header>
  );
};

export default Header;

import React from 'react';
import { Grid } from '@material-ui/core';
import LinkList from '../link-list/link-list';
import './sidebar.css';
import { getMainLinks, getFooterLinks } from '../../utils';

const mainLinks = getMainLinks();
const footerLinks = getFooterLinks();

const Sidebar = () => (
  <Grid container wrap="nowrap" direction="column" className="vertical-nav-bar w-100" xs={3}>
    <LinkList items={mainLinks} linkColor={{ color: 'black' }} />
    <Grid component="footer" container direction="column">
      <LinkList items={footerLinks} linkColor={{ color: 'darkgray' }} />
    </Grid>
  </Grid>
);

export default Sidebar;

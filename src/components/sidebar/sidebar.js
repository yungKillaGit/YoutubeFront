import React from 'react';
import { Grid } from '@material-ui/core';
import LinkList from '../link-list/link-list';
import './sidebar.css';
import { getMainLinks, getFooterLinks } from '../../utils';

const mainLinks = getMainLinks();
const footerLinks = getFooterLinks();

const Sidebar = () => (
  <Grid container wrap="nowrap" direction="column" className="vertical-nav-bar w-100">
    <LinkList items={mainLinks} />
    <Grid component="footer" container direction="column">
      <LinkList items={footerLinks} />
    </Grid>
  </Grid>
);

export default Sidebar;

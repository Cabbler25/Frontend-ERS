import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { List, ListItem } from '@material-ui/core';
import { Link } from 'react-router-dom';
import userIco from '../assets/icons/user.png';
import RefreshCookies from '../utils/SessionCookies';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    textAlign: 'center',
  },
  leftToolbar: {
    flexWrap: 'nowrap',
    marginLeft: 70,
    marginRight: 'auto',
  },
  rightToolbar: {
    marginLeft: 'auto',
    marginRight: 10,
  },
}));

export default function ButtonAppBar() {
  const classes = useStyles();
  RefreshCookies();
  return (
    <div className={classes.root}>
      <AppBar style={{ display: 'inline-block' }} position="static" color="default">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            <Typography variant="h4">
              ERS
            </Typography>
          </Button>
          <List>
            <ListItem>
              <Button color="inherit" component={Link} to="/users">Users</Button>
              <Button color="inherit" component={Link} to="/reimbursements">Reimbursements</Button>
            </ListItem >
          </List>
          <div className={classes.rightToolbar}>
            <List>
              <ListItem>
                <Button color="inherit" component={Link} to="/login">Login</Button>
                <Button component={Link} to="/user"><img className="center" src={userIco} alt="Logo" /></Button>
              </ListItem >
            </List>
          </div>
        </Toolbar>
      </AppBar>
    </div >
  );
}
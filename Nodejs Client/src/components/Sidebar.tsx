import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import { Link } from 'react-router-dom';
import { Divider, Button } from '@material-ui/core';
import userIco from '../assets/icons/user-large.png';
import { ParseUserCookie } from '../utils/SessionCookies';

export default class Sidebar extends React.Component<any, any> {
  render() {
    return (
      <div
        role="presentation"
        onClick={() => this.props.handleClose()}
        onKeyDown={() => this.props.handleClose()}
      >
        <Drawer open={this.props.open} onClose={() => this.props.handleClose()}>
          <h2 style={{ textAlign: 'center', paddingTop: '25px' }}>
            ERS
          </h2>
          {ParseUserCookie() ?
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <img style={{ display: 'inline-block', margin: '0px auto 0px auto' }} src={userIco} alt="Logo" />
              <Button fullWidth={true} color='inherit' component={Link} to="/user">My Profile</Button>
            </div>
            : <Button fullWidth={true} style={{ marginBottom: '20px' }} color="inherit" component={Link} to="/login">Login</Button>}
          <Divider variant='fullWidth' />
          <div style={{ textAlign: 'center' }}>
            <Button style={{ marginTop: '20px' }} fullWidth={true} color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button style={{ marginTop: '15px' }} fullWidth={true} color="inherit" component={Link} to="/users">
              Users
            </Button>
            <Button style={{ marginTop: '15px' }} fullWidth={true} color="inherit" component={Link} to="/reimbursements">
              Reimbursements
            </Button>
          </div>
          <div style={{ margin: 'auto 0px 0px 0px' }}>
            <Divider variant='fullWidth' />
            {ParseUserCookie() ?
              <Button fullWidth={true} style={{ marginTop: '20px', marginBottom: '20px' }} color="inherit" component={Link} to="/logout">Logout</Button>
              : ''}
          </div>
        </Drawer >
      </div >
    );
  }
}
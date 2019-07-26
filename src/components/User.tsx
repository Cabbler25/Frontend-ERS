import React from 'react';
import Cookies from 'js-cookie';
import RefreshCookies, { parseUserCookie } from '../utils/SessionCookies';
import { Button, List, ListItem, ListItemText, Divider } from '@material-ui/core';
import userIco from '../icons/user-large.png';
import { Redirect } from 'react-router';
import ChangePasswordForm from './ChangePasswordForm';

export default class User extends React.Component<any, any> {
  user = parseUserCookie();
  constructor(props: any) {
    super(props);
    this.state = {
      open: false,
      userId: 0
    }
  }

  handleClickOpen(event: any, id: number) {
    this.setState({
      open: true,
      userId: id
    });
  }

  render() {
    const dividerFullWidth = {
      marginLeft: '0.5px'
    }
    return (
      <div style={{ textAlign: "center" }}>
        {RefreshCookies()}
        {!this.user ? <Redirect to="/login" /> :
          <div>
            <ChangePasswordForm open={this.state.open} userId={this.state.userId} />
            <div>
              <img className="center" src={userIco} alt="Logo" />
            </div>
            <div><h2>Profile</h2></div>
            <div style={{ marginTop: '-18px', marginBottom: '6px', textAlign: 'center' }}>
              <List style={{ display: 'inline-block' }}>
                <ListItem>
                  <ListItemText primary="Username" secondary={this.user.username} />
                </ListItem>
                <Divider variant="inset" component="li" style={dividerFullWidth} />
                <ListItem>
                  <ListItemText primary="Full Name" secondary={`${this.user.firstName} ${this.user.lastName}`} />
                </ListItem>
                <Divider variant="inset" component="li" style={dividerFullWidth} />
                <ListItem>
                  <ListItemText primary="Email" secondary={this.user.email} />
                </ListItem>
                <Divider variant="inset" component="li" style={dividerFullWidth} />
                <ListItem>
                  <ListItemText primary="Role" secondary={this.getRole(this.user.role)} />
                </ListItem>
                <Divider variant="inset" component="li" style={dividerFullWidth} />
              </List>
            </div>
            <div>
              <Button color="inherit" onClick={() => this.handleClickOpen(undefined, this.user.id)}>
                Change Password</Button><br />
              <Button color="inherit" onClick={() => {
                Cookies.remove('user');
                Cookies.remove('permissions');
                this.props.history.push("/logout");
              }}>Logout</Button>
            </div>
          </div >
        }
      </div >
    )
  }

  getRole(id: number) {
    return id == 1 ? 'Admin' : id == 2 ? 'Manager' : 'User';
  }
}

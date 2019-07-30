import React from 'react';
import RefreshCookies, { ParseUserCookie } from '../utils/SessionCookies';
import { Button, List, ListItem, ListItemText, Divider, Paper } from '@material-ui/core';
import userIco from '../assets/icons/user-large.png';
import { Redirect } from 'react-router';
import ChangePasswordForm from '../forms/ChangePasswordForm';

export class User extends React.Component<any, any> {
  user = ParseUserCookie();
  constructor(props: any) {
    super(props);
    this.state = {
      open: false,
      userId: 0
    }
  }

  handleClickOpen() {
    this.setState({
      open: true,
      userId: ParseUserCookie().id
    });
  }

  render() {
    const dividerFullWidth = {
      marginLeft: '0.5px'
    }
    return (
      <div style={{ textAlign: "center" }}>
        {RefreshCookies()}
        {!this.user ? <Redirect push to="/login" /> :
          <div>
            <Paper style={{ display: 'inline-block', padding: '40px' }}>

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
                    <ListItemText primary="Name" secondary={`${this.user.firstName} ${this.user.lastName}`} />
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
                <Button color="inherit" onClick={() => this.handleClickOpen()}>
                  Change Password</Button><br />
                <Button color="inherit" onClick={() => {
                  this.props.history.push("/logout");
                }}>Logout</Button>
              </div>
            </Paper>
          </div >
        }
      </div >
    )
  }

  getRole(id: number) {
    return id == 1 ? 'Admin' : id == 2 ? 'Manager' : 'User';
  }
}

export default User;

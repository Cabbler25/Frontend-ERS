import React from 'react';
import { Button, List, ListItem, ListItemText, Divider, Paper } from '@material-ui/core';
import userIco from '../assets/icons/user-large.png';
import { Redirect } from 'react-router';
import ChangePasswordForm from '../forms/ChangePasswordForm';
import { IUserState, IState } from '../utils';
import { connect } from 'react-redux';

interface IUserProps {
  user: IUserState;
  history: any;
}

export class User extends React.Component<IUserProps, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      open: false,
      userId: 0
    }
  }

  render() {
    const dividerFullWidth = {
      marginLeft: '0.5px'
    }
    return (
      <div style={{ textAlign: "center" }}>
        {!this.props.user.token ? <Redirect push to="/login" /> :
          <div>
            <Paper style={{ display: 'inline-block', padding: '40px' }}>
              <ChangePasswordForm closeParent={() => this.handleClose()} open={this.state.open} userId={this.state.userId} />
              <div>
                <img className="center" src={userIco} alt="Logo" />
              </div>
              <div><h2>Profile</h2></div>
              <div style={{ marginTop: '-18px', marginBottom: '6px', textAlign: 'center' }}>
                <List style={{ display: 'inline-block' }}>
                  <ListItem>
                    <ListItemText primary="Username" secondary={this.props.user.username} />
                  </ListItem>
                  <Divider variant="inset" component="li" style={dividerFullWidth} />
                  <ListItem>
                    <ListItemText primary="Name" secondary={`${this.props.user.firstName} ${this.props.user.lastName}`} />
                  </ListItem>
                  <Divider variant="inset" component="li" style={dividerFullWidth} />
                  <ListItem>
                    <ListItemText primary="Email" secondary={this.props.user.email} />
                  </ListItem>
                  <Divider variant="inset" component="li" style={dividerFullWidth} />
                  <ListItem>
                    <ListItemText primary="Role" secondary={this.props.user.role.role} />
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

  handleClickOpen() {
    this.setState({
      open: true,
      userId: this.props.user.id
    });
  }

  handleClose() {
    this.setState({
      open: false
    })
  }
}

const mapStateToProps = (state: IState) => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(User);

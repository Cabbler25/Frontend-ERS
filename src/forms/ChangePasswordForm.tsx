import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Divider, DialogContentText } from '@material-ui/core';
import Cookies from 'js-cookie';

export default class ChangePasswordForm extends React.Component<any, any> {
  userCookie = Cookies.getJSON('user');
  constructor(props: any) {
    super(props);
    this.state = {
      open: this.props.open,
      id: this.props.userId,
      successPromptOpen: false,
      errorPwField: false,
      errorConfirmField: false,
      password: '',
      passwordConfirm: '',
      errorPwTxt: '',
      errorConfirmTxt: ''
    }
  }

  render() {
    return (
      <div>
        <Dialog
          open={this.state.open} onClose={() => this.handleClose()}
          aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Change Password</DialogTitle>
          <Divider variant='fullWidth' />
          <div style={{ height: '25px' }}></div>
          <DialogContent>
            <div onKeyPress={(e: any) => {
              if (e.key === 'Enter') {
                this.handleSubmit(e);
              }
            }}>
              {this.getPwField()}
              <br />
              {this.getConfirmField()}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleClose()} color="inherit">
              Cancel
              </Button>
            <Button onClick={(event) => this.handleSubmit(event)} color="inherit">
              Submit
              </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.successPromptOpen}
          onClose={() => this.handleSuccessPromptClose()}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">{"Success!"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Password updated.
          </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleSuccessPromptClose()} color="inherit" autoFocus>
              OK
          </Button>
          </DialogActions>
        </Dialog>
      </div >
    );
  }

  handleSuccessPromptClose() {
    this.setState({
      successPromptOpen: false
    })
  }

  handleClose() {
    this.setState({
      open: false,
      errorPwField: false,
      errorConfirmField: false
    })
  }

  handleInputChange(event: any) {
    this.setState({
      [event.target.id]: event.target.value,
      errorPwField: false,
      errorConfirmField: false
    });
  }

  handleSubmit(event: any) {
    const data = this.state;
    const errorPw = data.password === '';
    const errorConfirm = data.password != data.passwordConfirm;
    if (errorPw || errorConfirm) {
      this.setState({
        errorPwField: errorPw,
        errorConfirmField: errorConfirm
      })
    } else {
      this.updatePassword();
      this.setState({
        successPromptOpen: true,
        errorPwField: false,
        errorConfirmField: false
      })
      this.handleClose();
    }
  }

  componentWillReceiveProps(nextProps: any) {
    this.setState({
      open: nextProps.open,
      id: nextProps.userId ? nextProps.userId : this.state.id
    });
  }

  async updatePassword(): Promise<any> {
    try {
      const response = await fetch(`/users`, {
        method: 'PATCH',
        body: JSON.stringify({ id: this.state.id, password: this.state.password }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const data = await response.json();
      if (!data) return undefined;
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
          this.setState({ ...this.state, data });
        }, 600);
      });
      // this.setState({ ...this.state, data });
      // return data;
    } catch (err) {
      console.log(err);
      alert('Update password failed.');
      return undefined;
    }
  }

  getPwField = () => {
    return (
      !this.state.errorPwField ?
        <TextField
          variant="outlined"
          onChange={(event) => this.handleInputChange(event)
          }
          margin="dense"
          id="password"
          label="New password"
          type="password" />
        :
        <TextField
          error
          variant="outlined"
          onChange={(event) => this.handleInputChange(event)}
          margin="dense"
          id="password"
          label="New password"
          type="password"
          helperText={this.state.errorPwTxt} />
    );
  }

  getConfirmField = () => {
    return (
      !this.state.errorConfirmField ?
        <TextField
          variant="outlined"
          onChange={(event) => this.handleInputChange(event)}
          margin="dense"
          id="passwordConfirm"
          label="Confirm password "
          type="password" />
        :
        <TextField
          error
          variant="outlined"
          onChange={(event) => this.handleInputChange(event)}
          margin="dense"
          id="passwordConfirm"
          label="Confirm password "
          type="password"
          helperText={this.state.errorConfirmTxt}
        />
    );
  }
}
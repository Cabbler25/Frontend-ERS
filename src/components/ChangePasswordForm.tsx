import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Divider } from '@material-ui/core';
import Cookies from 'js-cookie';

export default class ChangePasswordForm extends React.Component<any, any> {
  userCookie = Cookies.getJSON('user');
  constructor(props: any) {
    super(props);
    this.state = {
      open: false,
      id: this.userCookie ? this.userCookie.id : 0,
      matching: true,
      passwordMissing: false,
      password: '',
      passwordConfirm: '',
      missinedPwTxt: '',
      notMatchingTxt: ''
    }
  }

  handleClose() {
    this.setState({
      open: false,
      matching: true,
      passwordMissing: false,
      txt: '',
      missinedPwTxt: ''
    })
  }

  handleInputChange(event: any) {
    this.setState({
      [event.target.id]: event.target.value,
      matching: true,
      passwordMissing: false,
      txt: '',
      missinedPwTxt: ''
    });
  }

  handleSubmit(event: any) {
    // event.preventDefault();
    const data = this.state;
    if (data.password === '') {
      this.setState({
        passwordMissing: true,
        missinedPwTxt: 'Missing field'
      })
    } else if (data.password != data.passwordConfirm) {
      this.setState({
        matching: false,
        txt: 'Not matching'
      })
    } else {
      this.updatePassword();
      this.handleClose();
    }
  }

  async updatePassword(): Promise<any> {
    try {
      const response = await fetch('/users', {
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

  componentWillReceiveProps(nextProps: any) {
    this.setState({
      open: nextProps.open,
      id: nextProps.userId ? nextProps.userId : this.state.id
    });
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
              {this.state.passwordMissing ? this.getErrorPwField() : this.getNormalPwField()}
              <br />
              {this.state.matching ? this.getNormalConfirmField() : this.getErrorConfirmField()}
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
      </div >
    );
  }

  getNormalPwField = () => {
    return <TextField
      variant="outlined"
      onChange={(event) => this.handleInputChange(event)}
      margin="dense"
      id="password"
      label="New password"
      type="password"
    />
  }

  getErrorPwField = () => {
    return <TextField
      error
      variant="outlined"
      onChange={(event) => this.handleInputChange(event)}
      margin="dense"
      id="password"
      label="New password"
      type="password"
      helperText={this.state.missinedPwTxt}
    />
  }

  getNormalConfirmField = () => {
    return <TextField
      variant="outlined"
      onChange={(event) => this.handleInputChange(event)}
      margin="dense"
      id="passwordConfirm"
      label="Confirm password "
      type="password"
      helperText={this.state.notMatchingTxt}
    />
  }

  getErrorConfirmField = () => {
    return <TextField
      error
      variant="outlined"
      onChange={(event) => this.handleInputChange(event)}
      margin="dense"
      id="passwordConfirm"
      label="Confirm password "
      type="password"
      helperText={this.state.txt}
    />
  }
}
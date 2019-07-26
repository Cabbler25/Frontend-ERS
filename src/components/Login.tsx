import * as React from 'react';
import { Formik, Form, Field, FieldProps } from 'formik';
import { Button, TextField } from '@material-ui/core';
import Cookies from 'js-cookie';
import { Redirect } from 'react-router';
import { inFiveMinutes, parseUserCookie } from '../utils/SessionCookies';
import { TextFieldProps } from 'material-ui';

export default class LoginForm extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      usrnameError: false,
      pwError: false,
      username: '',
      password: '',
      errorUsernameFieldTxt: '',
      errorPwFieldTxt: ''
    }
  }

  handleInputChange(event: any) {
    this.setState({
      [event.target.id]: event.target.value,
      usrnameError: false,
      pwError: false
    });
  }

  handleSubmit(event: any) {
    // event.preventDefault();
    const data = this.state;
    if (data.username === '') {
      this.setState({
        usrnameError: true,
        errorUsernameFieldTxt: 'Missing field'
      });
    }
    if (data.password === '') {
      this.setState({
        pwError: true,
        errorPwFieldTxt: 'Missing field'
      });
    }
    if ((data.username != '') && (data.password != '')) this.logIn();
  }

  async logIn(): Promise<any> {
    try {
      const response = await fetch('/login', {
        method: 'post',
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })
      const data = await response.json();
      const err = 'Invalid Credentials';
      if (data != err) {
        const cookies: any = document.cookie
          .split(';')
          .reduce((res, c) => {
            let [key, val] = c.trim().split('=').map(decodeURIComponent)
            try {
              return Object.assign(res, { [key]: JSON.parse(val) })
            } catch (e) {
              return Object.assign(res, { [key]: val })
            }
          }, {});
        delete data.password;
        Cookies.set('user', cookies.user, {
          expires: inFiveMinutes
        });
        Cookies.set('permissions', cookies.permissions, {
          expires: inFiveMinutes
        });
        this.props.history.push("/user");
      } else throw err
    } catch (err) {
      this.setState({
        usrnameError: true,
        pwError: true,
        errorUsernameFieldTxt: '',
        errorPwFieldTxt: 'Invalid username or password'
      });
    }
  }

  render() {
    return (
      <div style={{ textAlign: "center", paddingTop: "100px" }}>
        {parseUserCookie() ? <Redirect to="/user" /> :
          <div>
            <h2 style={{ marginTop: '-15px', marginBottom: '30px' }}>Welcome</h2>
            <div onKeyPress={(e: any) => {
              if (e.key === 'Enter') {
                this.handleSubmit(e);
              }
            }}>
              {this.state.usrnameError ? this.getErrorUsernameField() : this.getUsernameField()}
              <div style={{ marginTop: '-11.5px' }}><br /></div>
              {this.state.pwError ? this.getErrorPwField() : this.getPwField()}
            </div>
            <br />
            <Button style={{ marginTop: '-5px' }} onClick={(event) => this.handleSubmit(event)} color="inherit">
              Login
            </Button>
          </div>
        }
      </div>
    );
  }

  getUsernameField() {
    return <TextField
      id="username"
      onChange={(e: any) => this.handleInputChange(e)}
      variant="outlined"
      placeholder='username'
    />;
  }

  getErrorUsernameField() {
    return <TextField
      error
      id="username"
      onChange={(e: any) => this.handleInputChange(e)}
      variant="outlined"
      placeholder='username'
      helperText={this.state.errorUsernameFieldTxt}
    />;
  }

  getPwField() {
    return <TextField
      id="password"
      onChange={(e: any) => this.handleInputChange(e)}
      type="password"
      variant="outlined"
      placeholder='password'
    />;
  }

  getErrorPwField() {
    return <TextField
      error
      id="password"
      onChange={(e: any) => this.handleInputChange(e)}
      type="password"
      variant="outlined"
      placeholder='password'
      helperText={this.state.errorPwFieldTxt}
    />;
  }
}



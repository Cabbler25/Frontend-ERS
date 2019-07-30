import * as React from 'react';
import { Button, TextField, Paper } from '@material-ui/core';
import Cookies from 'js-cookie';
import { Redirect } from 'react-router';
import { ParseUserCookie } from '../utils/SessionCookies';
import { IUserState, IState } from '../utils';
import { connect } from "react-redux";
import { updateUserSession } from '../utils/actions';

interface IUserProps {
  user: IUserState,
  updateUserSession: (v: boolean, n: string) => void,
  history: any
}
export class Login extends React.Component<IUserProps, any> {
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

  render() {
    return (
      <div style={{ textAlign: "center", paddingTop: "100px" }}>
        {ParseUserCookie() ? <Redirect push to="/user" /> :
          <div>
            <Paper style={{ display: 'inline-block', padding: '40px' }}>
              <h2>Welcome</h2>
              <div onKeyPress={(e: any) => {
                if (e.key === 'Enter') {
                  this.handleSubmit();
                }
              }}>
                {this.getUsernameField()}
                <div style={{ marginTop: '-11.5px' }}><br /></div>
                {this.getPwField()}
              </div>
              <br />
              <Button style={{ marginTop: '-5px' }} onClick={() => this.handleSubmit()} color="inherit">
                Login
              </Button>
            </Paper>
          </div>
        }
      </div>
    );
  }

  handleInputChange(event: any) {
    this.setState({
      [event.target.id]: event.target.value,
      usrnameError: false,
      pwError: false
    });
  }

  handleSubmit() {
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
        Cookies.set('user', cookies.user);
        Cookies.set('permissions', cookies.permissions);
        this.props.updateUserSession(true, ParseUserCookie().firstName);
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

  getUsernameField() {
    return (
      !this.state.usrnameError ?
        <TextField
          id="username"
          onChange={(e: any) => this.handleInputChange(e)}
          variant="outlined"
          placeholder='username'
        /> :
        <TextField
          error
          id="username"
          onChange={(e: any) => this.handleInputChange(e)}
          variant="outlined"
          placeholder='username'
          helperText={this.state.errorUsernameFieldTxt}
        />
    );
  }

  getPwField() {
    return (
      !this.state.pwError ?
        <TextField
          id="password"
          onChange={(e: any) => this.handleInputChange(e)}
          type="password"
          variant="outlined"
          placeholder='password' />
        :
        <TextField
          error
          id="password"
          onChange={(e: any) => this.handleInputChange(e)}
          type="password"
          variant="outlined"
          placeholder='password'
          helperText={this.state.errorPwFieldTxt} />
    );
  }

}

// This function will convert state-store values to
// component properties
const mapStateToProps = (state: IState) => {
  return {
    user: state.user
  }
}

// This object definition will be used to map action creators to
// properties
const mapDispatchToProps = {
  updateUserSession: updateUserSession 
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);



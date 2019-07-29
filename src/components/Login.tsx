import * as React from 'react';
import { Button, TextField, Container, Paper, makeStyles, Theme, createStyles } from '@material-ui/core';
import Cookies from 'js-cookie';
import { Redirect } from 'react-router';
import { ParseUserCookie } from '../utils/SessionCookies';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3, 2),
    },
  }),
);

export default class LoginForm extends React.Component<any, any> {
  // classes = useStyles();
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


  // {this.state.usrnameError ? this.getErrorUsernameField() : this.getUsernameField()}
  // {this.state.pwError ? this.getErrorPwField() : this.getPwField()}

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



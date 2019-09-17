import * as React from 'react';
import { Button, TextField, Paper } from '@material-ui/core';
import { Redirect } from 'react-router';
import { IUserState, IState } from '../utils';
import { connect } from "react-redux";
import { updateUserSession } from '../utils/actions';

interface IUserProps {
  user: IUserState,
  updateUserSession: (payload: any) => void,
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
        {this.props.user.token ? <Redirect push to="/user" /> :
          <div>
            <Paper style={{ display: 'inline-block', padding: '40px' }}>
              <h2>Welcome</h2>
              <div onKeyPress={(e: any) => {
                if (e.key == 'Enter') {
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
    if (data.username == '') {
      this.setState({
        usrnameError: true,
        errorUsernameFieldTxt: 'Missing field'
      });
    }
    if (data.password == '') {
      this.setState({
        pwError: true,
        errorPwFieldTxt: 'Missing field'
      });
    }
    if ((data.username !== '') && (data.password !== '')) this.logIn();
  }

  async logIn(): Promise<any> {
    try {
      const response = await fetch('/user/login', {
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
      if (data !== err) {
        this.props.updateUserSession(data);
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

const mapStateToProps = (state: IState) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = {
  updateUserSession: updateUserSession
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);



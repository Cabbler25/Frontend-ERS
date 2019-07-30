import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { List, ListItem, Icon } from '@material-ui/core';
import { Link } from 'react-router-dom';
import userIco from '../assets/icons/user.png';
import RefreshCookies from '../utils/SessionCookies';
import { IState, IUserState } from '../utils';
import { connect } from 'react-redux';
import { IsMobile } from '../utils/MobileSpecs';
import Sidebar from './Sidebar';

const styles = {
  rightToolbar: { marginLeft: 'auto', marginRight: '-15px' },
  leftToolbar: {},
  navUser: {
    desktop: {
      nameStyle: {
        textTransform: "initial"
      }
    },
    mobile: {
      nameStyle: {
        textTransform: "initial"
      }
    }
  }
}

interface INaveProps {
  user: IUserState,
}

export class NavBar extends React.Component<INaveProps, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      showSidebar: false,
    }
  }
  render() {
    return (
      <div style={{ textAlign: 'center', }}>
        {RefreshCookies()}
        <Sidebar open={this.state.showSidebar} handleClose={() => this.closeSidebar()} />
        <AppBar style={{ display: 'inline-block' }} position="static" color="default">
          <Toolbar>
            {IsMobile() ?
              <div>
                <Button
                  style={{ maxWidth: '40px', minWidth: '40px' }}
                  onClick={() => {
                    this.setState({
                      showSidebar: true
                    })
                  }}
                >
                  <Icon style={{ fontSize: 30 }}>view_headline</Icon>
                </Button>
                <Button color="inherit" component={Link} to="/">
                  <Typography variant="h5">ERS</Typography>
                </Button>
              </div>
              :
              <div>
                <Button color="inherit" component={Link} to="/">
                  <Typography variant='h4'>ERS</Typography>
                </Button>
              </div>
            }
            {!IsMobile() ?
              <List>
                <ListItem>
                  <Button color="inherit" component={Link} to="/users">Users</Button>
                  <Button color="inherit" component={Link} to="/reimbursements">Reimbursements</Button>
                </ListItem >
              </List>
              // Render side bar
              : ''}
            <div style={styles.rightToolbar}>
              <List>
                <ListItem>
                  {!this.props.user.loggedIn ?
                    <Button color="inherit" component={Link} to="/login">Login</Button>
                    :
                    <Button color="inherit" component={Link} to="/logout">Logout</Button>
                  }
                  <Button component={Link} to="/user"><img className="center" src={userIco} alt="Logo" /></Button>
                </ListItem>
              </List>
            </div>
          </Toolbar>
        </AppBar>
      </div >
    );
  }

  /* < div >
    {console.log(this.props.user.name)}
    <ListItem>
      <Button color="inherit" component={Link} to="/logout">Logout</Button>
      <Button
        style={{
          margin: '-5.5px 0px -5.5px 0px',
          minWidth: '80px',
          maxWidth: '80px',
          minHeight: '60px',
          maxHeight: '60px',
          textAlign: 'center'
        }}
        component={Link} to="/user">
        <figure>
          <img style={{ marginBottom: '-10px' }} className="center" src={userIco} alt="usrico" />
          <figcaption style={{ textTransform: "initial" }}>
            {this.props.user.name}
          </figcaption>
        </figure>
      </Button>
    </ListItem >
  </div>} */

  closeSidebar() {
    this.setState({
      showSidebar: false
    });
  }
}

const mapStateToProps = (state: IState) => {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps)(NavBar);
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { List, ListItem, Icon } from '@material-ui/core';
import { Link } from 'react-router-dom';
import userIco from '../assets/icons/user.png';
import RefreshCookies from '../utils/SessionCookies';
import { IState, IUserState, IScreenState } from '../utils';
import { connect } from 'react-redux';
import Sidebar from './Sidebar';
import { updateScreen } from '../utils/actions';

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

interface INavProps {
  user: IUserState,
  ui: IScreenState,
  updateScreen: (val: boolean) => void
}

export class NavBar extends React.Component<INavProps, any> {
  mediaQuery: any;
  constructor(props: any) {
    super(props);
    this.mediaQuery = window.matchMedia('(min-width: 700px)');
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
            {!this.props.ui.isLargeScreen ?
              // Render sidebar
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
            {this.props.ui.isLargeScreen ?
              <List>
                <ListItem>
                  <Button color="inherit" component={Link} to="/users">Users</Button>
                  <Button color="inherit" component={Link} to="/reimbursements">Reimbursements</Button>
                </ListItem >
              </List>
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

  componentDidMount() {
    this.mediaQuery.addListener((mq: any) => {
      this.props.updateScreen(!this.props.ui.isLargeScreen);
    });
  }

  closeSidebar() {
    this.setState({
      showSidebar: false
    });
  }
}

const mapStateToProps = (state: IState) => {
  return {
    user: state.user,
    ui: state.ui
  }
}

const mapDispatchToProps = {
  updateScreen: updateScreen
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
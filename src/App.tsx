import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import backgroundImg from './assets/backgrounds/21.jpg';
import Nav from './components/Navbar';
import Users from './components/Users';
import Home from './components/Home';
import Reimbursements from './components/Reimbursements';
import User from './components/User';
import Login from './components/Login';
import Logout from './components/Logout';
import { Z_FIXED } from 'zlib';

const bgStyle = {
  /* Set rules to fill background */
  minHeight: '100%',
  minWidth: '1024px',

  /* Set up proportionate scaling */
  width: '100 %',
  height: 'auto',

  /* Set up positioning */
  top: 0,
  left: 0,

  backgroundImage: `url(${backgroundImg})`,
  backgroundSize: 'cover'
};

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Nav />
        <br />
        <Route path="/" exact component={Home} />
        <Route path="/users" exact component={Users} />
        <Route path="/login" exact component={Login} />
        <Route path="/logout" exact component={Logout} />
        <Route path="/user" exact component={User} />
        <Route path="/reimbursements" exact component={Reimbursements} />
      </div >
    </Router>
  );
}

export default App;
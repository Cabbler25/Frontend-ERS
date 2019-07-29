import React from 'react';
import MaterialTable from 'material-table';
import { Button, Theme, makeStyles, createStyles } from '@material-ui/core';
import RefreshCookies, { ParsePermissionCookie, ParseUserCookie, UpdateCookies, HasPermissions } from '../utils/SessionCookies';
import { Redirect } from 'react-router';
import ChangePasswordForm from './ChangePasswordForm';

export default class Users extends React.Component<any, any> {
  classes = () => {
    makeStyles((theme: Theme) =>
      createStyles({
        root: {
          color: theme.palette.text.primary,
        },
        icon: {
          margin: theme.spacing(1),
          fontSize: 32,
        },
      }),
    );
  }
  constructor(props: any) {
    super(props);
    this.state = {
      open: false,
      userId: 0,
      columns: [
        { title: 'ID', field: 'id', editable: 'never' },
        { title: 'Username', field: 'username' },
        { title: 'First', field: 'firstName' },
        { title: 'Last', field: 'lastName' },
        { title: 'Email', field: 'email' },
        {
          title: 'Role', field: 'role',
          lookup: { 1: 'Admin', 2: 'Finance Manager', 3: 'User' },
        },
      ],
      data: [],
    }
  }

  render() {
    return (
      <div>
        {RefreshCookies()}
        <ChangePasswordForm open={this.state.open} userId={this.state.userId} />
        {/*{this.isRole('user') ? <Redirect push to="/user" /> : !ParseUserCookie() ? <Redirect push to="/login" /> :*/}
        {!ParseUserCookie() ? <Redirect push to="/login" /> :
          <div>
            {/* <div style={{ textAlign: 'center' }}>
              <Button style={{ marginBottom: '15px' }} variant="contained" color="inherit" onClick={() => this.getAllUsers()}>
                Fetch Users</Button>
            </div> */}
            <div style={{ textAlign: 'center' }}>
              {HasPermissions('admin') ? this.getAdminTable() : HasPermissions('finance-manager') ? this.getManagerTable() : this.getUserTable()}
            </div>
          </div>
        }
      </div >
    );
  }

  componentDidMount() {
    if (HasPermissions('finance-manager')) {
      this.getAllUsers();
    } else if (ParseUserCookie()) {
      this.getUserById(ParseUserCookie().id);
    }
  }

  handleClickOpen(event: any, id: number) {
    this.setState({
      open: true,
      userId: id
    });
  }

  async getAllUsers(): Promise<any> {
    try {
      const response = await fetch('/users', { method: 'get' });
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const data = await response.json();
      this.setState({ ...this.state, data });
    } catch (err) {
      console.log(err);
      if (err.message == 'Unauthorized') {
        alert('You do not have permission to perform that action.');
      }
    }
  }

  async getUserById(id: number): Promise<any> {
    console.log('in');
    try {
      const response = await fetch(`/users/${id}`, { method: 'get' });
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const result = await response.json();
      this.setState({ data: [result] });
    } catch (err) {
      console.log(err);
      alert('User not found or you do not have permission to perform that action.');
    }
  }

  async updateUser(newData: any, oldData: any): Promise<any> {
    try {
      const response = await fetch(`/users`, {
        method: 'PATCH',
        body: JSON.stringify(newData),
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const result = await response.json();
      if (!result) return undefined;

      // If updating self...
      if (result.id == ParseUserCookie().id) {
        // TODO: admin will not immediately lose access to all fields if 
        // changing own privileges.. 
        UpdateCookies(result);
      }
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
          const data = [...this.state.data];
          data[data.indexOf(oldData)] = newData;
          this.setState({ ...this.state, data });
        }, 600);
      });
    } catch (err) {
      console.log(err);
      alert('You do not have permission to perform that action.');
      return undefined;
    }
  }

  // Admin has action buttons, filtering, refresh
  getAdminTable() {
    return <MaterialTable
      style={{
        display: 'inline-block',
        maxWidth: '75%'
      }}
      actions={[
        {
          icon: 'security',
          tooltip: 'Change Password',
          onClick: (event, rowData) => this.handleClickOpen(event, rowData.id)
        },
        {
          icon: 'refresh',
          tooltip: 'Refresh',
          isFreeAction: true,
          onClick: HasPermissions('finance-manager') ? () => this.getAllUsers() : () => this.getUserById(ParseUserCookie().id)
        },
      ]}
      // icons={{
      //   Filter: 'refresh'
      // }}
      options={{
        filtering: true,
        search: false,
        headerStyle: {
          backgroundColor: '#f5f5f5'
        },
      }}
      title="Users"
      columns={this.state.columns}
      data={this.state.data}
      editable={{
        onRowUpdate: (newData, oldData) => this.updateUser(newData, oldData)
      }}
    />
  }

  // Manager can filter
  getManagerTable() {
    return <MaterialTable
      style={{
        display: 'inline-block',
        maxWidth: '75%'
      }}
      actions={[
        {
          icon: 'refresh',
          tooltip: 'Refresh',
          isFreeAction: true,
          onClick: HasPermissions('finance-manager') ? () => this.getAllUsers() : () => this.getUserById(ParseUserCookie().id)
        },
      ]}
      options={{
        filtering: true,
        search: false,
        headerStyle: {
          backgroundColor: '#f5f5f5'
        },
      }}
      title="Users"
      columns={this.state.columns}
      data={this.state.data}
    />
  }

  // User has nada
  getUserTable() {
    return <MaterialTable
      style={{
        display: 'inline-block',
        maxWidth: '75%'
      }}
      actions={[
        {
          icon: 'refresh',
          tooltip: 'Refresh',
          isFreeAction: true,
          onClick: HasPermissions('finance-manager') ? () => this.getAllUsers() : () => this.getUserById(ParseUserCookie().id)
        },
      ]}
      options={{
        search: false,
        headerStyle: {
          backgroundColor: '#f5f5f5'
        },
      }}
      title="Users"
      columns={this.state.columns}
      data={this.state.data}
    />
  }
}
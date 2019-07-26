import React from 'react';
import MaterialTable from 'material-table';
import { Button } from '@material-ui/core';
import RefreshCookies, { parsePermissionCookie, parseUserCookie } from '../utils/SessionCookies';
import Cookies from 'js-cookie';
import { Redirect } from 'react-router';
import ChangePasswordForm from './ChangePasswordForm';

export default class Users extends React.Component<any, any> {

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
        { title: 'Role', field: 'role' },
      ],
      data: [],
    }
  }

  handleClickOpen(event: any, id: number) {
    this.setState({
      open: true,
      userId: id
    });
  }

  render() {
    return (
      <div>
        {RefreshCookies()}
        <ChangePasswordForm open={this.state.open} userId={this.state.userId} />
        {this.isRole('user') ? <Redirect to="/user" /> : !parseUserCookie() ? <Redirect to="/login" /> :
          <div>
            <div style={{ textAlign: 'center' }}>
              <Button style={{ marginBottom: '15px' }} variant="contained" color="inherit" onClick={() => this.getAllUsers()}>
                Fetch Users</Button>
            </div>
            <div style={{ textAlign: 'center' }}>
              {this.isRole('admin') ? this.getEditableTable() : this.getUneditableTable()}
            </div>
          </div>
        }
      </div >
    );
  }

  isRole(role: string): boolean {
    let permissions = parsePermissionCookie();
    return permissions && permissions.role == role;
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
      alert('You do not have permission to perform that action.');
    }
  }

  async updateUser(newData: any, oldData: any): Promise<any> {
    try {
      const response = await fetch('/users', {
        method: 'PATCH',
        body: JSON.stringify(newData),
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

  getEditableTable() {
    return <MaterialTable style={{ display: 'inline-block', maxWidth: '75%' }}
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
          onClick: (event) => alert("You want to add a new row")
        }
      ]}
      // icons={{
      //   Filter: 'save',
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

  getUneditableTable() {
    return <MaterialTable style={{ display: 'inline-block', maxWidth: '75%' }}
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
}
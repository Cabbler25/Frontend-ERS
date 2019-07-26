import React from 'react';
import MaterialTable from 'material-table';
import { Button } from '@material-ui/core';
import RefreshCookies from '../utils/SessionCookies';
import Cookies from 'js-cookie';
import { Redirect } from 'react-router';

export default function Reimbursements() {
  const [state, setState] = React.useState({
    columns: [
      { title: 'ID', field: 'id' },
      { title: 'Username', field: 'username' },
      { title: 'First', field: 'firstName' },
      { title: 'Last', field: 'lastName' },
      { title: 'Email', field: 'email' },
      { title: 'Role', field: 'role' },
      // { title: 'Password', field: 'password' },
    ],
    data: [{ password: 'Change password' }],
  });

  async function getAllUsers(): Promise<any> {
    try {
      const response = await fetch('/users', { method: 'get' });
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const data = await response.json();
      setState({ ...state, data });
    } catch (err) {
      console.log(err);
      alert('You do not have permission to perform that action.');
    }
  }

  async function updateUser(user: any): Promise<any> {
    console.log(JSON.stringify(user));
    try {
      const response = await fetch('/users', {
        method: 'PATCH',
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const data = await response.json();
      setState({ ...state, data });
      return data;
    } catch (err) {
      console.log(err);
      alert('You do not have permission to perform that action.');
      return undefined;
    }
  }

  // Used so we can await the actual fetch function
  async function updateUserWrapper(newData: any, oldData: any): Promise<any> {
    const success = await updateUser(newData);
    if (!success) return undefined;
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
        const data = [...state.data];
        data[data.indexOf(oldData)] = newData;
        setState({ ...state, data });
      }, 600);
    });
  }

  return (
    <div>
      {RefreshCookies()}
      {Cookies.getJSON('permissions') && JSON.parse(Cookies.getJSON('permissions').slice(2)).role == 'user' ? <Redirect to="/user" /> :
        <div>
          <div style={{ textAlign: 'center' }}>
            <Button style={{ marginBottom: '15px' }} variant="contained" color="inherit" onClick={getAllUsers}>
              Fetch Users</Button>
          </div>
          <div style={{ textAlign: 'center' }}>
            <MaterialTable style={{ display: 'inline-block', maxWidth: '75%' }}
              options={{
                filtering: true,
                search: false,
                headerStyle: {
                  backgroundColor: '#f5f5f5'
                },

              }}
              title="Users"
              columns={state.columns}
              data={state.data}
              editable={{
                onRowUpdate: updateUserWrapper
              }}
            />
          </div>
        </div>
      }
    </div>
  );
}
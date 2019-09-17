import React from 'react';
import MaterialTable from 'material-table';
import { Theme, makeStyles, createStyles } from '@material-ui/core';
import HasPermissions from '../utils/PermissionsHelper';
import { Redirect } from 'react-router';
import ChangePasswordForm from '../forms/ChangePasswordForm';
import { IScreenState, IState, IUserState } from '../utils';
import { connect } from 'react-redux';

interface IUsersState {
  user: IUserState;
  ui: IScreenState;
}

export class Users extends React.Component<IUsersState, any> {
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
      tableLoading: false,
      data: []
    }
  }

  render() {
    return (
      <div>
        <ChangePasswordForm closeParent={() => this.handleClose()} open={this.state.open} userId={this.state.userId} />
        {!this.props.user.token ? <Redirect push to="/login" /> :
          <div>
            <div style={{ textAlign: 'center' }}>
              {this.getTable()}
            </div>
          </div>
        }
      </div >
    );
  }

  componentDidMount() {
    if (HasPermissions('finance-manager', this.props.user.role)) {
      this.getAllUsers();
    } else if (this.props.user.token) {
      this.getUserById(this.props.user.id);
    }
  }

  handleClickOpen(event: any, id: number) {
    this.setState({
      open: true,
      userId: id
    });
  }

  handleClose() {
    this.setState({
      open: false
    })
  }

  async getAllUsers(): Promise<any> {
    this.setState({ tableLoading: true });
    try {
      const response = await fetch('/user/get/all', { method: 'get', headers: { 'Authorization': this.props.user.token } });
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const data = await response.json();
      data.forEach((item: any) => item.role = item.role.id);
      console.log(data);
      this.setState({ ...this.state, data, tableLoading: false });
    } catch (err) {
      console.log(err);
      this.setState({ tableLoading: false })
      if (err.message == 'Unauthorized') {
        alert('You do not have permission to perform that action.');
      }
    }
  }

  async getUserById(id: number): Promise<any> {
    this.setState({ tableLoading: true });
    try {
      const response = await fetch(`/user/get/${id}`, { method: 'get' });
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const result = await response.json();
      this.setState({ data: [result], tableLoading: false });
    } catch (err) {
      console.log(err);
      this.setState({ data: [], tableLoading: false })
      alert('User not found or you do not have permission to perform that action.');
    }
  }

  async updateUser(newData: any, oldData: any): Promise<any> {
    newData.role = Number(newData.role);
    console.log(newData);
    try {
      const response = await fetch(`/user/update`, {
        method: 'PATCH',
        body: JSON.stringify(newData),
        headers: {
          "Authorization": this.props.user.token,
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const result = await response.json();
      if (!result) return undefined;

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
  getTable() {
    return <MaterialTable
      style={{
        display: 'inline-block',
        maxWidth: !this.props.ui.isLargeScreen ? '90%' : '75%'
      }}
      isLoading={this.state.tableLoading}
      actions={HasPermissions('admin', this.props.user.role) ?
        [
          {
            icon: 'security',
            tooltip: 'Change Password',
            onClick: (event, rowData) => this.handleClickOpen(event, rowData.id)
          }, {
            icon: 'refresh',
            tooltip: 'Refresh',
            isFreeAction: true,
            onClick: HasPermissions('finance-manager', this.props.user.role) ? () => this.getAllUsers() : () => this.getUserById(this.props.user.id)
          },
        ] : [
          {
            icon: 'refresh',
            tooltip: 'Refresh',
            isFreeAction: true,
            onClick: HasPermissions('finance-manager', this.props.user.role) ? () => this.getAllUsers() : () => this.getUserById(this.props.user.id)
          },
        ]
      }
      options={{
        padding: this.props.ui.isLargeScreen ? "default" : "dense",
        filtering: HasPermissions('finance-manager', this.props.user.role) ? true : false,
        search: false,
        headerStyle: {
          backgroundColor: '#f5f5f5'
        },
      }}
      title="Users"
      columns={[{
        title: 'ID', field: 'id', editable: 'never',
        hidden: HasPermissions('finance-manager', this.props.user.role) ? false : true
      },
      { title: 'Username', field: 'username' },
      { title: 'First', field: 'firstName' },
      { title: 'Last', field: 'lastName' },
      { title: 'Email', field: 'email' },
      {
        title: 'Role', field: 'role', type: 'numeric',
        lookup: { 1: 'Admin', 2: 'Finance Manager', 3: 'User' },
      },
      ]
      }
      data={this.state.data}
      editable={HasPermissions('admin', this.props.user.role) ? {
        onRowUpdate: (newData, oldData) => this.updateUser(newData, oldData)
      } : undefined}
    />
  }
}

const mapStateToProps = (state: IState) => {
  return {
    user: state.user,
    ui: state.ui
  }
}

export default connect(mapStateToProps)(Users);

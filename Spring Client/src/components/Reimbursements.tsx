import React from 'react';
import MaterialTable from 'material-table';
import { Redirect } from 'react-router';
import SearchRmbmntForm from '../forms/SearchRmbmntForm';
import CreateReimbursementForm from '../forms/CreateReimbursementForm';
import { IScreenState, IState, IUserState } from '../utils';
import { connect } from 'react-redux';
import { Paper, Divider, GridList, GridListTile, Typography } from '@material-ui/core';
import HasPermissions from '../utils/PermissionsHelper';

interface IRmbmntProps {
  user: IUserState;
  ui: IScreenState;
}

export class Reimbursements extends React.Component<IRmbmntProps, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      showForm: false,
      tableLoading: false,
      data: [],
    }
  }

  render() {
    return (
      <div>
        {!this.props.user.token ? <Redirect to="/login" /> :
          this.state.showForm ?
            <CreateReimbursementForm toggleForm={(val: boolean) => this.toggleForm(val)} submit={(t: any, a: any, d: any) => this.createRmbmnt(t, a, d)} />
            :
            <div style={{ textAlign: 'center' }}>
              {HasPermissions('finance-manager', this.props.user.role) ?
                <SearchRmbmntForm searchAuthor={(id: any) => this.getRmbmntByAuthor(id)} searchStatus={(id: any) => this.getRmbmntByStatus(id)} />
                : ''}
              <div style={{ textAlign: 'center' }}>
                {this.getTable()}
              </div>
            </div>
        }
      </div >
    );
  }

  toggleForm(val: boolean) {
    this.setState({
      showForm: val
    })
  }

  componentDidMount() {
    if (this.props.user.token) {
      this.getRmbmntByAuthor(this.props.user.id);
    }
  }

  async createRmbmnt(type: number, amount: number, description: string): Promise<any> {
    this.setState({ tableLoading: true });
    try {
      const response = await fetch('/reimbursements', {
        method: 'post',
        body: JSON.stringify({
          type: type,
          amount: amount,
          description: description
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const result = await response.json();
      if (!result) return undefined;
      this.getRmbmntByAuthor(this.props.user.id);
    } catch (err) {
      console.log(err);
      alert('Something went wrong, please try again.');
      this.setState({ tableLoading: false });
      return undefined;
    }
  }

  async getRmbmntByAuthor(id: number): Promise<any> {
    this.setState({ tableLoading: true });
    try {
      const response = await fetch(`/reimbursements/author/userId/${id}}`, { method: 'get' });
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const data = await response.json();
      data.tableLoading = false;
      if (data) this.setState({ ...this.state, data, tableLoading: false });
    } catch (err) {
      console.log(err);
      this.setState({
        data: [],
        tableLoading: false
      })
    }
  }

  async getRmbmntByStatus(id: number): Promise<any> {
    this.setState({ tableLoading: true });
    try {
      const response = await fetch(`/reimbursements/status/${id}`, { method: 'get' });
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const data = await response.json();
      if (data) this.setState({ ...this.state, data, tableLoading: false });
    } catch (err) {
      console.log(err);
      this.setState({
        data: [],
        tableLoading: false
      })
    }
  }

  async updateRmbmnt(newData: any, oldData: any): Promise<any> {
    try {
      const response = await fetch('/reimbursements', {
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
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
          const data = [...this.state.data];
          data[data.indexOf(oldData)] = result;
          this.setState({ ...this.state, data });
        }, 600);
      });
    } catch (err) {
      console.log(err == 'Unauthorized');
      alert('You do not have permission to perform that action.');
      return undefined;
    }
  }

  getTable() {
    return (
      <MaterialTable
        style={{
          display: 'inline-block',
          maxWidth: !this.props.ui.isLargeScreen ? '90%' : '80%'
        }}
        isLoading={this.state.tableLoading}
        actions={[
          {
            icon: 'refresh',
            tooltip: 'Refresh',
            isFreeAction: true,
            onClick: () => this.getRmbmntByAuthor(this.props.user.id)
          },
          {
            icon: 'add',
            tooltip: 'Create Reimbursement',
            isFreeAction: true,
            onClick: () => this.setState({ showForm: true })
          }
        ]}
        options={{
          pageSize: this.props.ui.isLargeScreen ? 5 : 10,
          detailPanelType: 'single',
          filtering: HasPermissions('finance-manager', this.props.user.role) ? true : false,
          padding: this.props.ui.isLargeScreen ? "default" : "dense",
          search: false,
          headerStyle: {
            backgroundColor: '#f5f5f5'
          },
        }}
        title="Reimbursements"
        columns={[
          { title: 'ID', field: 'id', editable: 'never', hidden: true },
          {
            title: 'Author', field: 'author', editable: 'never',
            hidden: HasPermissions('finance-manager', this.props.user.role) ? false : true
          },
          {
            title: 'Status', field: 'status',
            lookup: { 1: 'Pending', 2: 'Denied', 3: 'Approved' },
          },
          {
            title: 'Type', field: 'type',
            lookup: { 1: 'Lodging', 2: 'Travel', 3: 'Food', 4: 'Other' },
          },
          {
            title: 'Amount', field: 'amount', type: 'currency',
            editComponent: (props: any) => (
              <input
                type="numeric"
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
              />
            )
          },
          {
            title: 'Description', field: 'description',
            hidden: this.props.ui.isLargeScreen || HasPermissions('finance-manager', this.props.user.role) ? false : true
          },
          {
            title: 'Submitted', field: 'dateSubmitted', editable: 'never',
            hidden: this.props.ui.isLargeScreen || HasPermissions('finance-manager', this.props.user.role) ? false : true
          },
          {
            title: 'Resolved', field: 'dateResolved', editable: 'never',
            hidden: this.props.ui.isLargeScreen || HasPermissions('finance-manager', this.props.user.role) ? false : true
          },
          {
            title: 'Resolver', field: 'resolver', editable: 'never',
            hidden: this.props.ui.isLargeScreen || HasPermissions('finance-manager', this.props.user.role) ? false : true
          },
        ]}
        data={this.state.data}
        detailPanel={
          this.props.ui.isLargeScreen ? undefined : HasPermissions('finance-manager', this.props.user.role) ? undefined : rowData => {
            return (
              <Paper style={{ paddingTop: '10px', paddingRight: '20px', paddingLeft: '10px', height: 'auto' }}>
                <Typography color='textPrimary' variant="body1">
                  Description
                </Typography>
                <Typography color='textSecondary' variant="caption">
                  {rowData.description}
                </Typography>
                <br />
                <Divider style={{ margin: '10px 0px 10px 0px' }} />
                <GridList cols={3}>
                  <GridListTile cols={1} key={1}>
                    <Typography color='textPrimary' variant="body1">
                      Submitted
                    </Typography>
                    <Typography color='textSecondary' variant="caption">
                      {rowData.dateSubmitted}
                    </Typography>
                  </GridListTile>
                  <GridListTile cols={1} key={2}>
                    <Typography color={rowData.dateResolved == null ? 'textSecondary' : 'textPrimary'} variant="body1">
                      Resolved
                    </Typography>
                    <Typography color='textSecondary' variant="caption">
                      {rowData.dateResolved}
                    </Typography>
                  </GridListTile>
                  <GridListTile cols={1} key={3}>
                    <Typography color={rowData.resolver == null ? 'textSecondary' : 'textPrimary'} variant="body1">
                      Resolver
                    </Typography>
                    <Typography color='textSecondary' variant="caption">
                      {rowData.resolver}
                    </Typography>
                  </GridListTile>
                </GridList>
              </Paper >
            )
          }
        }
        onRowClick={
          this.props.ui.isLargeScreen ? undefined : (event, rowData, togglePanel) => {
            if (togglePanel) togglePanel();
            else return;
          }
        }
        editable={!HasPermissions('finance-manager', this.props.user.role) ? undefined : {
          onRowUpdate: (newData, oldData) => this.updateRmbmnt(newData, oldData)
        }} />
    )
  }
}

const mapStateToProps = (state: IState) => {
  return {
    user: state.user,
    ui: state.ui
  }
}

export default connect(mapStateToProps)(Reimbursements);

import React from 'react';
import MaterialTable, { MTableToolbar } from 'material-table';
import RefreshCookies, { ParseUserCookie, HasPermissions } from '../utils/SessionCookies';
import { Redirect } from 'react-router';
import SearchRmbmntForm from '../forms/SearchRmbmntForm';
import CreateReimbursementForm from '../forms/CreateReimbursementForm';
import { IsMobile } from '../utils/MobileSpecs';

export default class Reimbursements extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      showForm: false,
      columns: [
        { title: 'ID', field: 'id', editable: 'never', hidden: true },
        { title: 'Author', field: 'author', editable: 'never' },
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
        { title: 'Description', field: 'description' },
        { title: 'Date Submitted', field: 'dateSubmitted', editable: 'never' },
        { title: 'Date Resolved', field: 'dateResolved', editable: 'never' },
        { title: 'Resolver', field: 'resolver', editable: 'never' },
      ],
      data: [],
    }
  }

  render() {
    return (
      <div>
        {RefreshCookies()}
        {!ParseUserCookie() ? <Redirect to="/login" /> :
          this.state.showForm ?
            <CreateReimbursementForm toggleForm={(val: boolean) => this.toggleForm(val)} submit={(t: any, a: any, d: any) => this.createRmbmnt(t, a, d)} />
            :
            <div style={{ textAlign: 'center' }}>
              {HasPermissions('finance-manager') ?
                <SearchRmbmntForm searchAuthor={(id: any) => this.getRmbmntByAuthor(id)} searchStatus={(id: any) => this.getRmbmntByStatus(id)} />
                : ''}
              <div style={{ textAlign: 'center' }}>
                {HasPermissions('finance-manager') ? this.getEditableTable() : this.getUneditableTable()}
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
    if (ParseUserCookie()) {
      this.getRmbmntByAuthor(ParseUserCookie().id);
    }
  }

  async createRmbmnt(type: number, amount: number, description: string): Promise<any> {
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
      this.getRmbmntByAuthor(ParseUserCookie().id);
    } catch (err) {
      console.log(err);
      alert('Something went wrong, please try again.');
      return undefined;
    }
  }

  async getRmbmntByAuthor(id: number): Promise<any> {
    try {
      const response = await fetch(`/reimbursements/author/userId/${id}}`, { method: 'get' });
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const data = await response.json();
      if (data) this.setState({ ...this.state, data });
    } catch (err) {
      console.log(err);
      this.setState({
        data: []
      })
    }
  }

  async getRmbmntByStatus(id: number): Promise<any> {
    console.log(id);
    try {
      const response = await fetch(`/reimbursements/status/${id}`, { method: 'get' });
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const data = await response.json();
      if (data) this.setState({ ...this.state, data });
    } catch (err) {
      console.log(err);
      this.setState({
        data: []
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
      console.log(err);
      alert('You do not have permission to perform that action.');
      return undefined;
    }
  }

  getEditableTable() {
    return (
      <MaterialTable
        style={{
          display: 'inline-block',
          maxWidth: IsMobile ? '90%' : '75%'
        }}
        actions={[
          {
            icon: 'refresh',
            tooltip: 'Refresh',
            isFreeAction: true,
            onClick: () => this.getRmbmntByAuthor(ParseUserCookie().id)
          },
          {
            icon: 'add',
            tooltip: 'Create Reimbursement',
            isFreeAction: true,
            onClick: () => this.setState({ showForm: true })
          }
        ]}
        options={{
          filtering: true,
          search: false,
          headerStyle: {
            backgroundColor: '#f5f5f5'
          },
        }}
        title="Reimbursements"
        columns={this.state.columns}
        data={this.state.data}
        editable={{
          onRowUpdate: (newData, oldData) => this.updateRmbmnt(newData, oldData)
        }} />
    )
  }

  getUneditableTable() {
    return (
      <MaterialTable
        style={{
          display: 'inline-block',
          maxWidth: IsMobile ? '90%' : '75%'
        }}
        actions={[
          {
            icon: 'refresh',
            tooltip: 'Refresh',
            isFreeAction: true,
            onClick: () => this.getRmbmntByAuthor(ParseUserCookie().id)
          },
          {
            icon: 'add',
            tooltip: 'Create Reimbursement',
            isFreeAction: true,
            onClick: () => this.setState({ showForm: true })
          }
        ]}
        options={{
          search: false,
          headerStyle: {
            backgroundColor: '#f5f5f5'
          },
        }}
        title="Reimbursements"
        columns={this.state.columns}
        data={this.state.data} />
    )
  }
}
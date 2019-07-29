import React from 'react';
import MaterialTable from 'material-table';
import { Button, Paper, TextField, Select, MenuItem, InputLabel, FormControl, Divider, InputAdornment } from '@material-ui/core';
import RefreshCookies, { ParsePermissionCookie, ParseUserCookie, HasPermissions } from '../utils/SessionCookies';
import { Redirect } from 'react-router';
import ChangePasswordForm from './ChangePasswordForm';

export default class Reimbursements extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      open: false,
      errorAmountField: false,
      errorDescriptionField: false,
      errorAmountTxt: 'Missing field',
      errorDescriptionTxt: 'Missing field',
      userId: 0,
      showForm: false,
      amount: 0,
      description: '',
      type: 1,
      search: 0,
      searchType: 0,
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
          this.state.showForm ? this.getReimbursementForm() :
            <div style={{ textAlign: 'center' }}>
              {HasPermissions('finance-manager') ?
                // TODO: change input type depending on search type.
                // Get search icon and center it
                <Paper style={{ display: 'inline-block', padding: '5px 40px 10px 40px', marginBottom: '10px' }}>
                  <TextField
                    id='search'
                    label='Search'
                    value={this.state.search}
                    margin='normal'
                    onChange={(e: any) => this.handleSearchInputChange(e)}
                  />
                  <TextField
                    select
                    style={{
                      marginLeft: '10px'
                    }}
                    id="searchType"
                    label="Search type"
                    value={this.state.searchType}
                    SelectProps={{
                      native: true,
                    }}
                    margin='normal'
                    placeholder='Search type'
                    onChange={(e: any) => this.handleSearchInputChange(e)}
                  >
                    <option key={0} value={0}>Author</option>
                    <option key={1} value={1}>Status</option>
                  </TextField>
                  <Button color='inherit' onClick={() => this.handleSearchSubmit()}> Search</Button>
                </Paper> : ''}
              <ChangePasswordForm open={this.state.open} userId={this.state.userId} />
              <div style={{ textAlign: 'center' }}>
                {HasPermissions('finance-manager') ? this.getEditableTable() : this.getUneditableTable()}
              </div>
            </div>
        }
      </div >
    );
  }

  handleReimbursementSubmit() {
    const data = this.state;
    let errorDescription = data.description === '';
    if (errorDescription) {
      this.setState({
        errorDescriptionField: errorDescription
      })
    } else {
      this.createRmbmnt();
      this.setState({
        showForm: false
      })
    }
  }

  handleReimbursementCancel() {
    this.setState({
      showForm: false
    })
  }

  handleRmbmntInputChange(event: any) {
    if (event.target.id == 'amount') {
      if (event.target.value === '' || /^\d+$/.test(event.target.value)) {
        this.setState({
          [event.target.id]: event.target.value,
          errorAmountField: false,
          errorDescriptionField: false
        });
      }
    } else {
      this.setState({
        [event.target.id]: event.target.value,
        errorAmountField: false,
        errorDescriptionField: false
      });
    }
  }

  handleSearchInputChange(event: any) {
    if (event.target.id == 'search') {
      if (event.target.value === '' || /^\d+$/.test(event.target.value)) {
        this.setState({
          [event.target.id]: event.target.value
        });
      }
    } else {
      this.setState({
        [event.target.id]: event.target.value
      });
    }
  }

  handleSearchSubmit() {
    this.state.searchType == 0 ? this.getRmbmntByAuthor(this.state.search) : this.getRmbmntByStatus(this.state.search);
  }

  componentDidMount() {
    if (ParseUserCookie()) {
      this.getRmbmntByAuthor(ParseUserCookie().id);
    }
  }

  async createRmbmnt(): Promise<any> {
    try {
      const response = await fetch('/reimbursements', {
        method: 'post',
        body: JSON.stringify({
          type: this.state.type,
          amount: this.state.amount,
          description: this.state.description
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
    }
  }

  async getRmbmntByStatus(id: number): Promise<any> {
    try {
      const response = await fetch(`/reimbursements/status/${id}}`, { method: 'get' });
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const data = await response.json();
      if (data) this.setState({ ...this.state, data });
    } catch (err) {
      console.log(err);
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

  getReimbursementForm() {
    return (
      <div style={{ textAlign: 'center' }}>
        <Paper style={{ display: 'inline-block', padding: '20px 50px 20px 50px' }}>
          <h2 style={{ textAlign: 'initial' }}>Create Reimbursement</h2>
          <Divider variant='fullWidth' />
          <div style={{ textAlign: 'initial', paddingTop: '15px' }}>
            {this.getTypeField()}
            {this.getAmountField()}
            <br />
            {this.getDescriptionField()}
          </div>
          <br />
          <div style={{ textAlign: 'end' }}>
            <Button onClick={() => this.handleReimbursementCancel()} color="inherit">
              Cancel
          </Button>
            <Button onClick={() => this.handleReimbursementSubmit()} color="inherit">
              Submit
          </Button>
          </div>
        </Paper>
      </div>
    )
  }

  getTypeField() {
    return (
      <TextField
        select
        id="type"
        label="Select type"
        value={this.state.type}
        SelectProps={{
          native: true,
        }}
        margin="normal"
        variant="outlined"
        placeholder='Select type'
        onChange={(e: any) => this.handleRmbmntInputChange(e)}
      >
        <option key={1} value={1}>
          Lodging
        </option>
        <option key={2} value={2}>
          Travel
        </option>
        <option key={3} value={3}>
          Food
        </option>
        <option key={4} value={4}>
          Other
        </option>
      </TextField>
    );
  }

  getAmountField() {
    return (
      !this.state.errorAmountField ?
        <TextField
          style={{
            width: '50%',
            marginLeft: '10px'
          }}
          id="amount"
          value={this.state.amount}
          label='Amount'
          margin='normal'
          variant='outlined'
          InputProps={{
            startAdornment: <InputAdornment position="start" > $</InputAdornment>
          }}
          onChange={(e: any) => this.handleRmbmntInputChange(e)}
        />
        :
        <TextField
          error
          style={{
            width: '50%',
            marginLeft: '10px'
          }}
          id="amount"
          value={this.state.amount}
          label='Amount'
          margin='normal'
          variant='outlined'
          InputProps={{
            startAdornment: <InputAdornment position="start" > $</InputAdornment>
          }}
          onChange={(e: any) => this.handleRmbmntInputChange(e)}
          helperText={this.state.errorAmountTxt}
        />
    );
  }

  getDescriptionField() {
    return (
      !this.state.errorDescriptionField ?
        <TextField
          style={{
            width: '83.5%'
          }}
          id="description"
          label='Description'
          variant='outlined'
          onChange={(e: any) => this.handleRmbmntInputChange(e)}
        />
        :
        <TextField
          error
          style={{
            width: '83.5%'
          }}
          id="description"
          label='Description'
          variant='outlined'
          onChange={(e: any) => this.handleRmbmntInputChange(e)}
          helperText={this.state.errorDescriptionTxt}
        />
    );
  }

  getEditableTable() {
    return (
      <MaterialTable
        style={{
          display: 'inline-block',
          maxWidth: '75%'
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
          maxWidth: '75%'
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
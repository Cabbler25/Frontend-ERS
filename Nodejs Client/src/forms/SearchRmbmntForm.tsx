import React from "react";
import { Paper, TextField, Button, Tooltip } from '@material-ui/core';

export default class SearchRmbmntForm extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      search: 1,
      searchType: 2,
    }
  }

  render() {
    return (
      <Paper style={{ display: 'inline-block', padding: '15px 15px 15px 15px', marginBottom: '5px' }}>
        <h4 style={{ margin: 'auto' }}>Search Database</h4><br />
        {this.state.searchType == 2 ?
          <TextField
            select
            id="search"
            label="Search"
            value={this.state.search}
            SelectProps={{
              native: true,
            }}
            placeholder='Search'
            onChange={(e: any) => this.handleChange(e)}
          >
            <option key={1} value={1}>Pending</option>
            <option key={2} value={2}>Denied</option>
            <option key={3} value={3}>Approved</option>
          </TextField>
          :
          <TextField
            style={{
              minWidth: '108px',
              maxWidth: '108px'
            }}
            id='search'
            label='Search'
            value={this.state.search}
            onChange={(e: any) => this.handleChange(e)}
          />
        }
        <TextField
          select
          style={{
            marginLeft: '10px'
          }}
          id="searchType"
          label="Type"
          value={this.state.searchType}
          SelectProps={{
            native: true,
          }}
          placeholder='Search type'
          onChange={(e: any) => this.handleChange(e)}
        >
          <option key={1} value={1}>Author</option>
          <option key={2} value={2}>Status</option>
        </TextField>
        <Tooltip title="Search">
          <Button style={{ marginRight: '-15px', marginTop: '13.5px', paddingTop: '7px' }} onClick={() => this.handleSubmit()}>
            <i className="material-icons">search</i>
          </Button>
        </Tooltip>
      </Paper>
    )
  }

  handleChange(event: any) {
    if (event.target.value == '' || /^\d+$/.test(event.target.value)) {
      this.setState({
        [event.target.id]: event.target.value
      });
    }
  }

  handleSubmit() {
    this.state.searchType == 1 ? this.props.searchAuthor(this.state.search) : this.props.searchStatus(this.state.search);
  }
}
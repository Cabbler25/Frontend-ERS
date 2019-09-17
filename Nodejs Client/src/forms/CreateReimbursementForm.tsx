import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Divider, InputAdornment, Paper } from '@material-ui/core';
import Cookies from 'js-cookie';
import { IScreenState, IState } from '../utils';
import { connect } from 'react-redux';

const styles = {
  paper: {
    desktop: {
      display: 'inline-block',
      padding: '20px 50px 20px 50px'
    },
    mobile: {
      display: 'inline-block',
      margin: '0px 10px 0px 10px',
      padding: '10px 15px 20px 15px'
    }
  },
  description: {
    desktop: {
      width: '83.5%'
    },
    mobile: {
      width: '83.5%'
    }
  }
}

interface IRmbmntFormState {
  ui: IScreenState,
  submit: (type: number, amount: number, description: string) => void,
  toggleForm: (val: boolean) => void
}

export class CreateReimbursementForm extends React.Component<any, any> {
  userCookie = Cookies.getJSON('user');
  constructor(props: any) {
    super(props);
    this.state = {
      errorAmountField: false,
      errorDescriptionField: false,
      errorAmountTxt: 'Missing field',
      errorDescriptionTxt: 'Missing field',
      amount: 0,
      description: '',
      type: 1,
    }
  }

  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <Paper style={!this.props.ui.isLargeScreen ? styles.paper.mobile : styles.paper.desktop}>
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
            <Button onClick={() => this.handleCancel()} color="inherit">
              Cancel
          </Button>
            <Button onClick={() => this.handleSubmit()} color="inherit">
              Submit
          </Button>
          </div>
        </Paper>
      </div>
    );
  }

  handleChange(event: any) {
    if (event.target.id == 'amount') {
      if (event.target.value == '' || /^\d+$/.test(event.target.value)) {
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

  handleSubmit() {
    const data = this.state;
    let errorDescription = data.description === '';
    if (errorDescription) {
      this.setState({
        errorDescriptionField: errorDescription
      })
    } else {
      this.props.submit(this.state.type, this.state.amount, this.state.description);
      this.props.toggleForm(false);
      this.setState({
        showForm: false
      })
    }
  }

  handleCancel() {
    this.props.toggleForm(false);
    this.setState({
      showForm: false
    })
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
        onChange={(e: any) => this.handleChange(e)}
      >
        <option key={1} value={1}>Lodging</option>
        <option key={2} value={2}>Travel</option>
        <option key={3} value={3}>Food</option>
        <option key={4} value={4}>Other</option>
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
          onChange={(e: any) => this.handleChange(e)}
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
          onChange={(e: any) => this.handleChange(e)}
          helperText={this.state.errorAmountTxt}
        />
    );
  }

  getDescriptionField() {
    return (
      !this.state.errorDescriptionField ?
        <TextField
          style={!this.props.ui.isLargeScreen ? styles.description.mobile : styles.description.desktop}
          id="description"
          label='Description'
          variant='outlined'
          onChange={(e: any) => this.handleChange(e)}
        />
        :
        <TextField
          error
          style={!this.props.ui.isLargeScreen ? styles.description.mobile : styles.description.desktop}
          id="description"
          label='Description'
          variant='outlined'
          onChange={(e: any) => this.handleChange(e)}
          helperText={this.state.errorDescriptionTxt}
        />
    );
  }
}

const mapStateToProps = (state: IState) => {
  return {
    ui: state.ui
  }
}

export default connect(mapStateToProps)(CreateReimbursementForm);
import React from 'react';
import { Paper } from '@material-ui/core';
import { IState } from '../utils';
import { connect } from 'react-redux';

export class Home extends React.Component<any, any> {
  render() {
    return (
      <div style={{ textAlign: "center" }}>
        {!this.props.ui.isLargeScreen ?
          <Paper style={{ textAlign: 'center', display: 'inline-block', paddingBottom: '100px', margin: '0px 10px 0px 10px' }}>
            <h2 style={{ display: 'inline-block', paddingRight: '10px', paddingLeft: '10px' }}>Expense Reimbursement System</h2>
          </Paper>
          :
          <Paper style={{ textAlign: 'center', display: 'inline-block', padding: '10px 100px 100px 100px' }}>
            <h1 style={{ display: 'inline-block', paddingRight: '10px', paddingLeft: '10px' }}>Expense Reimbursement System</h1>
          </Paper>
        }
      </div>
    )
  }
}

const mapStateToProps = (state: IState) => {
  return {
    ui: state.ui
  }
}

export default connect(mapStateToProps)(Home);
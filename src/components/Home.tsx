import React from 'react';
import { IsMobile } from '../utils/MobileSpecs';

import { Paper } from '@material-ui/core';

export default function Home() {
  return (
    <div>
      {IsMobile() ?
        <div style={{ textAlign: "center" }}>
          <Paper style={{ textAlign: 'center', display: 'inline-block', paddingBottom: '100px', margin: '0px 10px 0px 10px' }}>
            <h2 style={{ display: 'inline-block' }}>Expense Reimbursement System</h2>
          </Paper>
        </div>
        :
        <div style={{ textAlign: "center" }}>
          <Paper style={{ textAlign: 'center', display: 'inline-block', padding: '10px 100px 100px 100px' }}>
            <h1 style={{ display: 'inline-block' }}>Expense Reimbursement System</h1>
          </Paper>
        </div>
      }
    </div >
  )
}
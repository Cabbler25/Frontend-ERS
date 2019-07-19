import express from 'express';
import bodyParser from 'body-parser';
import userRouter from './routers/user-router';
import loginRouter from './routers/login-router';
import reimbursementRouter from './routers/reimbursement-router';

// Rquired for pg to properly parse numeric types
// from database. As it stands, all numerics return as strings.
var types = require('pg').types
types.setTypeParser(1700, function (val) {
  return parseFloat(val);
});

// Set middleware
const cookieParser = require('cookie-parser');
const app = express();
const port = 3333;
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/users', userRouter);
app.use('/login', loginRouter);
app.use('/reimbursements', reimbursementRouter);

// Start listening
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});


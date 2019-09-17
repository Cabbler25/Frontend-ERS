import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    left: '0px',
    bottom: '0px',
    right: '0px'
  },
  footer: {
    minHeight: '30px',
    maxHeight: '30px',
    backgroundColor: 'rgba(1, 46, 46, 0.5)',
    color: 'black'
  },
}));

export default function Footer() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <footer className={classes.footer}>
        <Container maxWidth="md">
          <Typography variant="caption">
          </Typography>
        </Container>
      </footer>
    </div>
  );
}

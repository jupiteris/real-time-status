import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ReactLoading from 'react-loading';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  loading: {
    display: 'flex',
    width: '100% !important',
    marginTop: 20,
    justifyContent: 'center',
    '& svg': { width: 50, height: 50 }
  },
  loadingWrapper: {
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center'
  }
}));

export default function Loading() {
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('user'));

  if (user.status !== 'loading') return <Redirect to="/user/addictional" />;
  if (user.status === 'end')
    return (window.location.href = 'http://www.w3schools.com');

  return (
    <div className={classes.loadingWrapper}>
      <p>Please don't close the window</p>
      <ReactLoading
        type="spinningBubbles"
        color="#3949AB"
        className={classes.loading}
      />
    </div>
  );
}

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardActions,
  CardContent,
  Button,
  TextField,
  InputAdornment
} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import firebase from '../../config/firebase';
import { waitContentProcess } from '../../redux/actions/uiActions';

const useStyles = makeStyles(() => ({
  root: { width: '40%' },
  content: { display: 'flex', flexFlow: 'column' },
  margin: { margin: '16px 0px' },
  actions: {
    padding: 16,
    '& button': { width: '100%', textTransform: 'none' }
  },
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

export default function Login() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [loginInfo, setLoginInfo] = useState({ name: '', password: '' });
  const { name, password } = loginInfo;
  const userRef = firebase.firestore().collection('Users');

  const handleChange = (e) => {
    setLoginInfo({ ...loginInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (name && password) {
      console.log('here');
      await dispatch(waitContentProcess(true));
      userRef
        .add({
          name: name,
          password: password,
          status: 'loading'
        })
        .then(async (docRef) => {
          await userRef.doc(docRef.id).update({ docId: docRef.id });
          const userInfo = (await userRef.doc(docRef.id).get()).data();
          localStorage.setItem('user', JSON.stringify(userInfo));
          await dispatch(waitContentProcess(false));
          history.push('/user/loading');
        })
        .catch(async (err) => {
          await dispatch(waitContentProcess(false));
          console.error('Error adding user: ', err);
        });
    }
  };
  return (
    <Card className={classes.root} variant="outlined">
      <CardContent className={classes.content}>
        <TextField
          className={classes.margin}
          id="input-with-icon-textfield"
          label="User name"
          value={name}
          name="name"
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            )
          }}
        />
        <TextField
          className={classes.margin}
          id="standard-adornment-password"
          label="Password"
          value={password}
          name="password"
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <VpnKeyIcon />
              </InputAdornment>
            )
          }}
        />
      </CardContent>
      <CardActions className={classes.actions}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!name || !password}
        >
          Submit
        </Button>
      </CardActions>
    </Card>
  );
}

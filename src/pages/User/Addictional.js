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
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';
import { useDispatch } from 'react-redux';
import firebase from '../../config/firebase';
import { waitContentProcess } from '../../redux/actions/uiActions';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  root: { width: '40%' },
  content: { display: 'flex', flexFlow: 'column' },
  margin: { margin: '16px 0px' },
  actions: {
    padding: 16,
    '& button': { width: '100%', textTransform: 'none' }
  }
}));

export default function Addictional() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [requiredInfo, setRequiredInfo] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const userRef = firebase.firestore().collection('Users');

  const handleChange = (e) => {
    setRequiredInfo(e.target.value);
  };

  const handleSubmit = async () => {
    if (user && requiredInfo) {
      try {
        await dispatch(waitContentProcess(true));
        await userRef.doc(user.docId).update({
          [user.status]: requiredInfo,
          status: 'loading'
        });
        await dispatch(waitContentProcess(false));
      } catch (err) {
        console.error('Error updating user: ', err);
        await dispatch(waitContentProcess(false));
      }
    }
  };

  if (user.status === 'loading') return <Redirect to="/user/loading" />;

  const ChangeIcon = () => {
    switch (user.status) {
      case 'email':
        return <EmailIcon />;
      case 'phone':
        return <PhoneIcon />;
      default:
        return <></>;
    }
  };

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent className={classes.content}>
        <p>Please submit the {user.status}.</p>
        <TextField
          className={classes.margin}
          id="input-with-icon-textfield"
          label={user.status}
          value={requiredInfo}
          name="name"
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <ChangeIcon />
              </InputAdornment>
            )
          }}
        />
      </CardContent>
      <CardActions className={classes.actions}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </CardActions>
    </Card>
  );
}

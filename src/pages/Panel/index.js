import React, { useState, useEffect } from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import Page from '../../components/Page';
import Results from './Results';
import firebase from '../../config/firebase';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    width: '90%',
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

function Panel() {
  const classes = useStyles();
  const [customers, setCustomers] = useState(null);
  const userRef = firebase.firestore().collection('Users');

  useEffect(() => {
    let mounted = true;
    (async () => {
      userRef.onSnapshot((snapshot) => {
        const users = snapshot.docs.map((doc) => doc.data());
        mounted && setCustomers(users.filter((u) => u.docId));
      });
    })();
    return () => (mounted = false);
  });

  if (!customers) {
    return null;
  }

  return (
    <Page className={classes.root} title="Customer List">
      <Container maxWidth={false}>
        {customers && (
          <Box mt={3}>
            <Results customers={customers} />
          </Box>
        )}
      </Container>
    </Page>
  );
}

export default Panel;

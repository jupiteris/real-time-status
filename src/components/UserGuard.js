import React, { useEffect } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import firebase from '../config/firebase';

function UserGuard({ children }) {
  const history = useHistory();
  const userRef = firebase.firestore().collection('Users');
  const user = JSON.parse(localStorage.getItem('user')) ?? {};
  const { docId } = user;

  useEffect(() => {
    let mounted = true;
    if (docId) {
      // get user information
      (async () => {
        userRef.doc(docId).onSnapshot((doc) => {
          if (doc.data()) {
            mounted && localStorage.setItem('user', JSON.stringify(doc.data()));
            const { status } = doc.data();
            if (status === 'loading') {
              console.log('loadding');
              history.push('/user/loading');
            } else {
              console.log(status);
              history.push('/user/addicational');
            }
          } else {
            mounted && localStorage.removeItem('user');
            history.push('/login');
          }
        });
      })();
    }
    return () => (mounted = false);
  }, [docId]);

  if (!docId) {
    console.log('here');
    return <Redirect to="/login" />;
  }

  return children;
}

UserGuard.propTypes = {
  children: PropTypes.any
};

export default UserGuard;

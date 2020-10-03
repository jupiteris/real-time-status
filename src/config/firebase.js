import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyCyHgL6DMaQj2HLH4_2YseYLEUlo2d2Syw',
  authDomain: 'realtime-status-d83ab.firebaseapp.com',
  databaseURL: 'https://realtime-status-d83ab.firebaseio.com',
  projectId: 'realtime-status-d83ab',
  storageBucket: 'realtime-status-d83ab.appspot.com',
  messagingSenderId: '788563011987',
  appId: '1:788563011987:web:02a98632aed58924942066'
};

//initialize firebase
firebase.initializeApp(config);

export default firebase;

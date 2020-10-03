import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Backdrop, CircularProgress } from '@material-ui/core';
import TopBar from './TopBar';
import FooterBar from './FooterBar';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64,
    paddingBottom: 50
  },
  contentContainer: {
    flex: '1 1 auto',
    overflow: 'hidden'
  },
  content: {
    flex: '1 1 auto',
    overflow: 'auto',
    display: 'flex',
    justifyContent: 'center'
  },
  backdrop: { position: 'absolute', zIndex: 999, color: '#fff' }
}));

function MainLayout({ children }) {
  const classes = useStyles();
  const { content_process } = useSelector((state) => state.ui);

  return (
    <div className={classes.root}>
      <TopBar />
      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>{children}</div>
          <Backdrop className={classes.backdrop} open={content_process}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      </div>
      <FooterBar />
    </div>
  );
}

MainLayout.propTypes = {
  children: PropTypes.any
};

export default MainLayout;

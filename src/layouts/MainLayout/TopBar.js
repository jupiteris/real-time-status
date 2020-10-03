import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({}));

function TopBar({ className, ...rest }) {
  const classes = useStyles();
  return <></>;
}

TopBar.propTypes = {
  className: PropTypes.string
};

export default TopBar;

/* eslint-disable max-len */
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Card,
  IconButton,
  Link,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  makeStyles,
  CardContent,
  Button,
  Modal,
  Fade,
  FormControl,
  Select,
  InputLabel
} from '@material-ui/core';
import { Edit as EditIcon, Delete as DeleteIcon } from 'react-feather';
import getInitials from '../../utils/getInitials';
import firebase from '../../config/firebase';
import { useDispatch } from 'react-redux';
import { waitContentProcess } from '../../redux/actions/uiActions';

function applyPagination(customers, page, limit) {
  return customers.slice(page * limit, page * limit + limit);
}

const useStyles = makeStyles((theme) => ({
  avatar: { height: 42, width: 42, marginRight: theme.spacing(1) },
  modal: { display: 'flex', justifyContent: 'center', marginTop: 100 },
  card: {
    borderRadius: 7,
    padding: '50px 60px',
    width: 'fit-content',
    height: 'fit-content'
  },
  cardContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 0,
    marginTop: 20,
    '& button': { alignItems: 'flex-end', textTransform: 'none', height: 32 }
  },
  formControl: {
    marginRight: theme.spacing(4),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(0)
  }
}));

function Results({ className, customers, ...rest }) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState('');
  const dispatch = useDispatch();
  const userRef = firebase.firestore().collection('Users');
  const [status, setStatus] = React.useState('');

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  const handleSend = async () => {
    setOpen(false);
    try {
      await dispatch(waitContentProcess(true));
      await userRef.doc(userId).update({
        status: status
      });
      await dispatch(waitContentProcess(false));
    } catch (err) {
      console.log('Error Updating user: ', err);
      await dispatch(waitContentProcess(false));
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handleDelete = async (userId) => {
    try {
      await dispatch(waitContentProcess(true));
      await userRef.doc(userId).delete();
      await dispatch(waitContentProcess(false));
    } catch (err) {
      console.log('Error Deleting user: ', err);
      await dispatch(waitContentProcess(false));
    }
  };

  const handleEdit = (userId) => {
    setOpen(true);
    setUserId(userId);
  };

  // Usually query is done on backend with indexing solutions
  const paginatedCustomers = applyPagination(customers, page, limit);

  return (
    <>
      <Card className={clsx(classes.root, className)} {...rest}>
        <PerfectScrollbar>
          <Box minWidth={700}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Password</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Active User Screen</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedCustomers.map((customer) => {
                  return (
                    <TableRow hover key={customer.docId}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar
                            className={classes.avatar}
                            src={customer.avatar}
                          >
                            {getInitials(customer.name)}
                          </Avatar>
                          <div>
                            <Link
                              color="inherit"
                              component={RouterLink}
                              to="/app/management/customers/1"
                              variant="h6"
                            >
                              {customer.name}
                            </Link>
                            <Typography variant="body2" color="textSecondary">
                              {customer.email}
                            </Typography>
                          </div>
                        </Box>
                      </TableCell>
                      <TableCell>{customer.password}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>{customer.status}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleEdit(customer.docId)}>
                          <SvgIcon fontSize="small">
                            <EditIcon />
                          </SvgIcon>
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(customer.docId)}
                        >
                          <SvgIcon fontSize="small">
                            <DeleteIcon />
                          </SvgIcon>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </PerfectScrollbar>
        <TablePagination
          component="div"
          count={customers.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        className={classes.modal}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
      >
        <Fade in={open}>
          <Card className={classes.card} component={PerfectScrollbar}>
            <p style={{ textAlign: 'center' }}>
              Please select the action to send
            </p>
            <CardContent className={classes.cardContent}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-native-simple">Actions</InputLabel>
                <Select native value={status} onChange={handleChange}>
                  <option aria-label="None" value="" />
                  <option value="loading">Loading Screen</option>
                  <option value="email">Email Screen</option>
                  <option value="phone">Phone Screen</option>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSend}
                disabled={!status}
              >
                Send
              </Button>
            </CardContent>
          </Card>
        </Fade>
      </Modal>
    </>
  );
}

Results.propTypes = {
  className: PropTypes.string,
  customers: PropTypes.array
};

Results.defaultProps = {
  customers: []
};

export default Results;

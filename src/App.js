import React, {useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from "@material-ui/core/TableFooter";
import Button from "@material-ui/core/Button";
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';

import {
    getUsers,
    deleteUsers,
    loadingData,
    delay,
} from "./redux/Users/users.actions";

import { EnhancedTableHead } from "./components/TableHead";
import './App.css';
import {usersMock} from "./mocks/users.mock";



function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
    },
    header: {
        fontSize: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 0'
    },
    table: {
        minWidth: 750,
    },
    inputDelete: {
        width: '100%',
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    loaderBox: {
        position: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bottom: '0',
        left: '0',
        right: '0',
        top: '0'
    }
}));

const App = ({users, loading, getUsers, deleteUsers, loadingData }) => {

    useEffect(() => {
        loadingData(true)
        delay(1000)
                .then(() => {
                    getUsers(usersMock)
                    loadingData(false)
                })
    }, [getUsers, loadingData])
    const classes = useStyles();
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedUsers, setSelectedUsers] = useState([])

    const deleteSelectedUsers = () => {
        loadingData(true)
        const arrDeleted = users.filter(el => !selected.includes(el.id));
        delay(1000)
                .then(() => {
                    deleteUsers(arrDeleted)
                    setSelected([])
                    setSelectedUsers([])
                    loadingData(false)
                })
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelectedId = users.map((n) => n.id);
            const newSelectedUsers = users.map(n => n.name);
            setSelected(newSelectedId);
            setSelectedUsers(newSelectedUsers)
            return;
        }
        setSelected([]);
        setSelectedUsers([]);
    };

    const handleClick = (event, id, name) => {
        const selectedIndex = selected.indexOf(id);
        let newSelectedId = [];
        let newSelectedUsers = []

        if (selectedIndex === -1) {
            newSelectedId = newSelectedId.concat(selected, id);
            newSelectedUsers = newSelectedUsers.concat(selectedUsers, name)
        } else if (selectedIndex === 0) {
            newSelectedId = newSelectedId.concat(selected.slice(1));
            newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(1))
        } else if (selectedIndex === selected.length - 1) {
            newSelectedId = newSelectedId.concat(selected.slice(0, -1));
            newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelectedId = newSelectedId.concat(
                    selected.slice(0, selectedIndex),
                    selected.slice(selectedIndex + 1),
            );
            newSelectedUsers = newSelectedUsers.concat(
                    selectedUsers.slice(0, selectedIndex),
                    selectedUsers.slice(selectedIndex + 1)
            )
        }

        setSelected(newSelectedId);
        setSelectedUsers(newSelectedUsers)
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    return (
          <div className={classes.root}>
              <Paper className={classes.paper}>
                  <div className={classes.header}>Список пользователей</div>
                  { loading ?
                          (
                                  <div className={classes.loaderBox}>
                                      <CircularProgress />
                                  </div>
                          ) : (
                                  <>
                                      <TableContainer>
                                          <Table
                                                  className={classes.table}
                                                  aria-labelledby="tableTitle"
                                                  aria-label="enhanced table"
                                          >
                                              <EnhancedTableHead
                                                      classes={classes}
                                                      numSelected={selected.length}
                                                      order={order}
                                                      orderBy={orderBy}
                                                      onSelectAllClick={handleSelectAllClick}
                                                      onRequestSort={handleRequestSort}
                                                      rowCount={users.length}
                                              />
                                              <TableBody>
                                                  {stableSort(users, getComparator(order, orderBy))
                                                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                          .map((row, index) => {
                                                              const isItemSelected = isSelected(row.id);
                                                              const labelId = `enhanced-table-checkbox-${index}`;

                                                              return (
                                                                      <TableRow
                                                                              hover
                                                                              onClick={(event) => handleClick(event, row.id, row.name)}
                                                                              role="checkbox"
                                                                              aria-checked={isItemSelected}
                                                                              tabIndex={-1}
                                                                              key={row.name}
                                                                              selected={isItemSelected}
                                                                      >
                                                                          <TableCell padding="checkbox">
                                                                              <Checkbox
                                                                                      checked={isItemSelected}
                                                                                      inputProps={{ 'aria-labelledby': labelId }}
                                                                              />
                                                                          </TableCell>
                                                                          <TableCell
                                                                                  align="left"
                                                                                  component="th"
                                                                                  id={labelId}
                                                                                  scope="row"
                                                                                  padding="none"
                                                                          >
                                                                              {row.name}
                                                                          </TableCell>
                                                                          <TableCell align="left">{row.surname}</TableCell>
                                                                          <TableCell align="left">{row.patronymic}</TableCell>
                                                                          <TableCell align="left">{row.age}</TableCell>
                                                                      </TableRow>
                                                              );
                                                          })}
                                              </TableBody>
                                              <TableFooter>
                                                  <TableRow>
                                                      <TableCell>
                                                          <Button
                                                                  onClick={deleteSelectedUsers}
                                                                  disabled={selected.length === 0}
                                                          >
                                                              Удалить
                                                          </Button>
                                                      </TableCell>
                                                      <TableCell colSpan={10}>
                                                          <Input readOnly value={selectedUsers} className={classes.inputDelete}/>
                                                      </TableCell>
                                                  </TableRow>
                                              </TableFooter>
                                          </Table>
                                      </TableContainer>
                                          <TablePagination
                                                  rowsPerPageOptions={[5, 10, 25]}
                                                  component="div"
                                                  labelRowsPerPage={'Строк на странице'}
                                                  count={users.length}
                                                  labelDisplayedRows={({from, to, count }) => {
                                                      return `${from}-${to} из ${count}`
                                                  }}
                                                  rowsPerPage={rowsPerPage}
                                                  page={page}
                                                  onChangePage={handleChangePage}
                                                  onChangeRowsPerPage={handleChangeRowsPerPage}
                                          />
                                  </>
                  )
                  }
              </Paper>
          </div>
  );
}

const mapStateToProps = state => {
  return {
      users: state.users.list,
      loading: state.users.loading
  }
}

const mapDispatchToProps = dispatch => {
  return {
      loadingData: (status) => dispatch(loadingData(status)),
      getUsers: (users) => dispatch(getUsers(users)),
      deleteUsers: (users) => dispatch(deleteUsers(users))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

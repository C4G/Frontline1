import LoadingIcons from 'react-loading-icons';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import plusFill from '@iconify/icons-eva/plus-fill';
// material
import {
  Card,
  Table,
  Stack,
  Box,
  Button,
  Checkbox,
  Modal,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@mui/material';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import TableListHead from '../components/TableListHead';
import TableMoreMenu from '../components/TableMoreMenu';
import { CreateUserForm, UpdateUserForm } from '../components/authentication/create';
import { fDateTime } from 'src/utils/formatTime';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'isVerified', label: 'Verified', alignRight: false },
  { id: 'lastLoginDate', label: 'Last Login Date', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function Users() {
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState([]);
  const [verified, setVerified] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [updateId, setUpdateId] = useState("");
  const [updateFirstName, setUpdateFirstName] = useState("");
  const [updateLastName, setUpdateLastName] = useState("");
  const [updateIsApproved, setUpdateIsApproved] = useState("");

  const getRoleName = (roleId) => {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].id === roleId) {
        return roles[i].name;
      }
    }
    return "Unknown";
  };

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    const user = JSON.parse(userJson);
    const headers = {
      "Authorization": "Bearer " + user.authToken,
    };
    fetch(process.env.REACT_APP_API_SERVER_PATH + "/Roles", { headers: headers })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(roles => {
        setRoles(roles);
      })
      .catch(error => {
        console.log(error);
      });
    fetch(process.env.REACT_APP_API_SERVER_PATH + "/Users", { headers: headers })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(users => {
        setUsers(users);
        let verified = [];
        users.map((user) => {
          if (user.isApproved) {
            verified = verified.concat(user.id);
          }
          return user;
        });
        setVerified(verified);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [createModalOpen, updateModalOpen]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => `${n.firstName} ${n.lastName}`);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleVerifiedClick = (event, id, firstName, lastName, isApproved) => {
    // Update checkbox.
    const verifiedIndex = verified.indexOf(id);
    let newVerified = [];
    if (verifiedIndex === -1) {
      newVerified = newVerified.concat(verified, id);
    } else if (verifiedIndex === 0) {
      newVerified = newVerified.concat(verified.slice(1));
    } else if (verifiedIndex === verified.length - 1) {
      newVerified = newVerified.concat(verified.slice(0, -1));
    } else if (verifiedIndex > 0) {
      newVerified = newVerified.concat(
        verified.slice(0, verifiedIndex),
        verified.slice(verifiedIndex + 1)
      );
    }
    setVerified(newVerified);
    // Make API Request.
    const userJson = localStorage.getItem("user");
    const user = JSON.parse(userJson);
    const headers = {
      "Authorization": "Bearer " + user.authToken,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    fetch(process.env.REACT_APP_API_SERVER_PATH + "/Users/" + id, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        isApproved: !isApproved,
      }),
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreateModalOpen = () => setCreateModalOpen(true);
  const handleCreateModalClose = () => setCreateModalOpen(false);
  const handleUpdateModalOpen = (id, firstName, lastName, isApproved) => {
    setUpdateModalOpen(true);
    setUpdateId(id);
    setUpdateFirstName(firstName);
    setUpdateLastName(lastName);
    setUpdateIsApproved(isApproved);
  };
  const handleUpdateModalClose = () => setUpdateModalOpen(false);

  if (loading) {
    return <LoadingIcons.SpinningCircles />;
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;
  users.sort((a, b) => a.id - b.id);
  return (
    <Page title="Users | Financial Achievement Club">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Users
          </Typography>
          <Button
            variant="contained"
            startIcon={<Icon icon={plusFill} />}
            onClick={handleCreateModalOpen}
          >
            New User
          </Button>
          <Modal
            open={createModalOpen}
            onClose={handleCreateModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <CreateUserForm onSubmitHandler={handleCreateModalClose}/>
            </Box>
          </Modal>
          <Modal
            open={updateModalOpen}
            onClose={handleUpdateModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <UpdateUserForm
                onSubmitHandler={handleUpdateModalClose}
                id={updateId}
                firstName={updateFirstName}
                lastName={updateLastName}
                isApproved={updateIsApproved}
              />
            </Box>
          </Modal>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableListHead
                  headLabel={TABLE_HEAD}
                  rowCount={users.length}
                  numSelected={selected.length}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {users
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { id, firstName, lastName, roleId, email, refreshTokenExpiryTime } = row;
                      const loginDate = new Date(refreshTokenExpiryTime);
                      loginDate.setDate(loginDate.getDate() - 7);
                      const fullName = `${firstName} ${lastName}`;
                      const isItemSelected = selected.indexOf(fullName) !== -1;
                      const isItemVerified = verified.indexOf(id) !== -1;
                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, fullName)}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography
                                to={"/dashboard/users/" + id}
                                color="inherit"
                                variant="subtitle2"
                                underline="hover"
                                component={RouterLink}
                              >
                                {fullName}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{email}</TableCell>
                          <TableCell align="left">{getRoleName(roleId)}</TableCell>
                          <TableCell align="left">
                            <Checkbox
                              checked={isItemVerified}
                              onChange={(event) => handleVerifiedClick(event, id, firstName, lastName, isItemVerified)}
                            />
                          </TableCell>
                          <TableCell align="left">{fDateTime(loginDate)}</TableCell>
                          <TableCell align="right">
                            <TableMoreMenu openModal={() => {
                              handleUpdateModalOpen(id, firstName, lastName, isItemVerified);
                            }}/>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}

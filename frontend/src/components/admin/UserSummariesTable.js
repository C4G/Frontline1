import LoadingIcons from 'react-loading-icons';
import { useContext, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@mui/material';
// components
import Scrollbar from 'src/components/Scrollbar';
import TableListHead from 'src/components/TableListHead';
import { AuthenticatedUser } from 'src/providers/UserProvider';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'user', label: 'User', alightRight: false },
  { id: 'totalSaved', label: 'Total Saved', alignRight: false },
  { id: 'latestCreditScore', label: 'Latest Credit Score', alignRight: false },
  { id: 'latestIncome', label: 'Latest Income', alignRight: false },
  { id: 'allSavingsValidated', label: 'Savings Validated', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

export default function UserSummariesTable() {
  const { headers } = useContext(AuthenticatedUser);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [savings, setSavings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
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

    fetch(process.env.REACT_APP_API_SERVER_PATH + "/Savings", { headers: headers })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw response;
    })
    .then(data => {
      let allSavings = [];
      for (let i = 0; i < data.length; i++) {
        let userId = data[i].userId;
        let userSavings = data[i].savings;
        let latestCreditScore = 0;
        let latestIncome = 0;
        let validated = true;
        let totalSavings = 0;
        for (let j = 0; j < userSavings.length; j++) {
          if (userSavings[j].savingsType === 2) {
            // Savings
            totalSavings += userSavings[j].value;
          } else if (userSavings[j].savingsType === 1) {
            // Credit Score
            if (latestCreditScore === 0 && userSavings[j].value !== 0) {
              latestCreditScore = userSavings[j].value;
            }
          } else if (userSavings[j].savingsType === 0) {
            // Income
            if (latestIncome === 0 && userSavings[j].value !== 0) {
              latestIncome = userSavings[j].value;
            }
          }
          if (userSavings[j].files) {
            for (let k = 0; k < userSavings[j].files.length; k++) {
              let file = userSavings[j].files[k];
              if (!file.isValidated) {
                validated = false;
              }
            }
          }
        }
        allSavings.push({
          userId: userId,
          totalSavings: totalSavings,
          latestCreditScore: latestCreditScore,
          latestIncome: latestIncome,
          validated: validated,
        });
      }
      setSavings(allSavings);
    })
    .catch(error => {
      console.log(error);
    });
    
    // Fetch users to fill in user names.
    fetch(process.env.REACT_APP_API_SERVER_PATH + "/Users", { headers: headers })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw response;
    })
    .then(users => {
      setUsers(users);
    })
    .catch(error => {
      console.log(error);
    })
    .finally(() => {
      setLoading(false);
    });
  }, [headers]);
    
  const displayValidated = (validated) => {
    if (validated) {
      return "Yes";
    }
    return "No";
  };

  const displayValue = (value) => {
    if (value === 0) {
      return "Not Entered";
    }
    return value;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getUserName = (userId) => {
    const user = users.find((user) => user.id === userId);
    return `${user.firstName} ${user.lastName}`;
  };

  const userRole = roles.find((role) => {
    return role.name === "User";
  });

  let regularUsers = users.filter((user) => {
    return userRole ? user.roleId === userRole.id && user.isApproved: false;
  });

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - regularUsers.length) : 0;

  if (loading) {
    return <LoadingIcons.SpinningCircles />;
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h3" gutterBottom>
          User Details
        </Typography>
      </Stack>
      <Card>
        <Scrollbar>
          <TableContainer>
            <Table>
              <TableListHead
                headLabel={TABLE_HEAD}
              />
              <TableBody>
                {regularUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const { id } = row;
                    const userSavings = savings.find((saving) => saving.userId === id);
                    let totalSavings;
                    let latestCreditScore;
                    let latestIncome;
                    let validated;
                    if (!userSavings) {
                      totalSavings = 0;
                      latestCreditScore = 0;
                      latestIncome = 0;
                      validated = false;
                    } else {
                      totalSavings = userSavings.totalSavings;
                      latestCreditScore = userSavings.latestCreditScore;
                      latestIncome = userSavings.latestIncome;
                      validated = userSavings.validated;
                    }
                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                      >
                        <TableCell align="left">
                          <Typography
                            to={"/dashboard/details/" + id}
                            color="inherit"
                            variant="subtitle2"
                            underline="hover"
                            component={RouterLink}
                          >
                            {getUserName(id)}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">${totalSavings}</TableCell>
                        <TableCell align="left">{displayValue(latestCreditScore)}</TableCell>
                        <TableCell align="left">{displayValue(latestIncome)}</TableCell>
                        <TableCell align="left">{displayValidated(validated)}</TableCell>
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
          count={regularUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}

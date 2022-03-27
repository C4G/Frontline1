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
import Scrollbar from './Scrollbar';
import TableListHead from './TableListHead';
import { fDateTime } from 'src/utils/formatTime';
import { AuthenticatedUser } from 'src/providers/UserProvider';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'user', label: 'User', alightRight: false },
  { id: 'lastUpdated', label: 'Last Updated', alignRight: false },
  { id: 'totalSaved', label: 'Total Saved', alignRight: false },
  { id: 'latestCreditScore', label: 'Latest Credit Score', alignRight: false },
  { id: 'validated', label: 'Validated', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

export default function UserSavings() {
  const { headers } = useContext(AuthenticatedUser);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [savings, setSavings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data for user savings.
  useEffect(() => {
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
        let latestUserSavings = userSavings[0];
        let latestCreditScore = latestUserSavings.ficoScore;
        let validated = true;
        let totalSavings = 0;
        for (let j = 0; j < userSavings.length; j++) {
          totalSavings += userSavings[j].amount;
          if (latestCreditScore === 0 && userSavings[j].ficoScore !== 0) {
            latestCreditScore = userSavings[j].ficoScore;
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
          lastUpdatedDate: latestUserSavings.createdDate,
          totalSavings: totalSavings,
          latestCreditScore: latestCreditScore,
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
  }, []);
    
  const displayValidated = (validated) => {
    if (validated) {
      return "Yes";
    }
    return "No";
  };

  const displayCreditScore = (creditScore) => {
    if (creditScore === 0) {
      return "Not Entered";
    }
    return creditScore;
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - savings.length) : 0;

  if (loading) {
    return <LoadingIcons.SpinningCircles />;
  }

  // Sort savings by index.
  savings.sort(function(a, b){
    return a.createdDate - b.createdDate;
  });

  return (
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Savings
          </Typography>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableListHead
                  headLabel={TABLE_HEAD}
                />
                <TableBody>
                  {savings
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { userId, lastUpdatedDate, totalSavings, latestCreditScore, validated } = row;
                      return (
                        <TableRow
                          hover
                          key={userId}
                          tabIndex={-1}
                          role="checkbox"
                        >
                          <TableCell align="left">
                            <Typography
                              to={"/dashboard/savings/" + userId}
                              color="inherit"
                              variant="subtitle2"
                              underline="hover"
                              component={RouterLink}
                            >
                              {getUserName(userId)}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">{fDateTime(lastUpdatedDate)}</TableCell>
                          <TableCell align="left">${totalSavings}</TableCell>
                          <TableCell align="left">{displayCreditScore(latestCreditScore)}</TableCell>
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
            count={savings.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
  );
}

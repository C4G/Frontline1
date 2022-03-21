import LoadingIcons from 'react-loading-icons';
import { useEffect, useState } from 'react';
// material
import {
  Card,
  Table,
  Stack,
  Checkbox,
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

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'user', label: 'User', alightRight: false },
  { id: 'date', label: 'Date', alignRight: false },
  { id: 'amount', label: 'Amount', alignRight: false },
  { id: 'amountFile', label: 'Amount File', alightRight: false },
  { id: 'amountVerified', label: 'Amount Verified?', alignRight: false },
  { id: 'creditScore', label: 'Credit Score', alignRight: false },
  { id: 'creditScoreFile', label: 'Credit Score File', alightRight: false },
  { id: 'creditScoreVerified', label: 'Credit Score Verified?', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

export default function UserSavings() {
  const userJson = localStorage.getItem("user");
  const user = JSON.parse(userJson);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState([]);
  const [verifiedMap, setVerifiedMap] = useState(new Map());
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [savings, setSavings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data for user savings.
  useEffect(() => {
    const headers = {
      'Authorization': 'Bearer ' + user.authToken,
    };
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
            let userSavings = data[i].savings;
            for (let j = 0; j < userSavings.length; j++) {
                allSavings.push(userSavings[j]);
                for (let k = 0; k < userSavings[j].files.length; k++) {
                    let file = userSavings[j].files[k];
                    let map = new Map(verifiedMap.set(file.id, file.isValidated));
                    setVerifiedMap(map);
                }
            }
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
    }, [user.authToken]);

    const handleVerifiedClick = (event, file) => {
        const isVerified = verifiedMap.get(file.id);
        // Make API Request.
        const userJson = localStorage.getItem("user");
        const user = JSON.parse(userJson);
        const headers = {
          "Authorization": "Bearer " + user.authToken,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        };
        fetch(process.env.REACT_APP_API_SERVER_PATH + "/Files/" + file.id, {
          method: "PUT",
          headers: headers,
          body: JSON.stringify({
            fileId: file.id,
            isValidated: !isVerified,
          }),
        });
        // Update state map.
        const newMap = new Map(verifiedMap.set(file.id, !isVerified));
        setVerifiedMap(newMap);
      };
    
    const displayFileVerified = (files, index) => {
        if (files.length > index) {
            let file = files[index];
            const isVerified = verifiedMap.get(file.id);
            return (
              <Checkbox
                checked={isVerified}
                onChange={(event) => handleVerifiedClick(event, file)}
              />  
            );
        }
        return "-";
    };
    
    const displayFileName = (files, index) => {
        // TODO: Make names clickable to show content.
        if (files.length > index) {
            let file = files[index];
            return file.name;
        }
        return "-";
    };
    
    const displayCreditScore = (creditScore) => {
        if (creditScore === 0) {
            return "-";
        }
        return creditScore;
    };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = savings.map((n) => n.id);
      setSelected(newSelected);
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
                  rowCount={savings.length}
                  numSelected={selected.length}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {savings
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { id, userId, createdDate, amount, ficoScore, files } = row;
                      const isItemSelected = selected.indexOf(id) !== -1;
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
                              onChange={(event) => handleClick(event, id)}
                            />
                          </TableCell>                          
                          <TableCell align="left">{getUserName(userId)}</TableCell>
                          <TableCell align="left">{fDateTime(createdDate)}</TableCell>
                          <TableCell align="left">{amount}</TableCell>
                          <TableCell align="left">{displayFileName(files, 0)}</TableCell>
                          <TableCell align="left">{displayFileVerified(files, 0)}</TableCell>
                          <TableCell align="left">{displayCreditScore(ficoScore)}</TableCell>
                          <TableCell align="left">{displayFileName(files, 1)}</TableCell>
                          <TableCell align="left">{displayFileVerified(files, 1)}</TableCell>
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

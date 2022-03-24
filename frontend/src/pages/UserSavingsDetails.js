import LoadingIcons from 'react-loading-icons';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import Scrollbar from '../components/Scrollbar';
import TableListHead from '../components/TableListHead';
import { fDateTime } from 'src/utils/formatTime';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'uploadDate', label: 'Upload Date', alignRight: false },
  { id: 'amount', label: 'Amount', alignRight: false },
  { id: 'amountFile', label: 'Amount File', alignRight: false },
  { id: 'amountFileValidated', label: 'Amount File Validated', alignRight: false },
  { id: 'creditScore', label: 'Credit Score', alignRight: false },
  { id: 'creditScoreFile', label: 'Credit Score File', alignRight: false },
  { id: 'creditScoreFileValidated', label: 'Credit Score File Validated', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

export default function UserSavingsDetails() {
  let { id: userID } = useParams();
  const userJson = localStorage.getItem("user");
  const adminUser = JSON.parse(userJson);
  const headers = {
    'Authorization': 'Bearer ' + adminUser.authToken,
  };
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState([]);
  const [validatedMap, setValidatedMap] = useState(new Map());
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [savings, setSavings] = useState([]);
  const [totalSavings, setTotalSavings] = useState();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  // Fetch data for user savings.
  useEffect(() => {
    fetch(process.env.REACT_APP_API_SERVER_PATH + "/Savings/" + userID, { headers: headers })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(data => {
        setSavings(data);
        let totalSaved = 0;
        for (let i = 0; i < data.length; i++) {
          let savings = data[i];
          totalSaved += savings.amount;
          if (savings.files) {
            for (let j = 0; j < savings.files.length; j++) {
                let file = savings.files[j];
                let map = new Map(validatedMap.set(file.id, file.isValidated));
                setValidatedMap(map);
            }
          }
        }
        setTotalSavings(totalSaved);
      })
      .catch(error => {
        console.log(error);
      });
    
    // Fetch users to fill in user names.
    fetch(process.env.REACT_APP_API_SERVER_PATH + "/Users/" + userID, { headers: headers })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(user => {
        setUser(user);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
    }, [userID, adminUser.authToken]);
    
    const displayCreditScore = (creditScore) => {
        if (creditScore === 0) {
            return "-";
        }
        return creditScore;
    };

    const handleValidatedClick = (event, file) => {
      const isValidated = validatedMap.get(file.id);
      // Make API Request.
      let newHeaders = {
        "Authorization": "Bearer " + adminUser.authToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };
      fetch(process.env.REACT_APP_API_SERVER_PATH + "/Files/" + file.id, {
        method: "PUT",
        headers: newHeaders,
        body: JSON.stringify({
          fileId: file.id,
          isValidated: !isValidated,
        }),
      });
      // Update state map.
      const newMap = new Map(validatedMap.set(file.id, !isValidated));
      setValidatedMap(newMap);
    };
    
    const displayFileValidated = (files, index) => {
      if (files && files.length > index) {
        let file = files[index];
        const isValidated = validatedMap.get(file.id);
        return (
          <Checkbox
            checked={isValidated}
            onChange={(event) => handleValidatedClick(event, file)}
          />  
        );
      }
      return "-";
    };

    const displayFileName = (files, index) => {
      // TODO: fix file download
      if (files && files.length > index) {
        let file = files[index];
        var blob = new Blob([file.content], {type: "image/png"});
        var url = URL.createObjectURL(blob);
        return (
          <a download href={url}>{file.name}</a>
        );
      }
      return "-";
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
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="h4" gutterBottom>
            Total Saved: {totalSavings}
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
                      const { id, createdDate, amount, ficoScore, files } = row;
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
                          <TableCell align="left">{fDateTime(createdDate)}</TableCell>
                          <TableCell align="left">{amount}</TableCell>
                          <TableCell align="left">{displayFileName(files, 0)}</TableCell>
                          <TableCell align="left">{displayFileValidated(files, 0)}</TableCell>
                          <TableCell align="left">{displayCreditScore(ficoScore)}</TableCell>
                          <TableCell align="left">{displayFileName(files, 1)}</TableCell>
                          <TableCell align="left">{displayFileValidated(files, 1)}</TableCell>
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

import LoadingIcons from 'react-loading-icons';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
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
import Scrollbar from './Scrollbar';
import TableListHead from './TableListHead';
import { CreateSavingsForm } from './authentication/create';
import jwt_decode from 'jwt-decode';
import { fDateTime } from 'src/utils/formatTime';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'date', label: 'Date', alignRight: false },
  { id: 'amount', label: 'Amount', alignRight: false },
  { id: 'amountVerified', label: 'Amount Verified?', alignRight: false },
  { id: 'creditScore', label: 'Credit Score', alignRight: false },
  { id: 'creditScoreVerified', label: 'Credit Score Verified?', alignRight: false },
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

const displayValidated = (files, index) => {
  if (files.length > index) {
    let file = files[index];
    if (file.isValidated) {
        return "Yes";
    }
    return "No";
  }
  return "-";
};

const displayCreditScore = (creditScore) => {
  if (creditScore === 0) {
      return "-";
  }
  return creditScore;
};

const ID_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

export default function UserSavings() {
  const userJson = localStorage.getItem("user");
  const user = JSON.parse(userJson);
  const userID = jwt_decode(user.authToken)[ID_CLAIM];
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [savings, setSavings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data for user savings.
  useEffect(() => {
    fetch(process.env.REACT_APP_API_SERVER_PATH + "/Savings/" + userID, {
      headers: {
        'Authorization': 'Bearer ' + user.authToken,
      },
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(data => {
        setSavings(data);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
    }, [createModalOpen]);

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

  const handleCreateModalOpen = () => setCreateModalOpen(true);
  const handleCreateModalClose = () => setCreateModalOpen(false);

  if (loading) {
    return <LoadingIcons.SpinningCircles />;
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - savings.length) : 0;

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
          <Button
            variant="contained"
            startIcon={<Icon icon={plusFill} />}
            onClick={handleCreateModalOpen}
          >
            Add Savings
          </Button>
          <Modal
            open={createModalOpen}
            onClose={handleCreateModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <CreateSavingsForm onSubmitHandler={handleCreateModalClose}/>
            </Box>
          </Modal>
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
                          <TableCell align="left">{displayValidated(files, 0)}</TableCell>
                          <TableCell align="left">{displayCreditScore(ficoScore)}</TableCell>
                          <TableCell align="left">{displayValidated(files, 1)}</TableCell>
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

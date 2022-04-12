import LoadingIcons from 'react-loading-icons';
import { Icon } from '@iconify/react';
import { useContext, useEffect, useState } from 'react';
import { AuthenticatedUser } from 'src/providers/UserProvider';
import plusFill from '@iconify/icons-eva/plus-fill';
// material
import {
  Card,
  Table,
  Stack,
  Box,
  Button,
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
import TableMoreMenu from './TableMoreMenu';
import { CreateSavingsForm, UpdateSavingsForm } from './authentication/create';
import { fDateTime } from 'src/utils/formatTime';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'date', label: 'Date', alignRight: false },
  { id: 'savingsType', label: 'Type', alignRight: false },
  { id: 'value', label: 'Value', alignRight: false },
  { id: 'fileVerified', label: 'Verified?', alignRight: false },
  { id: '' }
];

const savingTypes = ["Income", "Credit Score", "Savings"];

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
  if (files && files.length > index) {
    let file = files[index];
    if (file.isValidated) {
        return "Yes";
    }
    return "No";
  }
  return "Not Uploaded";
};

export default function UserSavings() {
  const { userID, headers } = useContext(AuthenticatedUser);
  const [page, setPage] = useState(0);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateSavings, setUpdateSavings] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [savings, setSavings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data for user savings.
  useEffect(() => {
    fetch(process.env.REACT_APP_API_SERVER_PATH + "/Savings/" + userID, {
      headers: headers,
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
    }, [createModalOpen, updateModalOpen, headers, userID]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreateModalOpen = () => setCreateModalOpen(true);
  const handleCreateModalClose = () => setCreateModalOpen(false);
  const handleUpdateModalClose = () => setUpdateModalOpen(false);

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
          <Typography variant="h3" gutterBottom>
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
          <Modal
            open={updateModalOpen}
            onClose={handleUpdateModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <UpdateSavingsForm savings={updateSavings} onSubmitHandler={handleUpdateModalClose}/>
            </Box>
          </Modal>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer>
              <Table>
                <TableListHead
                  headLabel={TABLE_HEAD}
                />
                <TableBody>
                  {savings
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { id, createdDate, value, savingsType, files } = row;
                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                        >
                          <TableCell align="left">{fDateTime(createdDate)}</TableCell>
                          <TableCell align="left">{savingTypes[savingsType]}</TableCell>
                          <TableCell align="left">{value}</TableCell>
                          <TableCell align="left">{displayValidated(files, 0)}</TableCell>
                          <TableCell align="right">
                            <TableMoreMenu openModal={() => {
                              setUpdateSavings(row);
                              setUpdateModalOpen(true);
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

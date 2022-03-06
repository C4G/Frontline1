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
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
import TableListHead from '../../../components/TableListHead';
import TableMoreMenu from '../../../components/TableMoreMenu';
import { CreateCourseForm } from '../../../components/authentication/create';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'title', label: 'Title', alignRight: false },
  { id: 'link', label: 'Link', alignRight: false },
  { id: 'isEnabled', label: 'Enabled', alignRight: false },
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

export default function Courses() {
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState([]);
  const [enabled, setEnabled] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data for courses.
  useEffect(() => {
    fetch(process.env.REACT_APP_API_SERVER_PATH + "/Courses")
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(data => {
        setCourses(data);
        let initialEnabled = [];
        data.map((course) => {
          if (course.isEnabled) {
            initialEnabled = initialEnabled.concat(course.id);
          }
          return course;
        });
        setEnabled(initialEnabled);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
    }, [modalOpen]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = courses.map((n) => n.title);
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

  const handleUpdateCourse = (id, index, title, contentLink, isEnabled) => {
    const userJson = localStorage.getItem("user");
    const user = JSON.parse(userJson);
    const headers = {
      "Authorization": "Bearer " + user.authToken,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    fetch(process.env.REACT_APP_API_SERVER_PATH + "/Courses/" + id, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({
        title: title,
        index: index,
        contentLink: contentLink,
        isEnabled: isEnabled,
      }),
    });
  }

  const handleEnabledClick = (event, id, index, title, contentLink) => {
    // Update checkbox.
    const enabledIndex = enabled.indexOf(id);
    let newEnabled = [];
    if (enabledIndex === -1) {
        newEnabled = newEnabled.concat(enabled, id);
    } else if (enabledIndex === 0) {
        newEnabled = newEnabled.concat(enabled.slice(1));
    } else if (enabledIndex === enabled.length - 1) {
        newEnabled = newEnabled.concat(enabled.slice(0, -1));
    } else if (enabledIndex > 0) {
        newEnabled = newEnabled.concat(
        enabled.slice(0, enabledIndex),
        enabled.slice(enabledIndex + 1)
      );
    }
    setEnabled(newEnabled);
    const isItemEnabled = newEnabled.indexOf(id) !== -1;
    handleUpdateCourse(id, index, title, contentLink, isItemEnabled);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  if (loading) {
    return <LoadingIcons.SpinningCircles />;
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - courses.length) : 0;

  // Sort courses by index.
  courses.sort(function(a, b){
    return a.index - b.index;
  });

  return (
    <Page title="Courses">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Courses
          </Typography>
          <Button
            variant="contained"
            startIcon={<Icon icon={plusFill} />}
            onClick={handleOpen}
          >
            Add Course
          </Button>
          <Modal
            open={modalOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <CreateCourseForm onSubmitHandler={handleClose}/>
            </Box>
          </Modal>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableListHead
                  headLabel={TABLE_HEAD}
                  rowCount={courses.length}
                  numSelected={selected.length}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {courses
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { id, index, title, contentLink, questions } = row;
                      const isItemSelected = selected.indexOf(title) !== -1;
                      const isItemEnabled = enabled.indexOf(id) !== -1;
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
                              onChange={(event) => handleClick(event, title)}
                            />
                          </TableCell>                          
                          <TableCell align="left">{title}</TableCell>
                          <TableCell align="left">{contentLink}</TableCell>
                          <TableCell align="left">
                            <Checkbox
                              checked={isItemEnabled}
                              onChange={(event) => handleEnabledClick(event, id, index, title, contentLink)}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <TableMoreMenu />
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
            count={courses.length}
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

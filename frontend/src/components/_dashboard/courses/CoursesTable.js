import LoadingIcons from 'react-loading-icons';
import { Link as RouterLink } from 'react-router-dom';
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
  Checkbox,
  Link,
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
import { CreateCourseForm, UpdateCourseForm } from '../../../components/authentication/create';
import { fDateTime } from 'src/utils/formatTime';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'title', label: 'Title', alignRight: false },
  { id: 'courseNumber', label: 'Course Number', alignRight: false },
  { id: 'link', label: 'Link', alignRight: false },
  { id: 'isEnabled', label: 'Enabled', alignRight: false },
  { id: 'nextClassDate', label: 'Next Class Date', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function Courses() {
  const { headers } = useContext(AuthenticatedUser);
  const [page, setPage] = useState(0);
  const [enabled, setEnabled] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [updateCourse, setUpdateCourse] = useState(null);

  // Fetch data for courses.
  useEffect(() => {
    fetch(process.env.REACT_APP_API_SERVER_PATH + "/Courses", { headers: headers })
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
    }, [createModalOpen, updateModalOpen, headers]);

  const handleUpdateCourse = (id, index, title, contentLink, nextClassDate, isEnabled) => {
    fetch(process.env.REACT_APP_API_SERVER_PATH + "/Courses/" + id, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({
        title: title,
        index: index,
        contentLink: contentLink,
        nextClassDate: nextClassDate,
        isEnabled: isEnabled,
      }),
    });
  }

  const handleEnabledClick = (event, id, index, title, contentLink, nextClassDate) => {
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
    handleUpdateCourse(id, index, title, contentLink, nextClassDate, isItemEnabled);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const displayNextClassDate = (nextClassDate) => {
    if (nextClassDate === null) {
      return "-";
    }
    return fDateTime(nextClassDate);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreateModalOpen = () => setCreateModalOpen(true);
  const handleCreateModalClose = () => setCreateModalOpen(false);
  const handleUpdateModalOpen = (id) => {
    fetch(process.env.REACT_APP_API_SERVER_PATH + '/Courses/' + id, { headers: headers })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(data => {
        setUpdateCourse(data);
        setUpdateModalOpen(true);
      })
      .catch(error => {
        console.log(error);
      });
  };
  const handleUpdateModalClose = () => setUpdateModalOpen(false);

  if (loading) {
    return <LoadingIcons.SpinningCircles />;
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - courses.length) : 0;

  // Sort courses by index.
  courses.sort(function(a, b){
    return a.index - b.index;
  });

  return (
    <Page title="Courses | Financial Achievement Club">
      <Container sx={{minWidth: 1500}}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h3" gutterBottom>
            Course Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Icon icon={plusFill} />}
            onClick={handleCreateModalOpen}
          >
            Add Course
          </Button>
          <Modal
            open={createModalOpen}
            onClose={handleCreateModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <CreateCourseForm onSubmitHandler={handleCreateModalClose}/>
            </Box>
          </Modal>
          <Modal
            open={updateModalOpen}
            onClose={handleUpdateModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <UpdateCourseForm
                onSubmitHandler={handleUpdateModalClose}
                course={updateCourse}
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
                />
                <TableBody>
                  {courses
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { id, index, title, contentLink, nextClassDate } = row;
                      const isItemEnabled = enabled.indexOf(id) !== -1;
                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                        >
                          <TableCell align="left">
                            <Link
                              to={"/dashboard/courses/" + id}
                              color="inherit"
                              variant="subtitle2"
                              underline="always"
                              component={RouterLink}
                            >
                              {title}
                            </Link>
                          </TableCell>
                          <TableCell align="left">{index}</TableCell>
                          <TableCell align="left">{contentLink}</TableCell>
                          <TableCell align="left">
                            <Checkbox
                              checked={isItemEnabled}
                              onChange={(event) => handleEnabledClick(event, id, index, title, contentLink, nextClassDate)}
                            />
                          </TableCell>
                          <TableCell align="left">{displayNextClassDate(nextClassDate)}</TableCell>
                          <TableCell align="right">
                            <TableMoreMenu openModal={() => {
                              handleUpdateModalOpen(id);
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

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
import Scrollbar from '../../../components/Scrollbar';
import TableListHead from '../../../components/TableListHead';
import TableMoreMenu from '../../../components/TableMoreMenu';
import { CreateResourceForm, UpdateResourceForm } from '../../../components/authentication/create';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'link', label: 'Link', alignRight: false },
  { id: 'description', label: 'Description', alignRight: false },
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

export default function CourseResourcesTable(props) {
  const { headers } = useContext(AuthenticatedUser);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedResource, setSelectedResource] = useState();
  const [resources, setResources] = useState(props.course.resources);
  const [loading, setLoading] = useState(true);
  const [deleteFlag, setDeleteFlag] = useState(false);
  useEffect(() => {
    fetch(process.env.REACT_APP_API_SERVER_PATH + "/Courses/" + props.course.id, { headers: headers })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(data => {
        setResources(data.resources);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
    }, [createModalOpen, updateModalOpen, deleteFlag, props.course.id, headers]);

  const deleteResource = (resourceId) => {
    setDeleteFlag(!deleteFlag);
    fetch(process.env.REACT_APP_API_SERVER_PATH + "/Resources/" + resourceId, {
      method: "DELETE",
      headers: headers,
      body: JSON.stringify({
        "resourceId": resourceId,
        "courseId": props.course.id,
      }),
    })
    .catch(error => {
      console.error(error);
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
  const handleUpdateModalOpen = () => setUpdateModalOpen(true);
  const handleUpdateModalClose = () => setUpdateModalOpen(false);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - resources.length) : 0;

  if (loading) {
    return <LoadingIcons.SpinningCircles />;
  }

  // Sort resources by index.
  resources.sort(function(a, b){
    return a.index - b.index;
  });

  return (
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h5">
            Resources
          </Typography>
          <Button
            variant="contained"
            startIcon={<Icon icon={plusFill} />}
            onClick={handleCreateModalOpen}
          >
            Add Resource
          </Button>
          <Modal
            open={createModalOpen}
            onClose={handleCreateModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <CreateResourceForm onSubmitHandler={handleCreateModalClose} courseId={props.course.id}/>
            </Box>
          </Modal>
          <Modal
            open={updateModalOpen}
            onClose={handleUpdateModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <UpdateResourceForm
                onSubmitHandler={handleUpdateModalClose}
                resource={selectedResource}
                courseId={props.course.id}
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
                  {resources
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { id, name, link, description } = row;
                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                        >
                          <TableCell align="left">{name}</TableCell>
                          <TableCell align="left">{link}</TableCell>
                          <TableCell align="left">{description}</TableCell>
                          <TableCell align="right">
                            <TableMoreMenu openModal={() => {
                              setSelectedResource(row);
                              handleUpdateModalOpen();
                            }} deleteEnabled deleteHandler={()=> {
                              deleteResource(id);
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
            count={resources.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
  );
}

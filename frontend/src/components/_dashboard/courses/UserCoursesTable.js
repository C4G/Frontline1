import LoadingIcons from 'react-loading-icons';
import { Link as RouterLink } from 'react-router-dom';

// material
import {
  Card,
  Table,
  Stack,
  Link,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@mui/material';

// components
import Page from '../../Page';
import TableListHead from '../../../components/TableListHead';
import Scrollbar from '../../../components/Scrollbar';
import { AuthenticatedUser } from 'src/providers/UserProvider';
//
import { useContext, useEffect, useState } from 'react';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'title', label: 'Title', alignRight: false },
  { id: 'link', label: 'Link', alignRight: false },
  { id: 'completed', label: 'Completed?', alignRight: false },
  { id: '' }
];

const displayCompleted = (isCompleted) => {
  if (isCompleted) {
    return "Yes";
  }
  return "No";
};

// ----------------------------------------------------------------------

export default function UserCourses() {
  const { headers } = useContext(AuthenticatedUser);
  const [courses, setCourses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(5);
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
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [headers]);
  const [page, setPage] = useState(0);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  courses?.sort((a, b) => a.index - b.index);
  let filteredCourses = courses?.filter((course) => course.isEnabled);
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredCourses.length) : 0;
  if (loading) {
    return <LoadingIcons.SpinningCircles />;
  }
  return (
    <Page title="Courses | Financial Achievement Club">
      <Container sx={{minWidth: 1500}}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h3" gutterBottom>
            Courses
          </Typography>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableListHead
                  headLabel={TABLE_HEAD}
                  rowCount={filteredCourses.length}
                />
                <TableBody>
                  {filteredCourses
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { id, title, contentLink, isCompleted } = row;
                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
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
                          <TableCell align="left">{contentLink}</TableCell>
                          <TableCell align="left">{displayCompleted(isCompleted)}</TableCell>
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
            count={filteredCourses.length}
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

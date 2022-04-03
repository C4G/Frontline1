import LoadingIcons from 'react-loading-icons';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import Scrollbar from 'src/components/Scrollbar';
import TableListHead from 'src/components/TableListHead';
// import { fDateTime } from 'src/utils/formatTime';
import { AuthenticatedUser } from 'src/providers/UserProvider';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'isCompleted', label: 'Is Completed', alignRight: false },
  { id: 'completedOn', label: 'Completed On', alignRight: false },
  { id: '' }
];
    
// ----------------------------------------------------------------------

export default function UserCoursesTable(props) {
  const navigate = useNavigate();
  const { role, headers } = useContext(AuthenticatedUser);
  const [page, setPage] = useState(0);
  const [isCompletedMap, setIsCompletedMap] = useState(new Map());
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_SERVER_PATH + "/Users/" + props.userID, { headers: headers })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(user => {
        setUser(user);
        for (let i = 0; i < user.userCourses.length; i++) {
          let userCourse = user.userCourses[i];
          let map = new Map(isCompletedMap.set(userCourse.courseId, userCourse.isCompleted));
          setIsCompletedMap(map);
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [props.userID, headers]);

  if (role !== "Administrator") {
    navigate('/404', { replace: true });
    return <></>;
  }

  const displayIsCompleted = (courseID) => {
    const isCompleted = isCompletedMap.get(courseID);
    return (
      <Checkbox
        checked={isCompleted}
        onChange={(event) => handleIsCompletedClick(event, courseID)}
      />
    );
  };
  
  const handleIsCompletedClick = (event, courseID) => {
    const isCompleted = isCompletedMap.get(courseID);
    // Make API Request.
    fetch(process.env.REACT_APP_API_SERVER_PATH + "/UserCourses", {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({
        userId: props.userID,
        courseId: courseID,
        isCompleted: !isCompleted,
      }),
    });
    // Update state map.
    const newMap = new Map(isCompletedMap.set(courseID, !isCompleted));
    setIsCompletedMap(newMap);
  };  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - user.userCourses.length) : 0;

  if (loading) {
    return <LoadingIcons.SpinningCircles />;
  }

  // user.userCourses.sort(function(a, b){
  //   return a.createdDate - b.createdDate;
  // });

  return (
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Courses
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
                  {user.userCourses
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { courseId, courseTitle } = row;
                      return (
                        <TableRow
                          hover
                          key={courseId}
                          tabIndex={-1}
                        >
                          <TableCell align="left">{courseTitle}</TableCell>
                          <TableCell align="left">{displayIsCompleted(courseId)}</TableCell>
                          <TableCell align="left">-</TableCell>
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
            count={user.userCourses.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
  );
}

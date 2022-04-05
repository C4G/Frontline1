import LoadingIcons from 'react-loading-icons';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// material
import {
  Box,
  Card,
  Table,
  Stack,
  Checkbox,
  Modal,
  Link,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TextField,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Scrollbar from 'src/components/Scrollbar';
import TableListHead from 'src/components/TableListHead';
// import { fDateTime } from 'src/utils/formatTime';
import { AuthenticatedUser } from 'src/providers/UserProvider';
import { fDateTime } from 'src/utils/formatTime';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'isCompleted', label: 'Is Completed', alignRight: false },
  { id: 'completedOn', label: 'Completed On', alignRight: false },
  { id: '' }
];

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
    
// ----------------------------------------------------------------------

export default function UserCoursesTable(props) {
  const navigate = useNavigate();
  const { role, headers } = useContext(AuthenticatedUser);
  const [page, setPage] = useState(0);
  const [isCompletedMap, setIsCompletedMap] = useState(new Map());
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [questions, setQuestions] = useState([]);

  const QuestionResponse = (props) => {
    let response = "None";
    if (props.question.responses) {
      response = props.question.responses[0].text;
    }
    return (
      <>
        <br/>
        <TextField
          fullWidth
          label={props.question.text}
          value={response}
        />
        <br/>
      </>
    );
  };

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

  const displayCompletedTime = (courseID, updatedDate) => {
    const isCompleted = isCompletedMap.get(courseID);
    if (isCompleted) {
      return fDateTime(updatedDate);
    }
    return "-";
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

  const handleQuestionModalClose = () => setQuestionModalOpen(false);

  user.userCourses.sort(function(a, b){
    return a.courseIndex - b.courseIndex;
  });

  return (
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Courses
          </Typography>
          <Modal
            open={questionModalOpen}
            onClose={handleQuestionModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <Typography variant="h4">
                Responses
              </Typography>
              {questions.map((question) => <QuestionResponse question={question} key={question.id} />)}
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
                  {user.userCourses
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { courseId, courseTitle, updatedDate, questions } = row;
                      return (
                        <TableRow
                          hover
                          key={courseId}
                          tabIndex={-1}
                        >
                          <TableCell align="left">
                            <Link color="inherit" onClick={() => {
                              setQuestions(questions);
                              setQuestionModalOpen(true);
                            }}>
                              {courseTitle}
                            </Link>
                          </TableCell>
                          <TableCell align="left">{displayIsCompleted(courseId)}</TableCell>
                          <TableCell align="left">{displayCompletedTime(courseId, updatedDate)}</TableCell>
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

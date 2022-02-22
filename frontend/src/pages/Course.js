import { useParams } from 'react-router-dom';
import LoadingIcons from 'react-loading-icons'
// material
import { Button, Container, Stack, TextField, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { CoursePlayer } from '../components/_dashboard/courses';
//
import { useEffect, useState } from 'react';


// ----------------------------------------------------------------------

export default function Course() {
  let { id: courseID } = useParams();
  const [course, setCourse] = useState(null);
  const [courseLoading, setCourseLoading] = useState(true);
  const [question, setQuestion] = useState(null);
  const [questionLoading, setQuestionLoading] = useState(true);
  const [response, setResponse] = useState(null);
  const handleSubmit = () => {
    // TODO: fill in API to save question response
    fetch('http://localhost:5278/Courses/' + courseID, { method: "POST" })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .catch(error => {
        console.log(error);
      });
  };
  const handleTextChange = (e) => {
    setResponse(e.target.value);
  };
  useEffect(() => {
    fetch('http://localhost:5278/Courses/' + courseID)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(data => {
        setCourse(data);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setCourseLoading(false);
      });
  }, []);
  useEffect(() => {
    setQuestion("What did you think of the video?");
    // TODO: fill in API to get questions for course
    fetch('http://localhost:5278/Questions/' + courseID)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(data => {
        setQuestion(data);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setQuestionLoading(false);
      });
  }, []);
  if (courseLoading || questionLoading) {
    return <LoadingIcons.SpinningCircles />;
  }
  return (
    <Page title="Dashboard: Course">
      <Container>
        <Stack justifyContent="space-between" mb={1}>
          <Typography variant="h4" gutterBottom>
            {course.title}
          </Typography>
          <CoursePlayer embedLink={course.contentLink} />
          <br/>
          <Typography variant="h5" gutterBottom>
            {question}
          </Typography>
          <TextField
            id="question"
            multiline
            rows={4}
            fullWidth
            onChange={handleTextChange}
          />
        </Stack>
        <Button variant="contained" sx={{float: "right"}} onClick={handleSubmit}>Submit</Button>
      </Container>
    </Page>
  );
}

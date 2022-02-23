import { useParams } from 'react-router-dom';
import LoadingIcons from 'react-loading-icons'
// material
import { Button, Container, Stack, TextField, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { CoursePlayer, CourseQuestion } from '../components/_dashboard/courses';
//
import { useEffect, useState } from 'react';


// ----------------------------------------------------------------------

export default function Course() {
  let { id: courseID } = useParams();
  const [course, setCourse] = useState(null);
  const [courseLoading, setCourseLoading] = useState(true);
  useEffect(() => {
    fetch(process.env.REACT_APP_API_SERVER_PATH + '/Courses/' + courseID)
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
  if (courseLoading) {
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
        </Stack>
        {course.questions.map((question) => CourseQuestion(question))}
      </Container>
    </Page>
  );
}

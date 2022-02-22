import { useParams } from 'react-router-dom';
import LoadingIcons from 'react-loading-icons'
// material
import { Container, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { CoursePlayer } from '../components/_dashboard/courses';
//
import { useEffect, useState } from 'react';


// ----------------------------------------------------------------------

export default function Course() {
  let { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('http://localhost:5278/Courses')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(data => {
        for (var i = 0; i < data.length; i++) {
          var course = data[i];
          if (course.id === id) {
            setCourse(course);
            break;
          }
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  if (loading) {
    return <LoadingIcons.SpinningCircles />;
  }
  return (
    <Page title="Dashboard: Course">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {course.title}
          </Typography>
        </Stack>
        <CoursePlayer embedLink={course.contentLink} />
      </Container>
    </Page>
  );
}

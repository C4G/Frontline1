import LoadingIcons from 'react-loading-icons';
// material
import { Grid, Container, Stack, Typography } from '@mui/material';
// components
import Page from '../../../components/Page';
import { CourseCard } from '../../../components/_dashboard/courses';
//
import { useEffect, useState } from 'react';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function UserCourses() {
  const [courses, setCourses] = useState(null);
  const [loading, setLoading] = useState(true);
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
  courses.sort((a, b) => a.index - b.index);
  return (
    <Page title="Courses">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Courses
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {courses.filter((course) => course.isEnabled).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </Grid>
      </Container>
    </Page>
  );
}

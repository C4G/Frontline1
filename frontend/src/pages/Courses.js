import LoadingIcons from 'react-loading-icons';
// material
import { Grid, Container, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { CourseCard, CourseSort, CourseSearch } from '../components/_dashboard/courses';
//
import POSTS from '../_mocks_/blog';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' }
];

// ----------------------------------------------------------------------

export default function Courses() {
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
  return (
    <Page title="Courses">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Courses
          </Typography>
        </Stack>

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <CourseSearch posts={POSTS} />
          <CourseSort options={SORT_OPTIONS} />
        </Stack>

        <Grid container spacing={3}>
          {courses.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          ))}
        </Grid>
      </Container>
    </Page>
  );
}

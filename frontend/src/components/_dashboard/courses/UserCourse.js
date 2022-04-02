import { useParams } from 'react-router-dom';
import LoadingIcons from 'react-loading-icons';
// material
import { Container, Stack, Typography } from '@mui/material';
// components
import Page from 'src/components/Page';
import { CoursePlayer, CourseQuestion } from 'src/components/_dashboard/courses';
//
import { useContext, useEffect, useState } from 'react';
import { AuthenticatedUser } from 'src/providers/UserProvider';

// ----------------------------------------------------------------------

const Resource = (resource) => {
  return (
    <>
      <Typography variant="h5" gutterBottom>
        {resource.name}
      </Typography>
      <Typography>
        {resource.link}
      </Typography>
      <Typography>
        {resource.description}
      </Typography>
    </>
  );
}

export default function UserCourse() {
  const { headers } = useContext(AuthenticatedUser);
  let { id: courseID } = useParams();
  const [course, setCourse] = useState(null);
  const [courseLoading, setCourseLoading] = useState(true);
  useEffect(() => {
    fetch(process.env.REACT_APP_API_SERVER_PATH + '/Courses/' + courseID, { headers: headers })
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
  }, [courseID]);
  if (courseLoading) {
    return <LoadingIcons.SpinningCircles />;
  }
  course.questions?.sort((a, b) => a.index  - b.index);
  return (
    <Page title="Course | Financial Achievement Club">
      <Container>
        <Stack justifyContent="space-between" mb={1}>
          <Typography variant="h4" gutterBottom>
            {course.title}
          </Typography>
          <CoursePlayer contentLink={course.contentLink} />
          <br/>
        </Stack>
        <Typography variant="h4" gutterBottom>
          Questions
        </Typography>
        {course.questions?.map((question) => <CourseQuestion key={question.id} question={question} />)}
        <br/>
        <br/>
        <Typography variant="h4" gutterBottom>
          Resources
        </Typography>
        {course.resources?.map((resource) => Resource(resource))}
      </Container>
    </Page>
  );
}

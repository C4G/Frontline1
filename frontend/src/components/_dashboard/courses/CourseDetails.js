import { useParams } from 'react-router-dom';
import LoadingIcons from 'react-loading-icons';
import { useContext, useEffect, useState } from 'react';
import { AuthenticatedUser } from 'src/providers/UserProvider';
// components
import Page from '../../../components/Page';
import CourseQuestionsTable from 'src/components/_dashboard/courses/CourseQuestions';
import CourseResourcesTable from 'src/components/_dashboard/courses/CourseResources';
import { Typography, Container } from '@mui/material';
// ----------------------------------------------------------------------

export default function CourseDetail() {
  let { id: courseID } = useParams();
  const { headers } = useContext(AuthenticatedUser);
  const [course, setCourse] = useState();
  const [loading, setLoading] = useState(true);

  // Fetch data for courses.
  useEffect(() => {
    fetch(process.env.REACT_APP_API_SERVER_PATH + "/Courses/" + courseID, { headers: headers })
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
        setLoading(false);
      });
    }, [courseID, headers]);

  if (loading) {
    return <LoadingIcons.SpinningCircles />;
  }

  return (
    <Page title="Course | Financial Achievement Club">
      <Typography variant="h3" gutterBottom>
        {course.title}
      </Typography>
      <br/>
      <br/>
      <CourseQuestionsTable course={course}/>
      <br/>
      <br/>
      <br/>
      <CourseResourcesTable course={course}/>
    </Page>
  );
}

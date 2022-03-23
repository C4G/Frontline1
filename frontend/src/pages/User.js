import { useParams } from 'react-router-dom';
import LoadingIcons from 'react-loading-icons';
// material
import { Container, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { CoursePlayer, CourseQuestion } from '../components/_dashboard/courses';
//
import { useEffect, useState } from 'react';


// ----------------------------------------------------------------------

export default function User() {
  const userJson = localStorage.getItem("user");
  const adminUser = JSON.parse(userJson);
  const headers = {
    "Authorization": "Bearer " + adminUser.authToken,
  };
  let { id: userID } = useParams();
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  console.log(userID);
  useEffect(() => {
    fetch(process.env.REACT_APP_API_SERVER_PATH + '/Courses', { headers: headers })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(data => {
        console.log("USER:", data);
        setUser(data);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setUserLoading(false);
      });
  }, [userID]);
  if (userLoading) {
    return <LoadingIcons.SpinningCircles />;
  }
//   course.questions?.sort((a, b) => a.index  - b.index);
  return (
    <Page title="User | Financial Achievement Club">
      <Container>
        <Stack justifyContent="space-between" mb={1}>
          <Typography variant="h4" gutterBottom>
            {user.firstName}
          </Typography>
          {/* <CoursePlayer contentLink={course.contentLink} /> */}
          <br/>
        </Stack>
        {/* {course.questions?.map((question) => <CourseQuestion key={question.id} question={question} />)} */}
      </Container>
    </Page>
  );
}

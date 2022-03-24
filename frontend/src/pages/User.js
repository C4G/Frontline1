import { useParams } from 'react-router-dom';
import LoadingIcons from 'react-loading-icons';
// material
import { Container, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
//
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

const displayBool = (bool) => {
  if (bool) {
    return "Yes";
  }
  return "No";
};

export default function User() {
  const userJson = localStorage.getItem("user");
  const adminUser = JSON.parse(userJson);
  const headers = {
    "Authorization": "Bearer " + adminUser.authToken,
  };
  let { id: userID } = useParams();
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  useEffect(() => {
    fetch(process.env.REACT_APP_API_SERVER_PATH + '/Users/' + userID, { headers: headers })
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
  const userCourses = user.userCourses.map((userCourse) => {
    return (
      <>
        <br/>
        <Typography variant="h6">
          {userCourse.courseTitle}
        </Typography>
        <Typography>
          Is Completed? {displayBool(userCourse.isCompleted)}
        </Typography>
      </>
    );
  });

  return (
    <Page title="User | Financial Achievement Club">
      <Container>
        <Typography variant="h3" gutterBottom>
          {user.firstName} {user.lastName}
        </Typography>
        <br/>
        <br/>
        <Typography variant="h4">
          Courses
        </Typography>
        {userCourses}
      </Container>
    </Page>
  );
}

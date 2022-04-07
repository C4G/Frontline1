import React, { useContext, useEffect, useState } from 'react';
// material
import { Box, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { AuthenticatedUser } from 'src/providers/UserProvider';
import { fDateTime } from 'src/utils/formatTime';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const { user, headers } = useContext(AuthenticatedUser);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [classSchedule, setClassSchedule] = useState();
  useEffect(() => {
    fetch(process.env.REACT_APP_API_SERVER_PATH + "/WelcomeMessages", { headers: headers })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw response;
    })
    .then(welcomeMessage => {
      setWelcomeMessage(welcomeMessage.message);
    })
    .catch(error => {
      console.log(error);
    });

    fetch(process.env.REACT_APP_API_SERVER_PATH + "/ClassSchedules", { headers: headers })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw response;
    })
    .then(classSchedule => {
      setClassSchedule(classSchedule);
    })
    .catch(error => {
      console.log(error);
    });
  }, [headers]);

  let firstName = "";
  if (user) {
    firstName = user.firstName;
  } else {
    return <></>;
  }
  return (
    <Page title="Dashboard | Financial Achievement Club">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h3">Hi, Welcome back {firstName}</Typography>
        </Box>
        <Typography variant="h3">{welcomeMessage}</Typography>
        <br/>
        <br/>
        <Typography variant="h3">{classSchedule ? "Next Class" : ""}</Typography>
        <Typography variant="h3">{classSchedule ? classSchedule.description : ""}</Typography>
        <Typography variant="h3">{classSchedule ? fDateTime(classSchedule.scheduledDate) : ""}</Typography>
      </Container>
    </Page>
  );
}

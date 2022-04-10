import React, { useContext, useEffect, useState } from 'react';
// material
import { Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { AuthenticatedUser } from 'src/providers/UserProvider';
import { format } from 'date-fns';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const { user, userID, headers } = useContext(AuthenticatedUser);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [hasNextClass, setHasNextClass] = useState(false);
  const [title, setTitle] = useState();
  const [date, setDate] = useState();

  const parseDate = (date) => {
    const newDate = new Date(Date.parse(date));
    return format(newDate, 'dd MMM yyyy HH:mm');
  };

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

    fetch(process.env.REACT_APP_API_SERVER_PATH + "/NextClasses/" + userID, { headers: headers })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw response;
    })
    .then(data => {
      setTitle(data.title);
      setDate(data.date);
      setHasNextClass(true);
    })
    .catch(error => {
      console.error(error);
    });
  }, [headers, userID]);

  if (!user) {
    return <></>;
  }

  const nextClass = (hasNextClass) ? (
    <>
      <Typography variant="h4">Next Class</Typography>
      <br/>
      <Typography variant="h5">{title}</Typography>
      <Typography>{parseDate(date)}</Typography>
    </>
  ) : null;

  return (
    <Page title="Dashboard | Financial Achievement Club">
      <Container maxWidth="xl">
        <Typography variant="h4">{welcomeMessage}</Typography>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        {nextClass}
      </Container>
    </Page>
  );
}

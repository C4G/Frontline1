import LoadingIcons from 'react-loading-icons';
import { useContext, useEffect, useState } from 'react';
// material
import {
  Button,
  Stack,
  Container,
  Typography,
  TextField,
  Collapse,
  Alert,
} from '@mui/material';
// components
import { AuthenticatedUser } from 'src/providers/UserProvider';

// ----------------------------------------------------------------------

export default function WelcomeMessage() {
  const { headers } = useContext(AuthenticatedUser);
  const [loading, setLoading] = useState(true);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);

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
    })
    .finally(() => {
      setLoading(false);
    });
  }, [headers]);

  const handleSubmit = () => {
    fetch(process.env.REACT_APP_API_SERVER_PATH + "/WelcomeMessages", {
      headers: headers,
      method: "PUT",
      body: JSON.stringify({
        message: welcomeMessage,
      }),
    })
    .then(response => {
      setAlertVisible(true);
      if (response.ok) {
        return response.json();
      }
      throw response;
    })
    .catch(error => {
      console.log(error);
    });
  };

  const handleChange = (e) => {
    setWelcomeMessage(e.target.value);
  };

  if (loading) {
    return <LoadingIcons.SpinningCircles />;
  }

  return (
    <Container  sx={{minWidth: 1400}}>
      <Stack spacing={1}>
        <Typography variant="h5" gutterBottom>
          Welcome Message
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          defaultValue={welcomeMessage}
          onChange={handleChange}
        >   
        </TextField>
        <Collapse in={alertVisible}>
          <Alert onClose={() => {setAlertVisible(false);}}>Submitted</Alert>
        </Collapse>
        <Button variant="contained" sx={{float: "right"}} onClick={handleSubmit}>Submit</Button>
      </Stack>
    </Container>
  );
}

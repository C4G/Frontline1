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
import DateTimePicker from '@mui/lab/DateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

// ----------------------------------------------------------------------

export default function ClassSchedule() {
  const { headers } = useContext(AuthenticatedUser);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [initialClassSchedule, setInitialClassSchedule] = useState();
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_SERVER_PATH + "/ClassSchedules", { headers: headers })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw response;
    })
    .then(data => {
      setInitialClassSchedule(data);
      setDescription(data.description);
      setDate(data.scheduledDate);
    })
    .catch(error => {
      console.log(error);
    })
    .finally(() => {
      setLoading(false);
    });
  }, [headers]);

  const handleSubmit = () => {
    const method = initialClassSchedule ? "PUT" : "POST";
    const path = initialClassSchedule ? "/ClassSchedules/" + initialClassSchedule.id : "/ClassSchedules";
    fetch(process.env.REACT_APP_API_SERVER_PATH + path, {
      headers: headers,
      method: method,
      body: JSON.stringify({
        description: description,
        scheduledDate: date,
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

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleTimeChange = (newTime) => {
    setDate(newTime);
  };

  if (loading) {
    return <LoadingIcons.SpinningCircles />;
  }

  return (
    <Container>
      <Stack spacing={1}>
        <Typography variant="h5" gutterBottom>
          Next Class
        </Typography>
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={2}
          defaultValue={description}
          onChange={handleDescriptionChange}
        >   
        </TextField>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="Scheduled Date"
            value={date}
            onChange={handleTimeChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <Collapse in={alertVisible}>
          <Alert onClose={() => {setAlertVisible(false);}}>Submitted</Alert>
        </Collapse>
        <Button variant="contained" sx={{float: "right"}} onClick={handleSubmit}>Submit</Button>
      </Stack>
    </Container>
  );
}

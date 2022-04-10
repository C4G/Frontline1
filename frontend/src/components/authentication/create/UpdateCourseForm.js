import React, { useContext, useState } from 'react';
import { AuthenticatedUser } from 'src/providers/UserProvider';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import DateTimePicker from '@mui/lab/DateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
// ----------------------------------------------------------------------

export default function UpdateCourseForm(props) {
  const { headers } = useContext(AuthenticatedUser);
  const [nextClassDate, setNextClassDate] = useState(props.course.nextClassDate);
  const [dateDirty, setDateDirty] = useState(false);
  const UpdateSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    contentLink: Yup.string().required('Content link is required'),
    index: Yup.number().required('Index is required'),
  });
  const formik = useFormik({
    initialValues: {
      title: props.course.title,
      contentLink: props.course.contentLink,
      index: props.course.index,
    },
    validationSchema: UpdateSchema,
    onSubmit: () => {
      fetch(process.env.REACT_APP_API_SERVER_PATH + "/Courses/" + props.course.id, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({
          "index": getFieldProps('index').value,
          "title": getFieldProps('title').value,
          "contentLink": getFieldProps('contentLink').value,
          "nextClassDate": nextClassDate,
          "isEnabled": props.course.isEnabled,
        }),
      })
      .then(response => {
        if (!response.ok) {
          throw response;
        }
        props.onSubmitHandler();
      })
      .catch(error => {
        console.error(error);
      });
    }
  });

  const handleTimeChange = (newTime) => {
    setNextClassDate(newTime);
    setDateDirty(true);
  };

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, dirty } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            type="text"
            label="Title"
            {...getFieldProps('title')}
            error={Boolean(touched.title && errors.title)}
            helperText={touched.title && errors.title}
          />
          <TextField
            fullWidth
            type="text"
            label="Content Link"
            {...getFieldProps('contentLink')}
            error={Boolean(touched.contentLink && errors.contentLink)}
            helperText={touched.contentLink && errors.contentLink}
          />
          <TextField
            fullWidth
            type="text"
            label="Course Number"
            {...getFieldProps('index')}
            error={Boolean(touched.index && errors.index)}
            helperText={touched.index && errors.index}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Next Class Date"
              value={nextClassDate}
              onChange={handleTimeChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={!dirty && !dateDirty}
          >
            Update Course
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}

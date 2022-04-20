import React, { useContext, useState } from 'react';
import { AuthenticatedUser } from 'src/providers/UserProvider';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Alert, Collapse, Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

export default function CreateCourseForm(props) {
  const { headers } = useContext(AuthenticatedUser);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertText, setAlertText] = useState("");
  const CreateSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    contentLink: Yup.string().required('Content link is required'),
    index: Yup.number().required('Course Number is required'),
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      contentLink: '',
      index: '',
    },
    validationSchema: CreateSchema,
    onSubmit: () => {
      fetch(process.env.REACT_APP_API_SERVER_PATH + "/Courses", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          "index": getFieldProps('index').value,
          "title": getFieldProps('title').value,
          "contentLink": getFieldProps('contentLink').value,
        }),
      })
      .then(response => {
        if (!response.ok) {
          return response.json();
        }
        props.onSubmitHandler();
      })
      .then(error => {
        if (error) {
          throw error;
        }
      })
      .catch(error => {
        setAlertVisible(true);
        setSubmitting(false);
        setAlertText(error);
      });
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, setSubmitting, getFieldProps } = formik;

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

          <Collapse in={alertVisible}>
            <Alert onClose={() => {setAlertVisible(false);}} severity="error">{alertText}</Alert>
          </Collapse>

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Create
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}

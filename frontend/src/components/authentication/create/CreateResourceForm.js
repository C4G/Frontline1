import React, { useContext } from 'react';
import { AuthenticatedUser } from 'src/providers/UserProvider';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

export default function CreateResourceForm(props) {
  const { headers } = useContext(AuthenticatedUser);
  const CreateSchema = Yup.object().shape({
    name: Yup.string().required('Resource name is required'),
    link: Yup.string().required('Resource link is required'),
    description: Yup.string().required('Resource description is required'),
  });

  const formik = useFormik({
    initialValues: {
        name: '',
        link: '',
        description: '',
    },
    validationSchema: CreateSchema,
    onSubmit: () => {
      fetch(process.env.REACT_APP_API_SERVER_PATH + "/Resources", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          "courseId": props.courseId,
          "name": getFieldProps("name").value,
          "link": getFieldProps("link").value,
          "description": getFieldProps("description").value,
        }),
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        props.onSubmitHandler();
      });
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            type="text"
            label="Name"
            {...getFieldProps('name')}
            error={Boolean(touched.name && errors.name)}
            helperText={touched.name && errors.name}
          />
          <TextField
            fullWidth
            type="text"
            label="Link"
            {...getFieldProps('link')}
            error={Boolean(touched.link && errors.link)}
            helperText={touched.link && errors.link}
          />
          <TextField
            fullWidth
            type="text"
            label="Description"
            {...getFieldProps('description')}
            error={Boolean(touched.description && errors.description)}
            helperText={touched.description && errors.description}
          />
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Add Resource
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}

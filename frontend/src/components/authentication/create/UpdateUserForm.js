import React, { useContext, useState } from 'react';
import { AuthenticatedUser } from 'src/providers/UserProvider';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Alert, Collapse, Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

export default function UpdateUserForm(props) {
  const { headers } = useContext(AuthenticatedUser);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertText, setAlertText] = useState("");
  const UpdateSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('First name required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
    phoneNumber: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      firstName: props.firstName,
      lastName: props.lastName,
      phoneNumber: props.phoneNumber,
    },
    validationSchema: UpdateSchema,
    onSubmit: () => {
      const body = {
        "firstName": getFieldProps('firstName').value,
        "lastName": getFieldProps('lastName').value,
        "isApproved": props.isApproved,
      };
      const phoneNumber = getFieldProps('phoneNumber').value;
      if (phoneNumber) {
        body["phoneNumber"] = phoneNumber;
      }
      fetch(process.env.REACT_APP_API_SERVER_PATH + "/Users/" + props.id, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(body),
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
        if (typeof error === "string") {
          setAlertText(error);
        } else {
          setAlertText(error["errors"]["PhoneNumber"][0]);
        }
      });
    }
  });

  const { errors, touched, handleSubmit, setSubmitting, isSubmitting, getFieldProps, dirty } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
            <TextField
              fullWidth
              label="First name"
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />

            <TextField
              fullWidth
              label="Last name"
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />

            <TextField
              fullWidth
              label="Phone number"
              {...getFieldProps('phoneNumber')}
              error={Boolean(touched.phoneNumber && errors.phoneNumber)}
              helperText={touched.phoneNumber && errors.phoneNumber}
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
            disabled={!dirty}
          >
            Update
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}

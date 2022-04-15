import React, { useContext, useState } from 'react';
import { AuthenticatedUser } from 'src/providers/UserProvider';
import * as Yup from 'yup';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

export default function UpdateUserPasswordForm(props) {
  const { headers } = useContext(AuthenticatedUser);
  const [showPassword, setShowPassword] = useState(false);
  const UpdateSchema = Yup.object().shape({
    password: Yup.string().required('Password is required').matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{5,}$/,
      "Must be at least 5 characters, contain One Uppercase, One Lowercase, One Number, and one special case Character"
    ),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: UpdateSchema,
    onSubmit: () => {
      const body = {
        "password": getFieldProps('password').value,
        "confirmPassword": getFieldProps('confirmPassword').value,
      };
      fetch(process.env.REACT_APP_API_SERVER_PATH + "/Users/" + props.id + "/ChangePassword", {
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
        console.error(error);
      });
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, dirty } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
            <TextField
                fullWidth
                autoComplete="current-password"
                type={showPassword ? 'text' : 'password'}
                label="New Password"
                {...getFieldProps('password')}
                InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                    <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                        <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                    </IconButton>
                    </InputAdornment>
                )
                }}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
            />

            <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                label="Confirm New Password"
                {...getFieldProps('confirmPassword')}
                InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                    <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                        <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                    </IconButton>
                    </InputAdornment>
                )
                }}
                error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                helperText={touched.confirmPassword && errors.confirmPassword}
            />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={!dirty}
          >
            Change Password
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}

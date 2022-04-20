import * as Yup from 'yup';
import { useContext, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import { Alert, Collapse, Stack, TextField, IconButton, InputAdornment, InputLabel, Select, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { AuthenticatedUser } from 'src/providers/UserProvider';

// ----------------------------------------------------------------------

export default function CreateUserForm(props) {
  const { headers } = useContext(AuthenticatedUser);
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertText, setAlertText] = useState("");

  useEffect(() => {
    fetch(process.env.REACT_APP_API_SERVER_PATH + "/Roles", { headers: headers })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw response;
    })
    .then(roles => {
      setRoles(roles);
      setSelectedRole(roles[0]);
      setFieldValue("roleId", roles[0].id);
    })
    .catch(error => {
      console.log(error);
    });
  }, [headers])

  const CreateSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('First name required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    phoneNumber: Yup.string(),
    password: Yup.string().required('Password is required').matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
      "Must be at least 6 characters, contain One Uppercase, One Lowercase, One Number, and one special case Character"
    ),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
    roleId: Yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      roleId: '',
    },
    validationSchema: CreateSchema,
    onSubmit: () => {
      const body = {
        "email": getFieldProps('email').value.toLowerCase(),
        "password": getFieldProps('password').value,
        "confirmPassword": getFieldProps('confirmPassword').value,
        "firstName": getFieldProps('firstName').value,
        "lastName": getFieldProps('lastName').value,
        "roleId": getFieldProps('roleId').value,
      };
      const phoneNumber = getFieldProps('phoneNumber').value;
      if (phoneNumber) {
        body["phoneNumber"] = phoneNumber;
      }
      fetch(process.env.REACT_APP_API_SERVER_PATH + "/Users", {
        method: "POST",
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

  const { errors, touched, handleSubmit, setSubmitting, isSubmitting, getFieldProps, setFieldValue } = formik;

  const handleRoleChange = (event) => {
    setFieldValue("roleId", event.target.value.id);
    setSelectedRole(event.target.value);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
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
          </Stack>

          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="phoneNumber"
            label="Phone number"
            {...getFieldProps('phoneNumber')}
            error={Boolean(touched.phoneNumber && errors.phoneNumber)}
            helperText={touched.phoneNumber && errors.phoneNumber}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
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
            label="Confirm password"
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

          <InputLabel id="role-label">Select A Role</InputLabel>
          <Select
            labelId="role-label"
            id="role"
            value={selectedRole}
            label="Role"
            onChange={handleRoleChange}
          >
            {roles.map((role) => {
              return <MenuItem key={role.id} value={role}>{role.name}</MenuItem>;
            })}
          </Select>

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

import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import jwt_decode from 'jwt-decode';

const ID_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

// ----------------------------------------------------------------------

export default function CreateSavingsForm(props) {
  const userJson = localStorage.getItem("user");
  const user = JSON.parse(userJson);
  const userID = jwt_decode(user.authToken)[ID_CLAIM];

  const CreateSchema = Yup.object().shape({
    amount: Yup.number().required('Amount is required'),
    ficoScore: Yup.number(),
  });

  const formik = useFormik({
    initialValues: {
      amount: '',
      ficoScore: '',
    },
    validationSchema: CreateSchema,
    onSubmit: () => {
      fetch(process.env.REACT_APP_API_SERVER_PATH + "/Savings", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "amount": getFieldProps('amount').value,
          "ficoScore": getFieldProps('ficoScore').value,
          "userId": userID,
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

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            type="text"
            label="Amount"
            {...getFieldProps('amount')}
            error={Boolean(touched.amount && errors.amount)}
            helperText={touched.amount && errors.amount}
          />
          <TextField
            fullWidth
            type="text"
            label="FICO Score"
            {...getFieldProps('ficoScore')}
            error={Boolean(touched.ficoScore && errors.ficoScore)}
            helperText={touched.ficoScore && errors.ficoScore}
          />
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Submit
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
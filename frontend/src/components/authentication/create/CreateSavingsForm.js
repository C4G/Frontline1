import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Input, Typography, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import jwt_decode from 'jwt-decode';

const ID_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
const KEY_AMOUNT = "amount";
const KEY_FICO_SCORE = "ficoScore";
const KEY_FILES = "files";

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
      amountFile: null,
      ficoScore: '',
      creditScoreFile: null,
    },
    validationSchema: CreateSchema,
    onSubmit: () => {
      let body = new FormData();

      const amount = getFieldProps(KEY_AMOUNT).value;
      body.append(KEY_AMOUNT, amount);

      const ficoScore = getFieldProps(KEY_FICO_SCORE).value;
      if (ficoScore !== "") {
        body.append(KEY_FICO_SCORE, ficoScore);
      }

      const amountFile = getFieldProps('amountFile').value;
      body.append(KEY_FILES, amountFile);

      const creditScoreFile = getFieldProps('creditScoreFile').value;
      if (creditScoreFile !== null) {
        body.append(KEY_FILES, creditScoreFile);
      }

      body.append("userId", userID);

      fetch(process.env.REACT_APP_API_SERVER_PATH + "/Savings", {
        method: "POST",
        headers: {
          'Authorization': 'Bearer ' + user.authToken,
          'Accept': '*/*',
        },
        body: body,
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

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

  const handleAmountFileChange = (event) => {
    setFieldValue("amountFile", event.currentTarget.files[0]);
  };

  const handleCreditScoreFileChange = (event) => {
    setFieldValue("creditScoreFile", event.currentTarget.files[0]);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type="text"
            label="(Required) Savings Amount"
            {...getFieldProps('amount')}
            error={Boolean(touched.amount && errors.amount)}
            required={true}
         />
          <br/>
          <br/>
          <Typography>
            (Required) Upload an image to verify savings amount:
          </Typography>
          <br/>
          <Input
            fullWidth
            required
            type="file"
            id="amountFile"
            name="amountFile"
            error={Boolean(touched.amountFile && errors.amountFile)}
            onChange={handleAmountFileChange}
          />
          <br/>
          <br/>
          <br/>
          <TextField
            fullWidth
            type="text"
            label="(Optional) Credit Score"
            {...getFieldProps('ficoScore')}
            error={Boolean(touched.ficoScore && errors.ficoScore)}
          />
          <br/>
          <br/>
          <Typography>
            (Optional) Upload an image to verify credit score:
          </Typography>
          <br/>
          <Input
            fullWidth
            type="file"
            id="creditScoreFile"
            name="creditScoreFile"
            onChange={handleCreditScoreFileChange}
          />
          <br/>
          <br/>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={
              !getFieldProps('amount').value ||
              !getFieldProps('amountFile').value
            }
          >
            Submit
          </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
import React, { useContext, useState } from 'react';
import { AuthenticatedUser } from 'src/providers/UserProvider';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Alert, Collapse, Input, InputLabel, MenuItem, Select, Typography, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

const KEY_VALUE = "value";
const KEY_SAVINGS_TYPE = "savingsType";
const KEY_FILES = "files";

// ----------------------------------------------------------------------

export default function CreateSavingsForm(props) {
  const { userID, headers } = useContext(AuthenticatedUser);
  const [selectedType, setSelectedType] = useState(2);
  const savingTypes = ["Income", "Credit Score", "Savings"];
  const types = ['image/png', 'image/jpeg'];
  const [alertVisible, setAlertVisible] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const CreateSchema = Yup.object().shape({
    value: Yup.number().required('Value is required'),
    file: Yup.mixed().test('fileType', "Unsupported File Format", value => { if (value) return types.includes(value.type)} ),
  });

  const formik = useFormik({
    initialValues: {
      value: '',
      file: null,
      savingsTypeId: 2,
    },
    validationSchema: CreateSchema,
    onSubmit: () => {
      let body = new FormData();

      const value = getFieldProps(KEY_VALUE).value;
      body.append(KEY_VALUE, value);

      const file = getFieldProps('file').value;
      body.append(KEY_FILES, file);

      const savingsTypeId = getFieldProps('savingsTypeId').value;
      body.append(KEY_SAVINGS_TYPE, savingsTypeId);

      body.append("userId", userID);

      fetch(process.env.REACT_APP_API_SERVER_PATH + "/Savings", {
        method: "POST",
        headers: {
          "Authorization": headers["Authorization"],
          "Accept": "*/*",
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

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];
    if (allowedTypes.includes(file.type)) {
      setFieldValue("file", file);
      setDisabled(false);
    } else {
      setDisabled(true);
      setAlertVisible(true);
    }
  };

  const handleTypeChange = (event) => {
    setFieldValue("savingsTypeId", event.target.value);
    setSelectedType(event.target.value);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <InputLabel id="type-label">Select A Type</InputLabel>
        <Select
          labelId="type-label"
          id="type"
          value={selectedType}
          label="Type"
          onChange={handleTypeChange}
        >
          {savingTypes.map((savingsType, index) => {
            return <MenuItem key={index} value={index}>{savingsType}</MenuItem>;
          })}
        </Select>
        <br/>
        <br/>
        <TextField
          fullWidth
          type="text"
          label="Value"
          {...getFieldProps('value')}
          error={Boolean(touched.amount && errors.amount)}
          required={true}
          helperText={errors.value && "Please enter a number."}
        />
        <br/>
        <br/>
        <Typography>
          (Required) Upload a JPG or PNG image or PDF to verify savings amount:
        </Typography>
        <br/>
        <Input
          fullWidth
          required
          type="file"
          id="file"
          name="file"
          error={Boolean(touched.file && errors.file)}
          onChange={handleFileChange}
        />
        <br/>
        <br/>
        <Collapse in={alertVisible}>
          <Alert severity="error" onClose={() => {setAlertVisible(false);}}>Please select a .pdf, .png, or .jpeg file</Alert>
        </Collapse>
        <br/>
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={
            !getFieldProps('value').value ||
            !getFieldProps('file').value ||
            disabled
          }
        >
          Submit
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
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

export default function UpdateSavingsForm(props) {
  const { headers } = useContext(AuthenticatedUser);
  const [selectedType, setSelectedType] = useState(props.savings.savingsType);
  const savingTypes = ["Income", "Credit Score", "Savings"];
  const [alertVisible, setAlertVisible] = useState(false);

  const UpdateSchema = Yup.object().shape({
    value: Yup.number().required('Value is required'),
  });

  const formik = useFormik({
    initialValues: {
      value: props.savings.value,
      file: null,
      savingsTypeId: props.savings.savingsType,
    },
    validationSchema: UpdateSchema,
    onSubmit: () => {
      let body = new FormData();

      const value = getFieldProps(KEY_VALUE).value;
      body.append(KEY_VALUE, value);

      const file = getFieldProps('file').value;
      if (file) {
        body.append(KEY_FILES, file);
      }

      const savingsTypeId = getFieldProps('savingsTypeId').value;
      body.append(KEY_SAVINGS_TYPE, savingsTypeId);

      body.append("savingsId", props.savings.id);

      fetch(process.env.REACT_APP_API_SERVER_PATH + "/Savings/" + props.savings.id, {
        method: "PUT",
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
    const allowedTypes = ['image/png', 'image/jpeg'];
    if (allowedTypes.includes(file.type)) {
        setFieldValue("file", file);
    } else {
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
          error={Boolean(touched.value && errors.value)}
          required={true}
        />
        <br/>
        <br/>
        <Typography>
          Upload a JPG or PNG image to verify savings amount:
        </Typography>
        <br/>
        <Input
          fullWidth
          type="file"
          id="file"
          name="file"
          error={Boolean(touched.file && errors.file)}
          onChange={handleFileChange}
        />
        <br/>
        <br/>
        <Collapse in={alertVisible}>
          <Alert severity="error" onClose={() => {setAlertVisible(false);}}>Please select a .png or .jpeg file</Alert>
        </Collapse>
        <br/>
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Update Savings
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
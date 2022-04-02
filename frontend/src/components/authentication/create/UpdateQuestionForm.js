import React, { useContext } from 'react';
import { AuthenticatedUser } from 'src/providers/UserProvider';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

export default function UpdateQuestionForm(props) {
  const { headers } = useContext(AuthenticatedUser);
  const UpdateSchema = Yup.object().shape({
    text: Yup.string().required('Question text is required'),
  });

  const formik = useFormik({
    initialValues: {
      text: props.questionText,
    },
    validationSchema: UpdateSchema,
    onSubmit: () => {
      fetch(process.env.REACT_APP_API_SERVER_PATH + "/Questions/" + props.questionId, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({
          "questionId": props.questionId,
          "courseId": props.courseId,
          "text": getFieldProps("text").value,
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
            label="Text"
            {...getFieldProps('text')}
            error={Boolean(touched.text && errors.text)}
            helperText={touched.text && errors.text}
          />
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Update Question
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}

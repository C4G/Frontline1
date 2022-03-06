import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

export default function CreateCourseForm(props) {

  const CreateSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    contentLink: Yup.string().required('Content link is required'),
    index: Yup.number().required('Index is required'),
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      contentLink: '',
    },
    validationSchema: CreateSchema,
    onSubmit: () => {
      const userJson = localStorage.getItem("user");
      const user = JSON.parse(userJson);
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + user.authToken,
      };
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
            autoComplete="title"
            type="text"
            label="Title"
            {...getFieldProps('title')}
            error={Boolean(touched.title && errors.title)}
            helperText={touched.title && errors.title}
          />
          <TextField
            fullWidth
            autoComplete="contentLink"
            type="text"
            label="Content Link"
            {...getFieldProps('contentLink')}
            error={Boolean(touched.contentLink && errors.contentLink)}
            helperText={touched.contentLink && errors.contentLink}
          />
          <TextField
            fullWidth
            autoComplete="index"
            type="text"
            label="Index"
            {...getFieldProps('index')}
            error={Boolean(touched.index && errors.index)}
            helperText={touched.index && errors.index}
          />
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

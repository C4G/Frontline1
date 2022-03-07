import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

const question = "question";

const userJson = localStorage.getItem("user");
const user = JSON.parse(userJson);
const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': "Bearer " + user.authToken,
};

const putQuestion = (questionId, courseId, index, text) => {
  fetch(process.env.REACT_APP_API_SERVER_PATH + "/Questions/" + questionId, {
    method: "PUT",
    headers: headers,
    body: JSON.stringify({
      "questionId": questionId,
      "courseId": courseId,
      "index": index,
      "text": text,
    }),
  })
  .catch(error => {
    console.error(error);
  });
};

const deleteQuestion = (questionId, courseId) => {
  fetch(process.env.REACT_APP_API_SERVER_PATH + "/Questions/" + questionId, {
    method: "DELETE",
    headers: headers,
    body: JSON.stringify({
      "questionId": questionId,
      "courseId": courseId,
    }),
  })
  .catch(error => {
    console.error(error);
  });
};

const postQuestion = (courseId, index, text) => {
  fetch(process.env.REACT_APP_API_SERVER_PATH + "/Questions", {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      "courseId": courseId,
      "index": index,
      "text": text,
    }),
  })
  .catch(error => {
    console.error(error);
  });
};

const UpdateSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  contentLink: Yup.string().required('Content link is required'),
  index: Yup.number().required('Index is required'),
});

export default function UpdateCourseForm(props) {
  const [questions, setQuestions] = useState(props.course.questions);
  const [questionFields, setQuestionFields] = useState();
  let initialValues = {
    title: props.course.title,
    contentLink: props.course.contentLink,
    index: props.course.index,
  };

  if (props.course.questions) {
    for (let i = 0; i < props.course.questions.length; i++) {
      const questionKey = `${question}${props.course.questions[i].id}`;
      initialValues[questionKey] = props.course.questions[i].text;
    };
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: UpdateSchema,
    onSubmit: () => {
      fetch(process.env.REACT_APP_API_SERVER_PATH + "/Courses/" + props.course.id, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({
          "index": getFieldProps('index').value,
          "title": getFieldProps('title').value,
          "contentLink": getFieldProps('contentLink').value,
          "isEnabled": props.course.isEnabled,
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
      for (const [key, value] of Object.entries(values)) {
        if (key.startsWith("newQuestion")) {
          const questionIndex = key.replace("newQuestion", "");
          postQuestion(props.course.id, questionIndex, value);
        } else if (key.startsWith(question)) {
          const questionID = key.replace(question, "");
          putQuestion(questionID, props.course.id, 0, value);
        }
      }
    }
  });

  const addQuestion = () => {
    let newQuestions = questions.concat({courseId: props.course.id});
    setQuestions(newQuestions);
  };

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, values, dirty } = formik;
  useEffect(() => {
    let newQuestionFields = questions.map((question, index) => {
      const questionLabel = `Question ${index+1}`;
      const questionKey = (question.id) ? `question${question.id}` : `newQuestion${index+1}`;
      return (
        <TextField
          key={questionLabel}
          type="text"
          label={questionLabel}
          {...getFieldProps(questionKey)}
          InputProps={{
            endAdornment: 
              <Icon 
                style={{cursor:"pointer"}}
                onClick={() => deleteQuestion(question.id, props.course.id)}
                icon={trash2Outline}
                width={24}
                height={24}
              />
          }}
        />
      );
    });
    setQuestionFields(newQuestionFields);
  }, [questions]);

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            type="text"
            label="Title"
            {...getFieldProps('title')}
            error={Boolean(touched.title && errors.title)}
            helperText={touched.title && errors.title}
          />
          <TextField
            fullWidth
            type="text"
            label="Content Link"
            {...getFieldProps('contentLink')}
            error={Boolean(touched.contentLink && errors.contentLink)}
            helperText={touched.contentLink && errors.contentLink}
          />
          <TextField
            fullWidth
            type="text"
            label="Index"
            {...getFieldProps('index')}
            error={Boolean(touched.index && errors.index)}
            helperText={touched.index && errors.index}
          />
          {questionFields}
          <LoadingButton
            fullWidth
            size="small"
            variant="contained"
            onClick={addQuestion}
          >
            New Question
          </LoadingButton>
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

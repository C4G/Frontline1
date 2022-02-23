import React from "react";
import { Button, TextField, Typography } from '@mui/material';

function CourseQuestion(question) {
  let response;
  const handleSubmit = () => {
    // TODO: fill in API to save question response
    fetch(process.env.REACT_APP_API_SERVER_PATH + "/Courses/" + question.courseId + "/Questions/" + question.id, {
      method: "POST",
      body: JSON.stringify(response),
    }).then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .catch(error => {
        console.log(error);
      });
  };
  const handleChange = (e) => {
    response = e.target.value;
  };
  return (
    <>
      <Typography variant="h5" gutterBottom>
        {question.text}
      </Typography>
      <TextField
        id="question"
        multiline
        rows={4}
        fullWidth
        onChange={handleChange}
      />
      <Button variant="contained" sx={{float: "right"}} onClick={handleSubmit}>Submit</Button>
    </>
  );
}

export default CourseQuestion;

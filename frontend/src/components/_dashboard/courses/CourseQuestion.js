import React from "react";
import { Button, TextField, Typography } from '@mui/material';

function CourseQuestion(question) {
  const userJson = localStorage.getItem("user");
  const user = JSON.parse(userJson);
  if (!user) {
    return <></>;
  }
  let response = {
    questionId: question.id,
  };
  const handleSubmit = () => {
    fetch(process.env.REACT_APP_API_SERVER_PATH + "/Responses", {
      headers: {
        "Authorization": "Bearer " + user.authToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
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
    response.text = e.target.value;
  };
  // TODO: need GET Response API to fill in initial value of text box
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

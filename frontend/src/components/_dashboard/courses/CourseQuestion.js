import React, { useContext, useState } from "react";
import { Button, TextField, Typography } from '@mui/material';
import { AuthenticatedUser } from 'src/providers/UserProvider';

function CourseQuestion({question}) {
  const { userID, headers } = useContext(AuthenticatedUser);
  const [submitted, setSubmitted] = useState(false);

  let response = {
    questionId: question.id,
  };
  const handleSubmit = () => {
    fetch(process.env.REACT_APP_API_SERVER_PATH + "/Responses", {
      headers: headers,
      method: "POST",
      body: JSON.stringify(response),
    }).then(response => {
      setSubmitted(true);
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
    setSubmitted(false);
  };
  const initialResponse = question.responses?.find((response) => response.userId === userID);
  const buttonText = submitted ? "Saved" : "Submit";
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
        defaultValue={(initialResponse && initialResponse.text) || ""}
      />
      <Button variant="contained" sx={{float: "right"}} onClick={handleSubmit} disabled={submitted}>{buttonText}</Button>
    </>
  );
}

export default CourseQuestion;

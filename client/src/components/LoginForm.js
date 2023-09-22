// see SignupForm.js for comments
import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";

import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";

import Auth from "../utils/auth";

const LoginForm = () => {
  const [userFormData, setUserFormData] = useState({ email: "", password: "" });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  //Define a mutation hook named 'login' and destructure its 'error' property

  const [login, { error }] = useMutation(LOGIN_USER);
  // This useEffect hook runs whenever 'error' changes.
  useEffect(() => {
    // Check if 'error' exists (i.e., there was an error during the mutation).
    if (error) {
      setShowAlert(true);
    } else {
      // If there's an error, set 'showAlert' to true to display an alert.
      setShowAlert(false);
    }
  }, [error]);
  // Log the 'login' object for debugging purposes.
  console.log("Login", login);

  // Define a function to handle input changes in the form.
  const handleInputChange = (event) => {
    // Extract the 'name' and 'value' properties from the input element.
    const { name, value } = event.target;
    // Update the 'userFormData' state by spreading its current values and updating the 'name' property.
    setUserFormData({ ...userFormData, [name]: value });
  };

  // Define a function to handle form submission.
  const handleFormSubmit = async (event) => {
    // Prevent the default form submission behavior, which would cause a page reload.
    event.preventDefault();

    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    // Try to execute the login mutation with the provided user data.
    try {
      // Use the 'login' mutation function, passing in the user form data as variables.
      const { data } = await login({
        variables: { ...userFormData },
      });

      console.log(data);

      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
    }
    // After the login attempt, reset the 'userFormData' state to clear the form input fields.
    setUserFormData({
      username: "",
      email: "",
      password: "",
    });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert
          dismissible
          onClose={() => setShowAlert(false)}
          show={showAlert}
          variant="danger"
        >
          Something went wrong with your login credentials!
        </Alert>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your email"
            name="email"
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type="invalid">
            Email is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type="invalid">
            Password is required!
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type="submit"
          variant="success"
        >
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;

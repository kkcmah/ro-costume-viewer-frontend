import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Form, Formik, FormikHelpers } from "formik";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import { UserLoginCreds } from "../../types";
import { MyTextField } from "../FormFields";
import usersService from "../../services/usersService";
import Notification from "../AlertNotification/AlertNotification";
import useAlertNotification from "../AlertNotification/useAlertNotification";
import "./SignUp.css";
import { formatErrorAsString } from "../../services/helpersService";
import { useTitle } from "../../hooks/useTitle";

interface LoginProps {
  title: string;
}

const Login = ({ title }: LoginProps) => {
  useTitle(title);
  const { setErrorMsg, setSuccessMsg, ...notif } = useAlertNotification();
  const [newAccCreated, setnewAccCreated] = useState<boolean>(false);

  const handleSignUp = async (
    values: UserLoginCreds,
    actions: FormikHelpers<UserLoginCreds>
  ) => {
    try {
      await usersService.signUp(values);
      setnewAccCreated(true);
      setSuccessMsg("Account created!");
      actions.resetForm();
    } catch (error) {
      setErrorMsg(formatErrorAsString(error));
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      {!newAccCreated && (
        <Typography textAlign="center" mb={2}>
          Existing account?{" "}
          <Link component={RouterLink} to="/login">
            Login
          </Link>
        </Typography>
      )}
      <Notification {...notif}></Notification>
      {newAccCreated && (
        <Typography textAlign="center" mb={2}>
          <Link component={RouterLink} to="/login">
            Proceed to login
          </Link>
        </Typography>
      )}
      <Formik
        initialValues={{ username: "", password: "" }}
        validate={(values) => {
          const errors: { [field: string]: string } = {};
          if (!values.username) {
            errors.username = "Required";
          } else if (
            values.username.length < 3 ||
            values.username.length > 50
          ) {
            errors.username = "username must be between 3 - 50 characters";
          }

          if (!values.password) {
            errors.password = "Required";
          } else if (values.password.length < 3) {
            errors.password = "password must be longer than 3 characters";
          }

          return errors;
        }}
        onSubmit={(values, actions) => {
          void handleSignUp(values, actions);
        }}
      >
        {({ isValid, dirty, isSubmitting }) => (
          <Form>
            <MyTextField
              id="signup-username-input"
              name="username"
              type="text"
              label="Username"
              data-cy="username-input"
            />
            <MyTextField
              id="signup-password-input"
              name="password"
              type="password"
              label="Password"
              data-cy="password-input"
            />
            <div>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                type="submit"
                data-cy="signup-btn"
                disabled={!dirty || !isValid || isSubmitting}
              >
                Sign Up
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;

import { Form, Formik } from "formik";
import { useContext } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import { StateContext } from "../../state/state";
import { setUser } from "../../state/reducer";
import loginService from "../../services/loginService";
import { UserLoginCreds } from "../../types";
import { MyTextField } from "../FormFields";
import useAlertNotification from "../AlertNotification/useAlertNotification";
import AlertNotification from "../AlertNotification/AlertNotification";
import { formatErrorAsString } from "../../services/helpersService";
import "./Login.css";
import { useTitle } from "../../hooks/useTitle";

interface LoginProps {
  title: string;
}

const Login = ({ title }: LoginProps) => {
  useTitle(title);
  const [, dispatch] = useContext(StateContext);
  const { setErrorMsg, ...notif } = useAlertNotification();
  const navigate = useNavigate();

  const handleLogin = async (values: UserLoginCreds) => {
    try {
      const userWithToken = await loginService.login(values);
      dispatch(setUser(userWithToken));
      navigate("/");
    } catch (error) {
      setErrorMsg(formatErrorAsString(error));
    }
  };

  return (
    <div className="login-container">
      <Typography variant="h3" mb={1}>Login</Typography>
      <AlertNotification {...notif}></AlertNotification>
      <Formik
        initialValues={{ username: "", password: "" }}
        validate={(values) => {
          const errors: { [field: string]: string } = {};
          if (!values.username) {
            errors.username = "Required";
          }

          if (!values.password) {
            errors.password = "Required";
          }

          return errors;
        }}
        onSubmit={handleLogin}
      >
        {({ isValid, dirty, isSubmitting }) => (
          <Form>
            <MyTextField
              id="login-username-input"
              name="username"
              type="text"
              label="Username"
              required={true}
              data-cy="login-username-input"
            />
            <MyTextField
              id="login-password-input"
              name="password"
              type="password"
              label="Password"
              required={true}
              data-cy="login-password-input"
            />
            <div className="login-btn-container">
              <Button
                fullWidth
                color="primary"
                variant="outlined"
                type="submit"
                disabled={!dirty || !isValid || isSubmitting}
                data-cy="login-btn"
              >
                Log in
              </Button>
            </div>
          </Form>
        )}
      </Formik>
      <div>
        No account?{" "}
        <Link component={RouterLink} to="/signup" data-cy="signup-link">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Login;

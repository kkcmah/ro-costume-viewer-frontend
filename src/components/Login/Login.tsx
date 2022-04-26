import { Form, Formik } from "formik";
import { useContext } from "react";
import Button from "@material-ui/core/Button";

import { StateContext } from "../../state/state";
import { setUser } from "../../state/reducer";
import loginService from "../../services/loginService";
import { UserLoginCreds } from "../../types";
import { MySelect, MyTextField, SelectOption } from "../FormFields";

const Login = () => {
  const [state, dispatch] = useContext(StateContext);

  const handleLogin = async (values: UserLoginCreds) => {
    try {
      const userWithToken = await loginService.login(values);
      dispatch(setUser(userWithToken));
    } catch (error) {
      console.error(error);
    }
  };

  const selectOptions: SelectOption[] = [
    { value: 0, label: "zero" },
    { value: 1, label: "one" },
    { value: 2, label: "two" },
  ];

  return (
    <div>
      <h1>Login</h1>
      <div>{state.user?.username}</div>
      <Formik
        initialValues={{ username: "", password: "", test: [] }}
        validate={(values) => {
          const errors: { [field: string]: string } = {};
          if (!values.username) {
            errors.username = "Required";
          }

          if (!values.password) {
            errors.password = "Required";
          }

          if (values.test.length === 0) {
            errors.test = "Required";
          }
          return errors;
        }}
        onSubmit={handleLogin}
      >
        {({ isValid, dirty, isSubmitting }) => (
          <Form>
            <MyTextField name="username" type="text" label="Username" />
            <MyTextField name="password" type="password" label="Password" />
            <MySelect
              name="test"
              label="Select slots"
              options={selectOptions}
            ></MySelect>
            <div>
              <Button
                color="primary"
                variant="contained"
                type="submit"
                disabled={!dirty || !isValid || isSubmitting}
              >
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;

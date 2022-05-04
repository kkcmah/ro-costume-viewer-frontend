import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Form, Formik } from "formik";
import { Link } from "react-router-dom";
import { MySwitch, MyTextField } from "../FormFields";

export interface CreateSetFormValues {
  // length 1- 100
  name: string;
  // maxlength 300
  description: string;
  isPublic: boolean;
}

interface CreateSetFormProps {
  handleCreate: (formValues: CreateSetFormValues) => Promise<void>;
  initialValues: CreateSetFormValues;
  hasCostumesInSet: boolean;
  isSubmitted: boolean;
}

const CreateSetForm = ({
  handleCreate,
  initialValues,
  hasCostumesInSet,
  isSubmitted,
}: CreateSetFormProps) => {
  return (
    <Box mb={1} maxWidth="800px">
      <Formik
        initialValues={initialValues}
        validate={(values) => {
          const errors: { [field: string]: string } = {};
          if (!values.name) {
            errors.name = "Required";
          }

          if (values.name.length < 1 || values.name.length > 100) {
            errors.name = `Name must be between 1 - 100 characters. Currently: ${values.name.length} chars`;
          }

          if (values.description.length > 300) {
            errors.description = `Description must be less than 300 characters. Currently: ${values.description.length} chars`;
          }

          return errors;
        }}
        onSubmit={handleCreate}
      >
        {({ isValid, isSubmitting, dirty }) => (
          <Form>
            <MyTextField
              id="create-name-input"
              name="name"
              type="text"
              label="Name"
              required={true}
              disabled={isSubmitted}
            />
            <MyTextField
              id="create-description-input"
              name="description"
              type="text"
              label="Description"
              minRows={3}
              multiline={true}
              disabled={isSubmitted}
            />
            <MySwitch
              name="isPublic"
              label="Public"
              id="create-public-switch"
              disabled={isSubmitted}
            />

            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                id="create-set-btn"
                color="primary"
                variant="outlined"
                type="submit"
                disabled={
                  !isValid || isSubmitting || !hasCostumesInSet || isSubmitted
                }
              >
                Create
              </Button>
              {dirty && isValid && !hasCostumesInSet && (
                <Typography color="error">
                  Select at least one costume from below to include in set
                </Typography>
              )}
              {isSubmitted && (
                <Alert severity="success">
                  Costume set created! Head on over to{" "}
                  <Link to="/sets">Sets</Link> or{" "}
                  <Link to="/profile">Profile</Link>
                </Alert>
              )}
            </Stack>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateSetForm;

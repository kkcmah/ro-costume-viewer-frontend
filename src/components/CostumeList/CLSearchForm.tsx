import Button from "@mui/material/Button";
import { Form, Formik } from "formik";
import { EquipSlot } from "../../types";
import { MySelect, MyTextField, SelectOption } from "../FormFields";
import "./CLSearchForm.css";

export interface CLSearchValues {
  itemId: string;
  name: string;
  equipSlots: string[];
}

interface CLSearchFormProps {
  handleSearch: (formValues: CLSearchValues) => void;
  handleReset: () => void;
  initialValues: CLSearchValues;
  loading: boolean;
}

const CLSearchForm = ({
  handleSearch,
  handleReset,
  initialValues,
  loading,
}: CLSearchFormProps) => {
  const selectOptions: SelectOption[] = Object.values(EquipSlot).map((slot) => {
    return { value: slot, label: slot };
  });

  return (
    <div className="cl-search-form">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validate={(values) => {
          const errors: { [field: string]: string } = {};
          if (isNaN(+values.itemId)) {
            errors.itemId = "Please input a number or leave empty";
          }

          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          handleSearch(values);
          setSubmitting(false);
        }}
      >
        {({ isValid, isSubmitting }) => (
          <Form>
            <MyTextField
              id="search-itemid-input"
              name="itemId"
              type="text"
              label="Item id"
            />
            <MyTextField
              id="search-name-input"
              name="name"
              type="text"
              label="Name"
            />
            <MySelect
              name="equipSlots"
              label="Equip Slots"
              id="search-equipSlots-input"
              labelId="search-equipSlots-input-label"
              options={selectOptions}
            ></MySelect>
            <div>
              <Button
                id="search-btn"
                color="primary"
                variant="outlined"
                type="submit"
                disabled={!isValid || isSubmitting || loading}
              >
                Search
              </Button>
              <Button color="primary" variant="outlined" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CLSearchForm;

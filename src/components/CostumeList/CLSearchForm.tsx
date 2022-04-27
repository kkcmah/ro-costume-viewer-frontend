import Button from "@material-ui/core/Button";
import { Form, Formik } from "formik";
import { MySelect, MyTextField, SelectOption } from "../FormFields";

// interface CLSearchFormProps {
//     handleSearch: () => void
// }

const CLSearchForm = () => {
  const selectOptions: SelectOption[] = [
    { value: 0, label: "zero" },
    { value: 1, label: "one" },
    { value: 2, label: "two" },
  ];

  const handleSearch = () => {
    console.log("searching...");
  };

  return (
    <div className="cl-search-form" style={{ marginTop: "2em" }}>
      <Formik
        initialValues={{ itemId: "", name: "", equipSlots: [] }}
        validate={(values) => {
          const errors: { [field: string]: string } = {};
          if (isNaN(+values.itemId)) {
            errors.itemId = "Please input a number or leave empty";
          }
          if (values.equipSlots.length === 0) {
            errors.equipSlots = "Required";
          }
          return errors;
        }}
        onSubmit={handleSearch}
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
                color="primary"
                variant="outlined"
                type="submit"
                disabled={!isValid || isSubmitting}
              >
                Search
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CLSearchForm;

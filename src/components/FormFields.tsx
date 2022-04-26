import { useField } from "formik";
import { TextField } from "@material-ui/core";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import "./FormFields.css";

export interface SelectOption {
  value: string | number;
  label: string;
}

interface MyFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  id?: string;
}

export const MyTextField = ({ label, ...props }: MyFieldProps) => {
  const [field, meta] = useField(props);
  return (
    <div className="my-text-field">
      <TextField
        fullWidth
        label={label}
        error={meta.touched && Boolean(meta.error)}
        helperText={meta.touched && meta.error}
        {...field}
      ></TextField>
    </div>
  );
};

interface MySelectProps {
  name: string;
  label: string;
  options: SelectOption[];
}

export const MySelect = ({ name, label, options }: MySelectProps) => {
  const [field, meta] = useField(name);
  return (
    <div>
      <FormControl fullWidth error={meta.touched && Boolean(meta.error)}>
        <InputLabel>{label}</InputLabel>
        <Select multiple {...field}>
          {options.map((op) => (
            <MenuItem key={op.value} value={op.value}>
              {op.label}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{meta.touched && meta.error}</FormHelperText>
      </FormControl>
    </div>
  );
};

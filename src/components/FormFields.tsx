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
  id: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}

export const MyTextField = ({ label, id, type, ...props }: MyFieldProps) => {
  const [field, meta] = useField(props);
  return (
    <div className="my-text-field">
      <TextField
        fullWidth
        id={id}
        label={label}
        type={type}
        variant="outlined"
        required={props.required}
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
  id: string;
  labelId: string;
  options: SelectOption[];
}

export const MySelect = ({
  name,
  label,
  id,
  labelId,
  options,
}: MySelectProps) => {
  const [field, meta] = useField(name);
  return (
    <div>
      <FormControl
        sx={{ marginBottom: "10px" }}
        fullWidth
        error={meta.touched && Boolean(meta.error)}
      >
        <InputLabel id={labelId}>{label}</InputLabel>
        <Select multiple id={id} labelId={labelId} {...field}>
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

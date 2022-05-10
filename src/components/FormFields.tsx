import { useField } from "formik";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
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
  multiline?: boolean;
  minRows?: number;
  disabled?: boolean;
}

export const MyTextField = ({
  label,
  id,
  type,
  // multiline = false,
  minRows = 1,
  ...props
}: MyFieldProps) => {
  const [field, meta] = useField(props);
  return (
    <div className="mb-8px">
      <TextField
        fullWidth
        id={id}
        label={label}
        type={type}
        // multiline={multiline}
        minRows={minRows}
        variant="outlined"
        required={props.required}
        error={meta.touched && Boolean(meta.error)}
        helperText={meta.touched && meta.error}
        {...field}
        {...props}
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
    <div className="mb-8px">
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

interface MySwitchProps {
  name: string;
  label: string;
  id: string;
  disabled?: boolean;
}

// https://stackoverflow.com/questions/68346727/formik-checkbox-value-not-showing-checked-for-a-true-value
// in order to maintain the checked state when reinitializing, set checked=field value
export const MySwitch = ({ name, label, id, ...props }: MySwitchProps) => {
  const [field] = useField(name);
  return (
    <div className="mb-8px">
      <FormControlLabel
        control={
          <Switch
            color="info"
            id={id}
            checked={field.value as boolean}
            {...field}
            {...props}
          />
        }
        label={label}
      />
    </div>
  );
};

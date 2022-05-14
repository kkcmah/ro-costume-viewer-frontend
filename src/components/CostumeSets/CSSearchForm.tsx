import { ChangeEvent, useState, SyntheticEvent } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import SearchIcon from "@mui/icons-material/Search";

interface CSSearchFormProps {
  handleSearch: (event: SyntheticEvent, name: string) => void;
  loading: boolean;
}

const CSSearchForm = ({ handleSearch, loading }: CSSearchFormProps) => {
  const [name, setName] = useState<string>("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  return (
    <Box
      component="form"
      sx={{ display: "flex", justifyContent: "end" }}
      noValidate
      autoComplete="off"
      onSubmit={(e: SyntheticEvent) => {
        handleSearch(e, name);
      }}
    >
      <FormControl variant="standard">
        <InputLabel htmlFor="cs-search-name">Search Name</InputLabel>
        <Input
          id="cs-search-name"
          type="text"
          value={name}
          onChange={handleChange}
          placeholder="Search Name"
          data-cy="cs-search-name"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="search name"
                disabled={loading}
                onClick={(e: SyntheticEvent) => handleSearch(e, name)}
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
    </Box>
  );
};

export default CSSearchForm;

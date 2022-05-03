import { ChangeEvent, SyntheticEvent } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import SearchIcon from "@mui/icons-material/Search";

interface CSSearchFormProps {
  name: string;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSearch: (event: SyntheticEvent) => void;
}

const CSSearchForm = ({
  name,
  handleChange,
  handleSearch,
}: CSSearchFormProps) => {
  return (
    <Box
      component="form"
      sx={{ display: "flex", justifyContent: "end" }}
      noValidate
      autoComplete="off"
      onSubmit={handleSearch}
    >
      <FormControl variant="standard">
        <InputLabel htmlFor="cs-search-name">Search Name</InputLabel>
        <Input
          id="cs-search-name"
          type="text"
          value={name}
          onChange={handleChange}
          placeholder="Search Name"
          endAdornment={
            <InputAdornment position="end">
              <IconButton aria-label="search name" onClick={handleSearch}>
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

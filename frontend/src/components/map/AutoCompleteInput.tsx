import { useState, SyntheticEvent, useEffect } from "react";
import { TextField, CircularProgress, Box, Autocomplete } from "@mui/material";
import useDebounce from "../../hooks/useDebounce";
import { Suggestion } from "../../types/Geolocation";
import { fetchGeoSuggestions } from "../../api/fetchGeoSuggestions";

interface AutocompleteInputProps {
  onSelect: (suggestion: Suggestion) => void;
}

function AutocompleteInput({ onSelect }: AutocompleteInputProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const debouncedInputValue = useDebounce(inputValue, 700);

  useEffect(() => {
    const getSuggestions = async () => {
      setLoading(true);
      const fetchedSuggestions = await fetchGeoSuggestions(debouncedInputValue);
      setSuggestions(fetchedSuggestions);
      setLoading(false);
    };
    getSuggestions();
  }, [debouncedInputValue]);

  const handleInputChange = (
    _event: SyntheticEvent<Element, Event>,
    value: string
  ) => {
    setInputValue(value);
  };

  const handleSelectionChange = (
    _event: SyntheticEvent<Element, Event>,
    value: string | Suggestion | null
  ) => {
    if (value && typeof value !== "string") {
      onSelect(value);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 600 }}>
      <Autocomplete
        freeSolo
        options={suggestions}
        getOptionLabel={(option: string | Suggestion) =>
          typeof option === "string" ? option : option.formatted
        }
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onChange={handleSelectionChange}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Enter address"
            variant="outlined"
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={(props, option) => (
          <li
            {...props}
            key={
              typeof option === "string"
                ? option
                : `${option.formatted}-${option.lat}-${option.lon}`
            }
          >
            {typeof option === "string" ? option : option.formatted}
          </li>
        )}
      />
    </Box>
  );
}

export default AutocompleteInput;

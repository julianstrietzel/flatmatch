import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/ListPropertyForm.css";
import { useSearchContext } from "../../contexts/SearchContext.tsx";
import useDebounce from "../../hooks/useDebounce";

const Basics: React.FC = () => {
  const {
    searchData,
    updateSearchData: updateSearchData,
    errors,
  } = useSearchContext();
  const initialPriceRange = searchData.priceRange || { min: 0, max: 1000 };
  const [localData, setLocalData] = useState({
    size: searchData.size || 0,
    type: searchData.type || "",
    numberOfRooms: searchData.numberOfRooms || 0,
    city: searchData.city || "",
    country: searchData.country || "",
  });

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [priceRange, setPriceRange] = useState([
    initialPriceRange.min,
    initialPriceRange.max,
  ]);
  const [cityInputFocused, setCityInputFocused] = useState(false);

  const debouncedCity = useDebounce(localData.city, 500);

  useEffect(() => {
    setLocalData({
      size: searchData.size || 0,
      type: searchData.type || "",
      numberOfRooms: searchData.numberOfRooms || 0,
      city: searchData.city || "",
      country: searchData.country || "",
    });
    setPriceRange([searchData.priceRange.min, searchData.priceRange.max]);
  }, [searchData]);

  useEffect(() => {
    if (debouncedCity) {
      fetchSuggestions(debouncedCity);
    } else {
      setSuggestions([]);
    }
  }, [debouncedCity]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;

    if (name) {
      const newValue =
        name === "size" || name === "numberOfRooms" ? Number(value) : value;

      setLocalData((prevState) => ({
        ...prevState,
        [name]: newValue,
      }));

      updateSearchData({
        ...localData,
        [name]: newValue,
      });
    }
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;
    const numValue = Number(value);
    let newMin = priceRange[0];
    let newMax = priceRange[1];

    if (name === "minPrice") {
      newMin = numValue;
      if (numValue > newMax) {
        newMax = numValue;
      }
    } else if (name === "maxPrice") {
      newMax = numValue;
      if (numValue < newMin) {
        newMin = numValue;
      }
    }

    setPriceRange([newMin, newMax]);
    updateSearchData({ priceRange: { min: newMin, max: newMax } });
  };

  const fetchSuggestions = async (query: string) => {
    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: query,
            format: "json",
            addressdetails: 1,
            limit: 5,
          },
        }
      );
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    const { address } = suggestion;
    const newCity = address.city || address.town || address.village || "";
    const newCountry = address.country || "";
    setLocalData((prevState) => ({
      ...prevState,
      city: newCity,
      country: newCountry,
    }));
    updateSearchData({ city: newCity, country: newCountry });
    setSuggestions([]);
    setCityInputFocused(false);
  };

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      const [newMin, newMax] = newValue;
      setPriceRange([newMin, newMax]);
      updateSearchData({ priceRange: { min: newMin, max: newMax } });
    }
  };

  return (
    <div className="step-content">
      <div className="form-box">
        <Grid container spacing={1} alignItems="flex-start" my={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Basics</Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Provide essential information about your dream flat. This section
              helps to match the fundamental aspects of your property.
            </Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              gap={2}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel id="type-label">Type</InputLabel>
                    <Select
                      labelId="type-label"
                      name="type"
                      value={localData.type}
                      label="Type"
                      onChange={
                        handleChange as (
                          event: SelectChangeEvent<string>
                        ) => void
                      }
                      sx={{ backgroundColor: "white" }}
                      error={!!errors.type}
                    >
                      <MenuItem value="apartment">Apartment</MenuItem>
                      <MenuItem value="house">House</MenuItem>
                      <MenuItem value="shared_flat">Shared Flat</MenuItem>
                      <MenuItem value="loft">Loft</MenuItem>
                    </Select>
                    {errors.type && (
                      <div className="error-message">{errors.type}</div>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    className="text-field"
                    required
                    label="City"
                    variant="outlined"
                    name="city"
                    value={localData.city}
                    onChange={handleChange}
                    onFocus={() => setCityInputFocused(true)}
                    onBlur={() =>
                      setTimeout(() => setCityInputFocused(false), 200)
                    }
                    error={!!errors.city}
                    helperText={errors.city}
                  />
                  {cityInputFocused && suggestions.length > 0 && (
                    <Paper className="suggestions-list">
                      <List>
                        {suggestions.map((suggestion, index) => (
                          <ListItem
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="suggestion-item"
                          >
                            <ListItemText primary={suggestion.display_name} />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    className="text-field"
                    required
                    label="Country"
                    variant="outlined"
                    name="country"
                    value={localData.country}
                    onChange={handleChange}
                    error={!!errors.country}
                    helperText={errors.country}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    className="text-field"
                    required
                    type="number"
                    label="Square Meters"
                    variant="outlined"
                    name="size"
                    value={localData.size}
                    onChange={handleChange}
                    error={!!errors.size}
                    helperText={errors.size}
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    className="text-field"
                    required
                    type="number"
                    inputProps={{ min: 1 }}
                    label="Number of Rooms"
                    variant="outlined"
                    name="numberOfRooms"
                    value={localData.numberOfRooms}
                    onChange={handleChange}
                    error={!!errors.numberOfRooms}
                    helperText={errors.numberOfRooms}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography gutterBottom>Price Range (€)</Typography>
                  <Slider
                    value={priceRange}
                    onChange={handlePriceChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={1000}
                    step={10}
                    marks
                    aria-labelledby="range-slider"
                  />
                  <Box display="flex" gap={5} mt={2}>
                    <TextField
                      className="text-field"
                      label="Min Price"
                      name="minPrice"
                      value={priceRange[0]}
                      onChange={(e) =>
                        handlePriceChange(e as any, [
                          Number(e.target.value),
                          priceRange[1],
                        ])
                      }
                      onBlur={handleBlur}
                      type="number"
                      inputProps={{ min: 0 }}
                    />
                    <TextField
                      className="text-field"
                      label="Max Price"
                      name="maxPrice"
                      value={priceRange[1]}
                      inputProps={{ min: 0 }}
                      onChange={(e) =>
                        handlePriceChange(e as any, [
                          priceRange[0],
                          Number(e.target.value),
                        ])
                      }
                      onBlur={handleBlur}
                      type="number"
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Basics;

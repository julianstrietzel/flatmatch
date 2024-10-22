import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useFormContext } from "../../contexts/FormContext.tsx";
import useDebounce from "../../hooks/useDebounce"; // Adjust the path as necessary
import "../../styles/ListPropertyForm.css";

export interface BasicsProps {
  flatProfileId?: string;
}

const Basics: React.FC<BasicsProps> = ({ flatProfileId }: BasicsProps) => {
  const { formData, updateFormData, errors } = useFormContext();
  const [localData, setLocalData] = useState({
    ...formData,
    address: formData.address || {
      street: "",
      buildingNumber: 0,
      city: "",
      state: "",
      postalCode: "",
      country: "",
      latitude: 0,
      longitude: 0,
    },
    price: formData.price,
    additionalCosts: formData.additionalCosts,
    totalCosts: formData.totalCosts,
    size: formData.size,
    type: formData.type || "",
    images: Array.isArray(formData.images) ? formData.images : [],
    numberOfRooms: formData.numberOfRooms,
  });

  useEffect(() => {
    setLocalData((prev) => {
      return {
        ...prev,
        ...formData,
      };
    });
  }, [flatProfileId, formData]);

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [inputFocused, setInputFocused] = useState(false);

  const debouncedStreet = useDebounce(localData.address.street, 500);

  useEffect(() => {
    setLocalData((prevState) => ({
      ...prevState,
      totalCosts:
        Number(prevState.price || 0) + Number(prevState.additionalCosts || 0),
    }));
  }, [localData.price, localData.additionalCosts]);

  useEffect(() => {
    if (debouncedStreet.length > 2) {
      fetchSuggestions(debouncedStreet);
    } else {
      setSuggestions([]);
    }
  }, [debouncedStreet]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;

    if (name && name.includes("address.")) {
      const addressKey = name.split(".")[1];
      const updatedAddress = {
        ...localData.address,
        [addressKey]:
          addressKey === "buildingNumber" ? parseInt(value, 10) : value,
      };
      // Update the Local State
      setLocalData((prevState) => ({
        ...prevState,
        address: updatedAddress,
      }));
      // Update the Context State
      updateFormData({ address: updatedAddress });
    } else if (
      name === "size" ||
      name === "numberOfRooms" ||
      name === "address.buildingNumber" ||
      name === "price" ||
      name === "additionalCosts"
    ) {
      const newValue = value === "" ? 0 : parseFloat(value);
      setLocalData((prevState) => ({
        ...prevState,
        [name]: newValue,
      }));
      updateFormData({ [name]: newValue });
    } else {
      setLocalData((prevState: any) => ({
        ...prevState,
        [name]: value,
      }));
      updateFormData({ [name]: value });
    }
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
    const newAddress = {
      street: address.road || "",
      buildingNumber: parseInt(address.house_number, 10) || 0,
      city: address.city || address.town || address.village || "",
      state: address.state || "",
      postalCode: address.postcode || "",
      country: address.country || "",
      latitude: parseFloat(suggestion.lat),
      longitude: parseFloat(suggestion.lon),
    };
    setLocalData((prevState) => ({
      ...prevState,
      address: newAddress,
    }));
    updateFormData({ address: newAddress });
    setSuggestions([]);
  };

  return (
    <div className="step-content">
      <div className="form-box">
        <Grid container spacing={1} alignItems="flex-start" my={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Basics</Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Provide essential information about the flat. This section helps
              tenants understand the fundamental aspects of your property.
            </Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              gap={2}
            >
              <TextField
                className="text-field"
                required
                label="Title"
                variant="outlined"
                name="name"
                value={localData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
              <FormControl fullWidth required>
                <InputLabel id="type-label">Type</InputLabel>
                <Select
                  labelId="type-label"
                  name="type"
                  value={localData.type}
                  label="Type"
                  onChange={(e) =>
                    handleChange(
                      e as React.ChangeEvent<{ name?: string; value: unknown }>
                    )
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
                  <FormHelperText color={"red"}>{errors.type}</FormHelperText>
                )}
              </FormControl>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    className="text-field"
                    required
                    label="Street"
                    variant="outlined"
                    name="address.street"
                    value={localData.address.street}
                    onChange={handleChange}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => {
                      setTimeout(() => setInputFocused(false), 100);
                    }}
                    error={!!errors["address.street"]}
                    helperText={errors["address.street"]}
                  />
                  {inputFocused && suggestions.length > 0 && (
                    <Paper className="suggestions-list">
                      <List>
                        {suggestions.map((suggestion, index) => (
                          <ListItem
                            key={index}
                            onMouseDown={(event) => event.preventDefault()}
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
                    type="number"
                    className="text-field"
                    required
                    label="Nr."
                    inputProps={{ min: 1 }}
                    variant="outlined"
                    name="address.buildingNumber"
                    value={localData.address.buildingNumber}
                    onChange={handleChange}
                    error={!!errors["address.buildingNumber"]}
                    helperText={errors["address.buildingNumber"]}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    className="text-field"
                    required
                    label="Postal Code"
                    variant="outlined"
                    name="address.postalCode"
                    value={localData.address.postalCode}
                    onChange={handleChange}
                    error={!!errors["address.postalCode"]}
                    helperText={errors["address.postalCode"]}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    className="text-field"
                    required
                    label="City"
                    variant="outlined"
                    name="address.city"
                    value={localData.address.city}
                    onChange={handleChange}
                    error={!!errors["address.city"]}
                    helperText={errors["address.city"]}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    className="text-field"
                    required
                    label="State"
                    variant="outlined"
                    name="address.state"
                    value={localData.address.state}
                    onChange={handleChange}
                    error={!!errors["address.state"]}
                    helperText={errors["address.state"]}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    className="text-field"
                    required
                    label="Country"
                    variant="outlined"
                    name="address.country"
                    value={localData.address.country}
                    onChange={handleChange}
                    error={!!errors["address.country"]}
                    helperText={errors["address.country"]}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    type="number"
                    className="text-field"
                    label="Number of Rooms"
                    variant="outlined"
                    name="numberOfRooms"
                    inputProps={{ min: 1, pattern: "\\d*" }}
                    value={localData.numberOfRooms || ""}
                    onChange={handleChange}
                    error={!!errors.numberOfRooms}
                    helperText={errors.numberOfRooms}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    type="number"
                    className="text-field"
                    required
                    label="Square Meters"
                    variant="outlined"
                    name="size"
                    inputProps={{ min: 1, pattern: "\\d*" }}
                    value={localData.size || ""}
                    onChange={handleChange}
                    error={!!errors.size}
                    helperText={errors.size}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    type="number"
                    className="text-field"
                    required
                    label="Rent Price (cold)"
                    name="price"
                    variant="outlined"
                    inputProps={{ min: 0, pattern: "\\d*" }}
                    value={localData.price || ""}
                    onChange={handleChange}
                    error={!!errors.price}
                    helperText={errors.price}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    type="number"
                    className="text-field"
                    label="Additional Costs"
                    name="additionalCosts"
                    variant="outlined"
                    inputProps={{ min: 0, pattern: "\\d*" }}
                    value={localData.additionalCosts || ""}
                    onChange={handleChange}
                    error={!!errors.additionalCosts}
                    helperText={errors.additionalCosts}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box mt={2}>
                    <Typography
                      variant="h6"
                      component="div"
                      display="flex"
                      justifyContent="space-between"
                    >
                      <span>Rent Price (cold)</span>
                      <span>{Number(localData.price).toFixed(2)} €</span>
                    </Typography>
                    <Typography
                      variant="h6"
                      component="div"
                      display="flex"
                      justifyContent="space-between"
                    >
                      <span>Additional Costs</span>
                      <span>
                        {Number(localData.additionalCosts).toFixed(2)} €
                      </span>
                    </Typography>
                    <Box mt={1} borderTop={1} borderColor="grey.300">
                      <Typography
                        variant="h6"
                        component="div"
                        display="flex"
                        justifyContent="space-between"
                        mt={1}
                      >
                        <span>Total Cost</span>
                        <span>{Number(localData.totalCosts).toFixed(2)} €</span>
                      </Typography>
                    </Box>
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

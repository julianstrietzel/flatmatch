import { Box, Chip, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { tags } from "../tags.ts";
import "../../styles/ListPropertyForm.css";
import { useFormContext } from "../../contexts/FormContext.tsx";
import { FlatDetailsMessages } from "./FlatDetailsMessages.tsx";
import { BasicsProps } from "./Basics.tsx";

const FlatDetails: React.FC<BasicsProps> = ({ flatProfileId }: BasicsProps) => {
  const { formData, updateFormData, errors } = useFormContext();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [localData, setLocalData] = useState({
    ...formData,
    description: formData.description || "",
  });
  const safeData = {
    ...formData,
    tags: Array.isArray(formData.tags)
      ? formData.tags.filter((tag: { tagKey: any }) => tag.tagKey)
      : [],
  };

  useEffect(() => {
    setLocalData((prev) => {
      return {
        ...prev,
        ...formData,
      };
    });
  }, [flatProfileId, formData]);

  const handleTagSelection = (tag: string) => {
    const isTagSelected = safeData.tags.some(
      (t: { tagKey: string }) => t.tagKey === tag
    );
    const updatedTags = isTagSelected
      ? safeData.tags.filter((t: { tagKey: string }) => t.tagKey !== tag)
      : [...safeData.tags, { tagKey: tag }];

    updateFormData({ tags: updatedTags });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;

    if (name === "description") {
      setLocalData((prevState: any) => ({
        ...prevState,
        [name]: value,
      }));
      updateFormData({ [name]: value });
    }
  };

  const selectedColor = "#65D6AD";
  const recommendedTags = Array.isArray(tags)
    ? tags.filter((tag) => tag.category === "Recommended")
    : [];
  const extraTags = Array.isArray(tags)
    ? tags.filter((tag) => tag.category === "Extra")
    : [];

  const filteredExtraTags = extraTags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="step-content">
      <div className="form-box">
        <Grid container spacing={20} alignItems="flex-start">
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Flat Details</Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Describe specific features as tags of your flat. This section
              allows you to highlight what makes your property unique.
            </Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="stretch"
              gap={2}
            >
              <TextField
                name="description"
                label="Description"
                variant="outlined"
                value={localData.description}
                onChange={handleChange}
                style={{ width: "100%", height: "150px", margin: "16px 0" }}
                multiline
                rows={6}
                required
                error={!!errors.description}
                helperText={errors.description}
                InputProps={{
                  style: {
                    backgroundColor: "white",
                  },
                }}
              />
              <Typography variant="h6">Recommended Flat Tags</Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {recommendedTags.map((tag) => (
                  <Chip
                    key={tag.name}
                    label={tag.name}
                    clickable
                    onClick={() => handleTagSelection(tag.name)}
                    sx={{
                      backgroundColor: safeData.tags.find(
                        (t: { tagKey: string }) => t.tagKey === tag.name
                      )
                        ? selectedColor
                        : "default",
                      fontSize: "1.0rem",
                      padding: "15px",
                      "&:hover": {
                        backgroundColor: safeData.tags.find(
                          (t: { tagKey: string }) => t.tagKey === tag.name
                        )
                          ? selectedColor
                          : "default",
                      },
                    }}
                  />
                ))}
              </Box>
              <Grid container spacing={3} alignItems="flex-start" my={3}>
                <Grid item xs={12} md={10}>
                  <Typography variant="h6">Extra Tags</Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search extra tags"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mt: 2, mb: 2, backgroundColor: "white" }}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {filteredExtraTags.map((tag) => (
                      <Chip
                        key={tag.name}
                        label={tag.name}
                        clickable
                        onClick={() => handleTagSelection(tag.name)}
                        sx={{
                          backgroundColor: safeData.tags.find(
                            (t: { tagKey: string }) => t.tagKey === tag.name
                          )
                            ? selectedColor
                            : "default",
                          fontSize: "1.0rem",
                          padding: "15px",
                          "&:hover": {
                            backgroundColor: safeData.tags.find(
                              (t: { tagKey: string }) => t.tagKey === tag.name
                            )
                              ? selectedColor
                              : "default",
                            opacity: 0.8,
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
              <Box display="flex" alignItems="center" mt={2}>
                <FlatDetailsMessages />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default FlatDetails;

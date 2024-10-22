import { Box, Chip, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { tags } from "../tags.ts";
import "../../styles/ListPropertyForm.css";
import { useSearchContext } from "../../contexts/SearchContext.tsx";
import { YourProfileMessage } from "../InfoboxMessages.tsx";

const YourProfile: React.FC = () => {
  const {
    searchData,
    updateSearchData: updateSearchData,
    errors,
  } = useSearchContext();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [localData, setLocalData] = useState({
    ...searchData,
    description: searchData.description || "",
  });
  const safeData = {
    ...searchData,
    tags: Array.isArray(searchData.tags)
      ? searchData.tags.filter((tag: { tagKey: any }) => tag.tagKey)
      : [],
  };

  useEffect(() => {
    setLocalData({
      ...searchData,
      description: searchData.description || "",
    });
  }, [searchData]);

  const handleTagSelection = (tag: string) => {
    const isTagSelected = safeData.tags.some(
      (t: { tagKey: string }) => t.tagKey === tag
    );
    const updatedTags = isTagSelected
      ? safeData.tags.filter((t: { tagKey: string }) => t.tagKey !== tag)
      : [...safeData.tags, { tagKey: tag }];

    updateSearchData({ tags: updatedTags });
  };

  const selectedColor = "#65D6AD";
  const personalTags = Array.isArray(tags)
    ? tags.filter((tag) => tag.category === "Personality")
    : [];

  const filteredExtraTags = personalTags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      updateSearchData({ [name]: value });
    }
  };
  return (
    <div className="step-content">
      <div className="form-box">
        <Grid container spacing={20} alignItems="flex-start">
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Your Profile </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              This section allows you to introduce yourself to potential
              landlords and highlight what makes you a reliable and desirable
              tenant.{" "}
            </Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="stretch"
              gap={2}
            >
              <Grid item xs={12} md={10}>
                <Typography variant="h6">About me</Typography>
                <TextField
                  name="description"
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
              </Grid>
              <Grid container spacing={3} alignItems="flex-start" my={3}>
                <Grid item xs={12} md={10}>
                  <Typography variant="h6">
                    Describe Yourself in Tags
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Search extra tags"
                    variant="outlined"
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
                <YourProfileMessage />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default YourProfile;

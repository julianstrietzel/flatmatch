import { Box, Chip, Grid, Typography } from "@mui/material";
import React from "react";
import { tags } from "../tags.ts";
import "../../styles/ListPropertyForm.css";
import { useSearchContext } from "../../contexts/SearchContext.tsx";

const Documents: React.FC = () => {
  const { searchData, updateSearchData: updateSearchData } = useSearchContext();

  const safeData = {
    ...searchData,
    tags: Array.isArray(searchData.tags)
      ? searchData.tags.filter((tag: { tagKey: any }) => tag.tagKey)
      : [],
  };

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
  const documents = Array.isArray(tags)
    ? tags.filter((tag) => tag.category === "Documents")
    : [];

  return (
    <div className="step-content">
      <div className="form-box">
        <Grid container spacing={20} alignItems="flex-start">
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Documents</Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Upload key documents to verify your financial stability and rental
              history, enhancing your profile's trustworthiness.
            </Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="stretch"
              gap={2}
            >
              <Typography variant="h6">I can provide</Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {documents.map((tag) => (
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
              <Box display="flex" alignItems="center" mt={2}></Box>
            </Box>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Documents;

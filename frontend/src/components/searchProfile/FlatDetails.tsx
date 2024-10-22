import React, { useMemo, useState } from "react";
import {
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  IconButton,
  Button,
  TextField,
} from "@mui/material";
import {
  Filter1,
  Filter2,
  Filter3,
  Filter4,
  Filter5,
  Home,
  HomeOutlined,
} from "@mui/icons-material";
import { tags } from "../tags.ts";
import { useSearchContext } from "../../contexts/SearchContext.tsx";

const FlatDetails: React.FC = () => {
  const { searchData, updateSearchData: updateSearchData } = useSearchContext();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState("");
  const [rating, setRating] = useState(0);

  const safeData = useMemo(() => {
    return {
      ...searchData,
      requirements: Array.isArray(searchData.requirements)
        ? searchData.requirements
        : [],
    };
  }, [searchData]);

  const handleTagSelection = (tag: string) => {
    const existingReq = safeData.requirements.find(
      (req: { reqKey: string }) => req.reqKey === tag
    );
    if (existingReq) {
      const updatedRequirements = safeData.requirements.filter(
        (req: { reqKey: string }) => req.reqKey !== tag
      );
      updateSearchData({ requirements: updatedRequirements });
    } else {
      setSelectedTag(tag);
      setRating(0);
      setOpen(true);
    }
  };

  const handleRating = (value: number) => {
    const updatedRequirements = safeData.requirements.filter(
      (req: { reqKey: string }) => req.reqKey !== selectedTag
    );
    updatedRequirements.push({ reqKey: selectedTag, weight: value });
    updateSearchData({ requirements: updatedRequirements });
    setOpen(false);
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
  const getIconForRating = (rating: number) => {
    if (rating === 1) return <Filter1 />;
    if (rating === 2) return <Filter2 />;
    if (rating === 3) return <Filter3 />;
    if (rating === 4) return <Filter4 />;
    if (rating >= 5) return <Filter5 />;
    return <span />; // return an empty span instead of null
  };

  return (
    <div className="step-content">
      <div className="form-box">
        <Grid container spacing={20} alignItems="flex-start">
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Flat Details</Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Describe specific features as tags of your dream flat. This
              section allows you to highlight what makes your dream property
              unique.{" "}
            </Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="stretch"
              gap={2}
            >
              <Typography variant="h6">Recommended Flat Tags</Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {recommendedTags.map((tag) => (
                  <Chip
                    key={tag.name}
                    label={tag.name}
                    clickable
                    onClick={() => handleTagSelection(tag.name)}
                    icon={getIconForRating(
                      safeData.requirements.find(
                        (req: { reqKey: string }) => req.reqKey === tag.name
                      )?.weight || 0
                    )}
                    sx={{
                      backgroundColor: safeData.requirements.find(
                        (req: { reqKey: string }) => req.reqKey === tag.name
                      )
                        ? selectedColor
                        : "default",
                      fontSize: "1.0rem",
                      padding: "15px",
                      "&:hover": {
                        backgroundColor: safeData.requirements.find(
                          (req: { reqKey: string }) => req.reqKey === tag.name
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
                        icon={getIconForRating(
                          safeData.requirements.find(
                            (req: { reqKey: string }) => req.reqKey === tag.name
                          )?.weight || 0
                        )}
                        sx={{
                          backgroundColor: safeData.requirements.find(
                            (req: { reqKey: string }) => req.reqKey === tag.name
                          )
                            ? selectedColor
                            : "default",
                          fontSize: "1.0rem",
                          padding: "15px",
                          "&:hover": {
                            backgroundColor: safeData.requirements.find(
                              (req: { reqKey: string }) =>
                                req.reqKey === tag.name
                            )
                              ? selectedColor
                              : "default",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle style={{ textAlign: "center" }}>
          How important is this tag to you?
        </DialogTitle>
        <DialogContent>
          <Typography color="textSecondary" gutterBottom>
            Select the number of houses to rate its importance. One house means
            not important, five houses means extremely important.
          </Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "10px 0",
            }}
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <IconButton
                key={value}
                onClick={() => handleRating(value)}
                style={{ color: rating >= value ? "#3f51b5" : "#b0bec5" }}
              >
                {rating >= value ? <Home /> : <HomeOutlined />}
              </IconButton>
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FlatDetails;

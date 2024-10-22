import React, { useEffect, useRef, useState } from "react";
import { Box, Grid, Typography, Button, IconButton } from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import "../../styles/ListPropertyForm.css";
import { useFormContext } from "../../contexts/FormContext.tsx";
import { uploadFlatProfileImages } from "../../services/profilesService.ts";
import { BasicsProps } from "./Basics.tsx";

const UploadImages: React.FC<BasicsProps> = ({
  flatProfileId,
}: BasicsProps) => {
  const { formData, updateFormData } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localImages, setLocalImages] = useState<string[]>(
    formData.images || []
  );

  useEffect(() => {
    setLocalImages(formData.images || []);
  }, [flatProfileId, formData]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("images", file));

      try {
        const response = await uploadFlatProfileImages(formData);
        const uploadedImages = response.images;
        if (Array.isArray(uploadedImages)) {
          const updatedImages = [...localImages, ...uploadedImages];
          setLocalImages(updatedImages);
          updateFormData({ images: updatedImages });

          console.log("Uploaded Images:", uploadedImages);
          console.log("Updated Local Images:", updatedImages);
        } else {
          console.error("Unexpected response format:", response);
        }
      } catch (error) {
        console.error("Error uploading images:", error);
      }
    }
  };

  const handleDelete = (index: number) => {
    const updatedImages = localImages.filter((_, i) => i !== index);
    setLocalImages(updatedImages);
    updateFormData({ images: updatedImages });
  };

  return (
    <div className="step-content">
      <div className="form-box">
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Upload Images</Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Add clear photos to highlight your property's features, aiding
              tenants in assessing suitability and accelerating the rental
              process.
            </Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              border="2px dashed #cccccc"
              borderRadius="4px"
              padding="16px"
              textAlign="center"
              sx={{
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#f9f9f9",
                },
              }}
              onClick={handleClick}
            >
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
              <CloudUploadIcon style={{ fontSize: 50, color: "#cccccc" }} />
              <Typography variant="body2" color="textSecondary">
                Drag and drop images or{" "}
                <Button
                  color="primary"
                  variant="text"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                  }}
                >
                  click here
                </Button>
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Supports: JPG, PNG, JPEG2000
              </Typography>
            </Box>
            <Box mt={2}>
              {localImages.map((image, index) => (
                <Box
                  key={index}
                  position="relative"
                  display="inline-block"
                  marginRight="8px"
                >
                  <img
                    src={image}
                    alt={`local-${index}`}
                    style={{ width: "100px", height: "100px" }}
                    onError={(e) =>
                      (e.currentTarget.src = "placeholder-image-url")
                    }
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(index)}
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default UploadImages;

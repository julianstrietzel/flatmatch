import React from "react";
import { Box, Grid, Typography, Stepper, Step, StepLabel } from "@mui/material";

const steps = [
  "Basics",
  "Flat Details",
  "Rental Prerequisites",
  "Upload Images",
];

interface FlatProfileStepperProps {
  currentStep: number;
  isEditMode?: boolean;
}

const FlatProfileStepper: React.FC<FlatProfileStepperProps> = ({
  currentStep,
  isEditMode = false,
}) => {
  return (
    <Box
      sx={{
        position: "fixed",
        width: "100%",
        height: "109px",
        backgroundColor: "white",
        zIndex: 1000,
        padding: 3,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        marginBottom: 0,
      }}
    >
      <Grid container alignItems="flex-start" spacing={3}>
        <Grid item xs={12} sm="auto">
          <Typography variant="h5" sx={{ lineHeight: 1 }}>
            {isEditMode ? "Edit Your Property" : "List Your Property"}
          </Typography>
        </Grid>
        <Grid item xs>
          <Box sx={{ marginLeft: 2 }}>
            <Stepper activeStep={currentStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FlatProfileStepper;

import { Box, Stepper, Step, StepLabel, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";

const steps = ["Basics", "Flat Details", "Your Profile", "Upload Images"];

interface SearchProfileStepperProps {
  currentStep: number;
  isEditMode?: boolean;
}
const SearchProfileStepper: React.FC<SearchProfileStepperProps> = ({
  currentStep,
  isEditMode = false,
}) => {
  const theme = useTheme();

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
            {isEditMode ? "Edit Your Profile" : "Find Your Profile"}
          </Typography>
        </Grid>
        <Grid item xs>
          <Box sx={{ marginLeft: 2 }}>
            <Stepper
              activeStep={currentStep}
              alternativeLabel
              sx={{
                "& .MuiStepIcon-root.Mui-active": {
                  color: theme.palette.yellow[500], // Active step color
                },
                "& .MuiStepIcon-root.Mui-completed": {
                  color: theme.palette.teal[300], // Completed step color
                },
                "& .MuiStepIcon-root": {
                  color: theme.palette.neutral[100], // Default step color
                },
                "& .MuiStepConnector-line": {
                  borderColor: theme.palette.neutral[200], // Connector line color
                },
              }}
            >
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

export default SearchProfileStepper;

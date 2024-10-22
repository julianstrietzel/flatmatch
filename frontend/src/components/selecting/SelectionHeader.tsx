import { Box, Typography } from "@mui/material";

const SelectionHeader = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      mt={5}
      width="60%"
      gap={3}
    >
      <Typography variant="h4" style={{ fontWeight: "bold" }}>
        Find the Perfect Roommate for Your Flat
      </Typography>
      <Typography variant="body1" textAlign="center" color="neutral.600">
        Explore potential roommates from the curated profiles below.{" "}
        <strong>Select</strong> individuals that fit your criteria, to arrange a
        visit or <strong>discard</strong> those who don't. This tailored
        approach helps you quickly find the best match for your shared flat,
        streamlining your selection process.
      </Typography>
    </Box>
  );
};

export default SelectionHeader;

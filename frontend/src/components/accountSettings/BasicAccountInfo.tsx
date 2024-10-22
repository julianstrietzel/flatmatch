import {
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { IAccount } from "../../types/Account.ts";
import { useAuth } from "../../hooks/useAuth.ts";

interface BasicAccountInfoProps {
  formData: Partial<IAccount>;
  handleChange: (e: { target: { name: string; value: string } }) => void;
  handleOpenPassword: () => void;
}

const BasicAccountInfo = ({
  formData,
  handleChange,
  handleOpenPassword,
}: BasicAccountInfoProps) => {
  const { user } = useAuth();

  return (
    <>
      <Grid item xs={12} md={4}>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Basics
        </Typography>
        <Typography variant="body2">
          Attaching an up-to-date email address to your account significantly
          enhances its security.
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
            fullWidth
            margin="normal"
            label="Email address"
            variant="outlined"
            name="email"
            value={formData.email ?? ""}
            onChange={handleChange}
          />
          <Button
            variant="contained"
            color={user!.accountType === "landlord" ? "primary" : "yellow"}
            onClick={handleOpenPassword}
          >
            Change your password
          </Button>
          <TextField
            fullWidth
            margin="normal"
            label="Language"
            variant="outlined"
            select
            name="language"
            value={formData.language ?? ""}
            onChange={handleChange}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="de">German</MenuItem>
          </TextField>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Country"
                variant="outlined"
                select
                name="country"
                value={formData.country ?? ""}
                onChange={handleChange}
              >
                <MenuItem value="de">Germany</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="City"
                variant="outlined"
                select
                name="city"
                value={formData.city ?? ""}
                onChange={handleChange}
              >
                <MenuItem value="muc">Munich</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </>
  );
};

export default BasicAccountInfo;

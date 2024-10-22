import { Box, Button, ButtonGroup, List, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import FlatMatchPlusLogo from "../assets/flatmatchpluslogovec.svg";
import PaymentPreviewDialog from "../components/PaymentPreviewDialog.tsx";
import { useAuth } from "../hooks/useAuth.ts";
import { useNavigate } from "react-router-dom";
import FeatureElement from "../components/premiumFeatures/FeatureElement.tsx";

interface PriceElementProps {
  price: number;
  isMonthly: boolean;
  plus: boolean;
}

const PriceElement = ({ price, isMonthly, plus }: PriceElementProps) => {
  const discountFactor = 0.1;

  return (
    <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
      <Typography
        variant={!isMonthly && plus ? "h5" : "h3"}
        sx={{ textDecoration: !isMonthly && plus ? "line-through" : "none" }}
      >
        {price}&euro;
      </Typography>
      {!isMonthly && plus && (
        <Typography variant="h3">
          {price * (1 - discountFactor)}&euro;
        </Typography>
      )}
      <Typography component="span" variant="body2" color="textSecondary">
        {isMonthly ? "monthly" : "annually"}
      </Typography>
    </Box>
  );
};

const PremiumFeaturesPage = () => {
  const [isMonthly, setIsMonthly] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user == null || user.id == null) {
      navigate("/");
      alert("Please log in to access your chats.");
      return;
    }
  }, [user, navigate]);

  const parsedDate = user?.premiumEndDate
    ? new Date(user.premiumEndDate)
    : null;

  const formatDate = (date: Date | null) => {
    if (date) {
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  };

  const handleMonthly = () => {
    setIsMonthly(true);
  };

  const handleYearly = () => {
    setIsMonthly(false);
  };

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="70%"
      margin="0 auto"
      alignItems="center"
      gap={5}
      mt={6}
    >
      <Box display="flex" justifyContent="center" alignItems="center">
        <ButtonGroup size="large" color="secondary">
          <Button
            variant={isMonthly ? "contained" : "outlined"}
            color="neutral"
            onClick={handleMonthly}
          >
            Monthly
          </Button>
          <Button
            variant={isMonthly ? "outlined" : "contained"}
            color="neutral"
            onClick={handleYearly}
          >
            Annually (10% Discount)
          </Button>
        </ButtonGroup>
      </Box>
      <Box display="flex" alignItems="center" gap={7}>
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          border="3px solid"
          borderColor={"yellow.main"}
          borderRadius={3}
          px={3}
          bgcolor="white"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            borderBottom="3px solid"
            borderColor={"yellow.main"}
            p={3}
          >
            <Typography
              fontWeight="bold"
              variant="h4"
              color={"yellow.main"}
              marginLeft={1}
            >
              Flat
            </Typography>
            <Typography fontWeight="bold" variant="h4" color="text.primary">
              Match
            </Typography>
          </Box>
          <PriceElement price={0} isMonthly={isMonthly} plus={false} />
          <List>
            <FeatureElement
              text="Find Your Perfect Match"
              premiumFeature={false}
            />
            <FeatureElement text="Chat With Landlords" premiumFeature={false} />
            <FeatureElement text="Seal The Deal" premiumFeature={false} />
          </List>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          gap={3}
          border="3px solid"
          bgcolor="white"
          borderColor={"yellow.main"}
          borderRadius={3}
          px={3}
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            borderBottom="3px solid"
            borderColor={"yellow.main"}
            p={3}
          >
            <img src={FlatMatchPlusLogo} alt="FlatMatch Plus logo" />
          </Box>
          <PriceElement
            price={isMonthly ? 5 : 5 * 12}
            isMonthly={isMonthly}
            plus={true}
          />
          <List>
            <FeatureElement
              text="Find Your Perfect Match"
              premiumFeature={false}
            />
            <FeatureElement text="Chat With Landlords" premiumFeature={false} />
            <FeatureElement text="Unlimited Likes" premiumFeature={true} />
            <FeatureElement text="No Advertisements" premiumFeature={true} />
            <FeatureElement
              text="Upload Personal Documents"
              premiumFeature={true}
            />
          </List>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            borderTop="3px solid"
            borderColor={"yellow.main"}
            gap={2}
            p={3}
          >
            {user?.premiumUser ? (
              <>
                <Typography variant="body1">Already Upgraded</Typography>
                <Typography variant="body2">
                  Subscription valid until {formatDate(parsedDate)}
                </Typography>
              </>
            ) : (
              <>
                <Button
                  size="large"
                  variant="contained"
                  color="neutral"
                  onClick={handleClickOpen}
                >
                  Upgrade
                </Button>
                <PaymentPreviewDialog
                  open={openDialog}
                  close={handleClose}
                  monthly={isMonthly}
                />
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PremiumFeaturesPage;

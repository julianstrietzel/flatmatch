import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import SwipingMatchesList from "../components/swiping/SwipingMatchesList.tsx";
import SwipingLandingAd from "../components/swiping/SwipingLandingAd.tsx";
import { useAuth } from "../hooks/useAuth.ts";
import SwipingCard from "../components/swiping/SwipingCard.tsx";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer.tsx";
import { useCallback, useEffect, useState } from "react";
import { IFlatProfile } from "../types/Profile.ts";
import { getFlatProfile } from "../services/profilesService.ts";
import {
  getMatchesByUser,
  getPromisingFlats,
} from "../services/matchingService.ts";
import { isTenantUser } from "../types/User.ts";
import SwipingMissingFlatsCard from "../components/swiping/SwipingMissingFlatsCard.tsx";
import { useNotification } from "../hooks/useNotification.ts";

const SwipingLandingPage = () => {
  const { user, authLoading } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [matches, setMatches] = useState<IFlatProfile[]>([]);
  const [cardFlatProfile, setCardFlatProfile] = useState<IFlatProfile | null>(
    null
  );
  const { showNotification } = useNotification();

  const fetchFlatProfiles = useCallback(async () => {
    const matches = await getMatchesByUser(user!.accountType);
    return Promise.all(
      matches.map(async (flatProfileId) => await getFlatProfile(flatProfileId))
    )
      .then((profiles) => setMatches(profiles))
      .catch((error) => {
        console.error("Error fetching flat profiles", error);
      });
  }, [user]);

  const fetchPromisingFlats = useCallback(async () => {
    if (user && isTenantUser(user)) {
      if (!user.profile) {
        throw new Error(`No search profile found for user ${user.id}`);
      }

      const searchProfileId = user.profile;

      try {
        const response = await getPromisingFlats(searchProfileId);
        const promisingFlats = response.data;
        if (!promisingFlats) {
          showNotification({
            message:
              "Sorry, there is no flat available for your filter price range. Please relax your constraints!",
            severity: "info",
          });
        } else if (promisingFlats.length > 0) {
          let index = 0;
          while (promisingFlats[index].isAd) {
            index += 1;
          }
          const promisingFlatProfile = await getFlatProfile(
            promisingFlats[index].id
          );
          setCardFlatProfile(promisingFlatProfile);
        } else {
          setCardFlatProfile(null);
          setLoading(false);
        }
      } catch (error: unknown) {
        console.error("Error fetching promising flats or flat profile", error);
        showNotification({
          message:
            "Sorry, there was an error fetching your flat suggestions. Please reload or try to logout and login again.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  }, [user, showNotification]);

  useEffect(() => {
    if (!user) {
      return;
    }
    if (!authLoading) {
      fetchFlatProfiles().then(fetchPromisingFlats);
    }
  }, [user, navigate, authLoading]);

  const handleStartClick = () => {
    navigate("/swiping");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      mt={5}
      width="100%"
      gap={8}
    >
      <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
        <Typography variant="h4" style={{ fontWeight: "bold" }}>
          Find your next dream Flat!
        </Typography>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="body1">
            Swipe potential flats, matching your filters.
          </Typography>
          <Typography variant="body1">
            We will automatically match you to the best available flats.
          </Typography>
        </Box>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <SwipingMatchesList matches={matches} />
        </Grid>
        <Grid item xs={4}>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <CircularProgress />
            </Box>
          ) : cardFlatProfile ? (
            <>
              <SwipingCard flatProfile={cardFlatProfile} />
              <Box display="flex" justifyContent="center" mt={5}>
                <Button
                  variant="contained"
                  color="yellow"
                  endIcon={<ArrowForwardIcon />}
                  onClick={handleStartClick}
                  sx={{ backgroundColor: "yellow.main", color: "#fff" }}
                >
                  Start Swiping
                </Button>
              </Box>
            </>
          ) : (
            <SwipingMissingFlatsCard />
          )}
        </Grid>
        <Grid item xs={4}>
          <SwipingLandingAd />
        </Grid>
      </Grid>
      <Footer />
    </Box>
  );
};

export default SwipingLandingPage;

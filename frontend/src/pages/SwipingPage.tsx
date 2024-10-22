import { Box, Button, Typography } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import styled from "@emotion/styled";
import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "../hooks/useAuth.ts";
import { useNavigate } from "react-router-dom";
import MainContent from "../components/swiping/SwipingContentBox.tsx";
import { SwipingButton } from "../components/swiping/SwipingButton.tsx";
import { IFlatProfile } from "../types/Profile.ts";
import no_more_flats_in_swiping from "../assets/no_more_flats_in_swiping.webp";
import { fetchAd } from "../services/adService.ts";
import { IAd, isAd } from "../types/Ad.ts";
import AdContent from "../components/swiping/AdContent.tsx";
import {
  dislikeFlat,
  getPromisingFlats,
  likeFlat,
} from "../services/matchingService.ts";
import { getFlatProfile } from "../services/profilesService.ts";
import { TenantUser } from "../types/User.ts";
import { useNotification } from "../hooks/useNotification.ts";
import TryFlatMatchPlusLogo from "../assets/tryflatmatchpluslogovec.svg";

const RootContainer = styled(Box)`
  margin-top: 20px;
  margin-bottom: 40px;
  width: 100%;
  height: 90vh;
  display: flex;
  flex-direction: row;
  margin-outside: 40px;
  justify-content: space-between;
`;

const SwipingPage = () => {
  const [flatProfile, setFlatProfile] = useState<
    IFlatProfile | IAd | undefined
  >(undefined);
  const boxRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const flatProfileIds = useRef<{ id: string; isAd: boolean }[]>([]);
  const page = useRef<number>(0);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState<number>(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const DailyLimitFree = 6;
  const DailyLimitPremium = 1000;
  const [searchProfileId, setSearchProfileId] = useState<string>("");
  const { showNotification } = useNotification();

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const storedCount = localStorage.getItem("clickCount" + user?.id);
    const storedDate = localStorage.getItem("clickDate" + user?.id);

    if (storedDate === today && storedCount) {
      const count = parseInt(storedCount, 0);
      setClickCount(count);
      if (count >= (user?.premiumUser ? DailyLimitPremium : DailyLimitFree)) {
        setIsButtonDisabled(true);
      }
    } else {
      localStorage.setItem("clickCount" + user?.id, "0");
      localStorage.setItem("clickDate" + user?.id, today);
    }
  }, []);

  useEffect(() => {
    if (
      clickCount >= (user?.premiumUser ? DailyLimitPremium : DailyLimitFree)
    ) {
      setIsButtonDisabled(true);
    }
  }, [clickCount]);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    if (!(user as TenantUser).profile) {
      console.error("No search profile in account");
      navigate("/");
      return;
    }
    setSearchProfileId((user as TenantUser).profile!);
  }, [user, navigate]);

  const fetchNextIds = useCallback(async () => {
    return getPromisingFlats(searchProfileId, 100, page.current)
      .then((response) => {
        if (!response.data) {
          showNotification({
            message:
              "Sorry, there is no flat available for your filter price range. Please relax your constraints!",
            severity: "info",
          });
        } else {
          flatProfileIds.current = response.data
            .map((data: { score: number; id: string; isAd: boolean }) => ({
              id: data.id,
              isAd: data.isAd,
            }))
            .reverse();
        }
        page.current = response.page;
      })
      .catch((error) => console.error(error));
  }, [searchProfileId]);

  const fetchFlatProfileById = useCallback(
    async (nextItem: { id: string; isAd: boolean }) => {
      try {
        const response = nextItem.isAd
          ? await fetchAd(nextItem.id)
          : await getFlatProfile(nextItem.id);
        setFlatProfile(response);
      } catch (error) {
        console.error(error);
        showNotification({
          message: "Failed to fetch ad",
          severity: "error",
        });
      }
    },
    []
  );

  const fetchNextFlatProfile = useCallback(async () => {
    setLoading(true);
    try {
      if (!flatProfileIds.current.length) {
        await fetchNextIds();
      }

      const nextId = flatProfileIds.current.pop();
      if (!nextId) {
        setFlatProfile(undefined);
        return;
      }
      await fetchFlatProfileById(nextId);
    } catch (error) {
      console.error("Error fetching flat profile:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchNextIds, fetchFlatProfileById]);

  useEffect(() => {
    if (searchProfileId === "") {
      return;
    }
    if (!flatProfile) {
      fetchNextFlatProfile();
    }
  }, [flatProfile, searchProfileId, user]);

  const handleLikeClick = useCallback(() => {
    if (flatProfile && isAd(flatProfile)) {
      window.open((flatProfile as IAd).url, "_blank");
      fetchNextFlatProfile();
    } else {
      likeFlat(searchProfileId, flatProfile!._id)
        .then(() => {
          setClickCount((prev) => {
            const newCount = prev + 1;
            localStorage.setItem("clickCount" + user?.id, newCount.toString());
            return newCount;
          });
        })
        .then(fetchNextFlatProfile)
        .catch((error) => {
          console.error("Error liking flat profile:", error);
        });
    }
  }, [fetchNextFlatProfile, flatProfile, searchProfileId]);

  const handleDislikeClick = useCallback(() => {
    if (flatProfile && isAd(flatProfile)) {
      fetchNextFlatProfile();
    } else {
      dislikeFlat(searchProfileId, flatProfile!._id)
        .then(() => {
          fetchNextFlatProfile();
        })
        .catch((error) => {
          console.error("Error disliking flat profile:", error);
        });
    }
  }, [fetchNextFlatProfile, flatProfile, searchProfileId]);

  const handleKeyDown = useCallback(
    (e: { key: string }) => {
      if (e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "d") {
        handleDislikeClick();
      } else if (
        e.key === "ArrowUp" ||
        e.key === "ArrowRight" ||
        e.key === "l"
      ) {
        handleLikeClick();
      }
    },
    [handleDislikeClick, handleLikeClick]
  );

  return (
    <Box
      ref={boxRef}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      sx={{ outline: "none" }}
      height={"calc(100vh - 64px)"}
    >
      {isButtonDisabled && !loading ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          height="100%"
          justifyContent="center"
        >
          <img
            src={no_more_flats_in_swiping}
            alt="Daily Limit icon"
            style={{
              maxWidth: "100%",
              height: "auto",
              maxHeight: "50vh",
              objectFit: "contain",
              borderRadius: 10,
            }}
          />
          <Box marginY={2} />

          <Typography align={"center"}>
            You have reached your daily limit on likes.
            <p />
            Please come back tomorrow or upgrade to FlatMatch Plus.
          </Typography>
          <Box marginY={2} />
          <Button
            onClick={() => navigate("/premium")}
            variant="contained"
            color="neutral"
          >
            <img
              src={TryFlatMatchPlusLogo}
              alt="Flat Match Plus"
              style={{ height: 28 }}
            />
          </Button>
        </Box>
      ) : (
        <RootContainer>
          <SwipingButton
            icon={<ThumbDownIcon />}
            text={"Dislike"}
            handleClick={handleDislikeClick}
          />
          {flatProfile && isAd(flatProfile) ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
              sx={{ overflowY: "auto" }}
            >
              <AdContent ad={flatProfile as IAd} />
            </Box>
          ) : (
            <Box width="60%" height="100%" sx={{ overflowY: "auto" }}>
              <MainContent
                loading={loading}
                flatProfile={flatProfile as IFlatProfile}
              />
            </Box>
          )}
          <SwipingButton
            icon={<ThumbUpIcon />}
            text={"Like"}
            handleClick={handleLikeClick}
          />
        </RootContainer>
      )}
    </Box>
  );
};

export default SwipingPage;

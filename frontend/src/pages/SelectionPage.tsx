import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import SelectionCard from "../components/selecting/SelectionCard";
import SelectionCarousel from "../components/selecting/SelectionCarousel";
import EmptyUserPool from "../components/selecting/EmptyUserPool";
import SelectionHeader from "../components/selecting/SelectionHeader";
import Footer from "../components/Footer";
import { useAuth } from "../hooks/useAuth";
import { fetchCarouselItem, CarouselItem } from "../services/profilesService";
import { fetchUserProfiles } from "../services/selectionService";
import { SelectionUser } from "../types/SelectionUser";
import { isLandlordUser } from "../types/User";
import { createChat, postArchiveChat } from "../services/chatService.ts";
import {
  approveTenant,
  disapproveTenant,
} from "../services/matchingService.ts";

function SelectionPage() {
  const [flats, setFlats] = useState<CarouselItem[]>([]);
  const [selectedFlatIndex, setSelectedFlatIndex] = useState<number>(0);
  const [selectedCards, setSelectedCards] = useState<{
    [key: string]: string[];
  }>({});
  const [filteredUsers, setFilteredUsers] = useState<SelectionUser[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFlats = async () => {
      if (isLandlordUser(user) && user.profiles && user.profiles.length > 0) {
        const flatIds = user.profiles;
        const flatPromises = flatIds.map((id: string) => fetchCarouselItem(id));
        const fetchedFlats = await Promise.all(flatPromises);

        // Initialize selectedCards state with approvedSearchProfiles for each flat
        const initialSelectedCards: { [key: string]: string[] } = {};
        fetchedFlats.forEach((flat) => {
          initialSelectedCards[flat.id] = flat.approvedSearchProfiles || [];
        });

        setFlats(fetchedFlats);
        setSelectedCards(initialSelectedCards);
      }
    };

    fetchFlats().catch((error) =>
      console.error("Error fetching flats:", error)
    );
  }, [user]);

  useEffect(() => {
    const fetchUsersForSelectedFlat = async () => {
      if (flats.length > 0) {
        const selectedFlat = flats[selectedFlatIndex];
        const approvedProfiles = selectedFlat.approvedSearchProfiles || [];
        const disapprovedProfiles =
          selectedFlat.disapprovedSearchProfiles || [];

        // Fetch promising tenants
        let promisingTenants = await fetchUserProfiles(selectedFlat.id);

        // Filter out disapproved profiles from promising tenants
        promisingTenants = promisingTenants.filter(
          (promisingUser) =>
            !disapprovedProfiles.includes(promisingUser.searchProfileId)
        );

        // Fetch approved search profiles
        let approvedUsers = await fetchUserProfiles(
          selectedFlat.id,
          approvedProfiles
        );

        // Filter out disapproved profiles from approved users
        approvedUsers = approvedUsers.filter(
          (approvedUser) =>
            !disapprovedProfiles.includes(approvedUser.searchProfileId)
        );

        // Combine both lists and remove duplicates
        const combinedUsers = [
          ...promisingTenants,
          ...approvedUsers.filter(
            (approvedUser) =>
              !promisingTenants.some(
                (promisingUser) =>
                  promisingUser.searchProfileId === approvedUser.searchProfileId
              )
          ),
        ];

        setFilteredUsers(combinedUsers);
      }
    };

    fetchUsersForSelectedFlat();
  }, [flats, selectedFlatIndex]);

  const handleSelect = async (searchProfileId: string) => {
    console.log(`${searchProfileId} selected`);
    const flatProfileId = flats[selectedFlatIndex].id;
    setSelectedCards((prevSelectedCards) => ({
      ...prevSelectedCards,
      [flatProfileId]: [
        ...(prevSelectedCards[flatProfileId] || []),
        searchProfileId,
      ],
    }));
    const user = filteredUsers.find(
      (user) => user.searchProfileId === searchProfileId
    );
    if (user) {
      user.matchedFlats.push(flatProfileId);

      try {
        await approveTenant(flatProfileId, searchProfileId);
        await createChat(flatProfileId, searchProfileId);
      } catch (error) {
        console.error("Error approving tenant:", error);
      }
    }
  };

  const handleDiscard = async (searchProfileId: string) => {
    console.log(`${searchProfileId} discarded`);
    const flatProfileId = flats[selectedFlatIndex].id;
    setFilteredUsers((prevFilteredUsers) =>
      prevFilteredUsers.filter(
        (user) => user.searchProfileId !== searchProfileId
      )
    );

    try {
      await disapproveTenant(flatProfileId, searchProfileId);
      await postArchiveChat(searchProfileId, flatProfileId);
    } catch (error) {
      console.error("Error discarding tenant:", error);
    }
  };

  const handleFlatSelect = (index: number) => {
    setSelectedFlatIndex(index);
  };

  const renderCards = () => {
    const cardsToShow = 3;
    const placeholders = cardsToShow - filteredUsers.length;
    const flatProfileId = flats[selectedFlatIndex].id;
    const selectedFlatCards = selectedCards[flatProfileId] || [];

    const cards = filteredUsers
      .slice(0, cardsToShow)
      .map((tenant) => (
        <SelectionCard
          key={tenant.id}
          id={tenant.id}
          name={tenant.name}
          profileImage={tenant.profileImage}
          images={tenant.images}
          tags={tenant.tags}
          about={tenant.about}
          onSelect={() => handleSelect(tenant.searchProfileId)}
          onDiscard={() => handleDiscard(tenant.searchProfileId)}
          selected={selectedFlatCards.includes(tenant.searchProfileId)}
          emailConfirmed={tenant.emailConfirmed}
          flatId={flatProfileId}
        />
      ));

    for (let i = 0; i < placeholders; i++) {
      cards.push(
        <Box
          key={`placeholder-${i}`}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width="300px"
          height="400px"
          margin="10px"
          border="1px dashed #ccc"
          borderRadius="15px"
        >
          <Typography variant="h6" color="textSecondary">
            Placeholder Card
          </Typography>
          <Typography variant="body2" color="textSecondary">
            This slot will be filled soon with an actual user.
          </Typography>
        </Box>
      );
    }
    return cards;
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      marginBottom={10}
    >
      <SelectionCarousel flats={flats} onSelect={handleFlatSelect} />
      {filteredUsers.length > 0 && <SelectionHeader />}
      {filteredUsers.length > 0 ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mt={5}
          gap={3}
        >
          {renderCards()}
        </Box>
      ) : (
        <EmptyUserPool />
      )}
      <Footer />
    </Box>
  );
}

export default SelectionPage;

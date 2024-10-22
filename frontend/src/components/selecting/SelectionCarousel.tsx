import React, { useState } from "react";
import { Box, IconButton, Avatar, Typography } from "@mui/material";
import { ArrowBack, ArrowForward, AddCircleOutline } from "@mui/icons-material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";

export interface Flat {
  id: string;
  name: string;
  imageUrl: string;
}

interface SelectionCarouselProps {
  flats: Flat[];
  onSelect: (index: number) => void;
}

const CarouselContainer = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  backgroundColor: "#fff",
  padding: "16px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  marginBottom: "24px",
}));

const CarouselItem = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 10px",
  cursor: "pointer",
  transition: "transform 0.3s",
}));

const AddButtonContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  marginLeft: "16px",
}));

const SelectionCarousel: React.FC<SelectionCarouselProps> = ({
  flats,
  onSelect,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const navigate = useNavigate();

  const handlePrevClick = (): void => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;
    setCurrentIndex(newIndex);
    onSelect(newIndex);
  };

  const handleNextClick = (): void => {
    const newIndex =
      currentIndex < flats.length - 1 ? currentIndex + 1 : currentIndex;
    setCurrentIndex(newIndex);
    onSelect(newIndex);
  };

  const handleItemClick = (index: number): void => {
    setCurrentIndex(index);
    onSelect(index);
  };

  const getVisibleItems = (): Flat[] => {
    if (flats.length === 1) {
      return flats;
    }
    if (currentIndex === 0) {
      return flats.slice(0, 2);
    }
    if (currentIndex === flats.length - 1) {
      return flats.slice(-2);
    }
    return flats.slice(currentIndex - 1, currentIndex + 2);
  };

  const getItemStyle = (
    actualIndex: number,
  ): { size: number; opacity: number } => {
    if (flats.length === 1 || actualIndex === currentIndex) {
      return { size: 60, opacity: 1 };
    }
    return { size: 40, opacity: 0.6 };
  };

  const visibleItems = getVisibleItems();

  const handleAddClick = (): void => {
    navigate("/flat-profiles");
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%">
      <CarouselContainer>
        {flats.length > 1 && (
          <IconButton onClick={handlePrevClick} disabled={currentIndex === 0}>
            <ArrowBack />
          </IconButton>
        )}
        {visibleItems.map((item) => {
          const actualIndex = flats.indexOf(item);
          const { size, opacity } = getItemStyle(actualIndex);
          return (
            <CarouselItem
              key={item.id}
              style={{ transform: `scale(${size / 60})`, opacity }}
              onClick={() => handleItemClick(actualIndex)}
            >
              <Avatar src={item.imageUrl} sx={{ width: size, height: size }} />
              <Typography
                variant="body2"
                color={
                  actualIndex === currentIndex ? "primary" : "text.secondary"
                }
              >
                {item.name}
              </Typography>
            </CarouselItem>
          );
        })}
        {flats.length > 1 && (
          <IconButton
            onClick={handleNextClick}
            disabled={currentIndex === flats.length - 1}
          >
            <ArrowForward />
          </IconButton>
        )}
        <AddButtonContainer>
          <IconButton onClick={handleAddClick}>
            <Avatar sx={{ bgcolor: "primary.main" }}>
              <AddCircleOutline sx={{ color: "#fff" }} />
            </Avatar>
          </IconButton>
          <Typography variant="body2" color="primary">
            Add
          </Typography>
        </AddButtonContainer>
      </CarouselContainer>
    </Box>
  );
};

export default SelectionCarousel;

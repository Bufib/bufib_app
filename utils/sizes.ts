import { Sizes } from "@/constants/Types";

export const returnSize = (width: number, height: number): Sizes => {
  const isLarge = width > 380 && height > 900;
  const isMedium = width < 380 && height > 650;

  return {
    elementSize: isLarge ? 125 : isMedium ? 105 : 100,
    fontSize: isLarge ? 13 : isMedium ? 11 : 11,
    badgeSize: isLarge ? 12 : isMedium ? 9 : 9,
    iconSize: isLarge ? 65 : isMedium ? 60 : 50,
    imageSize: isLarge ? 300 : isMedium ? 260 : 240,
    gap: isLarge ? 30 : isMedium ? 20 : 15,
    emptyIconSize: isLarge ? 60 : isMedium ? 40 : 30,
    emptyTextSize: isLarge ? 20 : isMedium ? 16 : 14,
    emptyGap: isLarge ? 10 : isMedium ? 5 : 5,
    isLarge,
    isMedium,
  };
};

// Old sizes
/*  const elementSize = width > 380 ? 120 : 110; // Size of each small square
  const fontSize = width > 380 ? 13 : 12; // Font of element text
  const iconSize = width > 380 ? 65 : 60; // Icon in element
  const imageSize = width > 380 ? 300 : 250; // Header image
  const gap = width > 380 ? 30 : 20; // Header image gap
  */

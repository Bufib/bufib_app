

// import { SizesType } from "@/constants/Types";

// export const returnSize = (width: number, height: number): SizesType => {
//   const isTablet = Math.min(width, height) >= 600;

//   const isMedium = !isTablet && width >= 360 && width < 414;
//   const isLarge = !isTablet && width >= 414;

//   const baseLarge = isLarge || isTablet;

//   return {
//     elementSize: baseLarge ? 125 : isMedium ? 105 : 100,
//     fontSize: baseLarge ? 13 : isMedium ? 12 : 11,
//     badgeSize: baseLarge ? 12 : isMedium ? 10 : 9,
//     iconSize: baseLarge ? 65 : isMedium ? 55 : 50,
//     imageSize: baseLarge ? 300 : isMedium ? 260 : 240,
//     gap: baseLarge ? 30 : isMedium ? 22 : 15,
//     emptyIconSize: baseLarge ? 60 : isMedium ? 40 : 30,
//     emptyTextSize: baseLarge ? 18 : isMedium ? 16 : 14,
//     emptyGap: baseLarge ? 10 : isMedium ? 6 : 5,
//     previewSizes: baseLarge ? 200 : isMedium ? 170 : 160,
//     previewSizesPaddingHorizontal: 15,
//     isLarge: baseLarge, 
//     isMedium,
//     fontsizeHomeHeaders: baseLarge ? 35 : isMedium ? 31 : 25,
//     fontsizeHomeShowAll: baseLarge ? 16 : isMedium ? 14 : 12,
//   };
// };

import { SizesType } from "@/constants/Types";

export const returnSize = (width: number, height: number): SizesType => {
  const isTablet = Math.min(width, height) >= 600;
  const isLarge = !isTablet && width >= 414;
  const isMedium = !isTablet && !isLarge && width >= 360;
  const isSmall = !isTablet && !isLarge && !isMedium;

  return {
    elementSize: isTablet ? 150 : isLarge ? 125 : isMedium ? 105 : 100,
    fontSize: isTablet ? 15 : isLarge ? 13 : isMedium ? 12 : 11,
    badgeSize: isTablet ? 14 : isLarge ? 12 : isMedium ? 10 : 9,
    iconSize: isTablet ? 75 : isLarge ? 65 : isMedium ? 55 : 50,
    imageSize: isTablet ? 350 : isLarge ? 300 : isMedium ? 260 : 240,
    gap: isTablet ? 40 : isLarge ? 30 : isMedium ? 22 : 15,
    emptyIconSize: isTablet ? 80 : isLarge ? 60 : isMedium ? 40 : 30,
    emptyTextSize: isTablet ? 22 : isLarge ? 18 : isMedium ? 16 : 14,
    emptyGap: isTablet ? 14 : isLarge ? 10 : isMedium ? 6 : 5,
    previewSizes: isTablet ? 240 : isLarge ? 200 : isMedium ? 170 : 160,
    previewSizesPaddingHorizontal: isTablet ? 20 : 15,
    isTablet,
    isLarge,
    isMedium,
    isSmall,
    fontsizeHomeHeaders: isTablet ? 42 : isLarge ? 35 : isMedium ? 31 : 25,
    fontsizeHomeShowAll: isTablet ? 18 : isLarge ? 16 : isMedium ? 14 : 12,
  };
};
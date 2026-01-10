// import { Sizes } from "@/constants/Types";

// export const returnSize = (width: number, height: number): Sizes => {
//   const isLarge = width > 380 && height > 900;
//   const isMedium = width < 380 && height > 650;

//   return {
//     elementSize: isLarge ? 125 : isMedium ? 105 : 100,
//     fontSize: isLarge ? 13 : isMedium ? 11 : 11,
//     badgeSize: isLarge ? 12 : isMedium ? 9 : 9,
//     iconSize: isLarge ? 65 : isMedium ? 60 : 50,
//     imageSize: isLarge ? 300 : isMedium ? 260 : 240,
//     gap: isLarge ? 30 : isMedium ? 20 : 15,
//     emptyIconSize: isLarge ? 60 : isMedium ? 40 : 30,
//     emptyTextSize: isLarge ? 18 : isMedium ? 16 : 14,
//     emptyGap: isLarge ? 10 : isMedium ? 5 : 5,
//     previewSizes: isLarge ? 200 : isMedium ? 170 : 160,
//     previewSizesPaddingHorizontal: isLarge ? 15 : isMedium ? 15 : 15,
//     isLarge,
//     isMedium,
//   };
// };

import { Sizes } from "@/constants/Types";

export const returnSize = (width: number, height: number): Sizes => {
  const isTablet = Math.min(width, height) >= 600;

  const isMedium = !isTablet && width >= 360 && width < 414;
  const isLarge = !isTablet && width >= 414;

  const baseLarge = isLarge || isTablet;

  return {
    elementSize: baseLarge ? 125 : isMedium ? 105 : 100,
    fontSize: baseLarge ? 13 : isMedium ? 12 : 11,
    badgeSize: baseLarge ? 12 : isMedium ? 10 : 9,
    iconSize: baseLarge ? 65 : isMedium ? 55 : 50,
    imageSize: baseLarge ? 300 : isMedium ? 260 : 240,
    gap: baseLarge ? 30 : isMedium ? 22 : 15,
    emptyIconSize: baseLarge ? 60 : isMedium ? 40 : 30,
    emptyTextSize: baseLarge ? 18 : isMedium ? 16 : 14,
    emptyGap: baseLarge ? 10 : isMedium ? 6 : 5,
    previewSizes: baseLarge ? 200 : isMedium ? 170 : 160,
    previewSizesPaddingHorizontal: 15,
    isLarge: baseLarge,
    isMedium,
    fontsizeHomeHeaders: baseLarge ? 35 : isMedium ? 31 : 25,
    fontsizeHomeShowAll: baseLarge ? 16 : isMedium ? 14 : 12,
  };
};

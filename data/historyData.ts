// constants/prophetsData.ts

import { ProphetType, SectionType } from "@/constants/Types";

export const PROPHETS_DATA: ProphetType[] = [
  { id: "adam", nameKey: "prophets.adam", route: "../knowledge/history/prophets/adam" },
  { id: "nuh", nameKey: "prophets.nuh", route: "../knowledge/history/prophets/nuh" },
  { id: "ibrahim", nameKey: "prophets.ibrahim", route: "../knowledge/history/prophets/ibrahim" },
  { id: "lut", nameKey: "prophets.lut", route: "../knowledge/history/prophets/lut" },
  { id: "ismail", nameKey: "prophets.ismail", route: "../knowledge/history/prophets/ismail" },
  { id: "yaqub", nameKey: "prophets.yaqub", route: "../knowledge/history/prophets/yaqub" },
  { id: "yusuf", nameKey: "prophets.yusuf", route: "../knowledge/history/prophets/yusuf" },
  { id: "ayyub", nameKey: "prophets.ayyub", route: "../knowledge/history/prophets/ayyub" },
  { id: "musa", nameKey: "prophets.musa", route: "../knowledge/history/prophets/musa" },
  { id: "harun", nameKey: "prophets.harun", route: "../knowledge/history/prophets/harun" },
  { id: "dawud", nameKey: "prophets.dawud", route: "../knowledge/history/prophets/dawud" },
  { id: "sulayman", nameKey: "prophets.sulayman", route: "../knowledge/history/prophets/sulayman" },
  { id: "yunus", nameKey: "prophets.yunus", route: "../knowledge/history/prophets/yunus" },
  { id: "zakariya", nameKey: "prophets.zakariya", route: "../knowledge/history/prophets/zakariya" },
  { id: "yahya", nameKey: "prophets.yahya", route: "../knowledge/history/prophets/yahya" },
  { id: "isa", nameKey: "prophets.isa", route: "../knowledge/history/prophets/isa" },
  { id: "muhammad", nameKey: "prophets.muhammad", route: "../knowledge/history/prophets/muhammad" },
];

export const AHLULBAYT_DATA: ProphetType[] = [
  { id: "ali", nameKey: "ahlulbayt.ali", route: "/ahlulbayt/ali" },
  { id: "fatima", nameKey: "ahlulbayt.fatima", route: "/ahlulbayt/fatima" },
  { id: "hassan", nameKey: "ahlulbayt.hassan", route: "/ahlulbayt/hassan" },
  { id: "hussein", nameKey: "ahlulbayt.hussein", route: "/ahlulbayt/hussein" },
  { id: "zainab", nameKey: "ahlulbayt.zainab", route: "/ahlulbayt/zainab" },
  { id: "abbas", nameKey: "ahlulbayt.abbas", route: "/ahlulbayt/abbas" },
  { id: "sajjad", nameKey: "ahlulbayt.sajjad", route: "/ahlulbayt/sajjad" },
];

export const ASHURA_DATA: ProphetType[] = [
  { id: "ashura_day_1", nameKey: "ashura.day1", route: "/ashura/day1" },
  { id: "ashura_day_2", nameKey: "ashura.day2", route: "/ashura/day2" },
  { id: "ashura_day_3", nameKey: "ashura.day3", route: "/ashura/day3" },
  { id: "ashura_day_4", nameKey: "ashura.day4", route: "/ashura/day4" },
  { id: "ashura_day_5", nameKey: "ashura.day5", route: "/ashura/day5" },
  { id: "ashura_day_6", nameKey: "ashura.day6", route: "/ashura/day6" },
  { id: "ashura_day_7", nameKey: "ashura.day7", route: "/ashura/day7" },
  { id: "ashura_day_8", nameKey: "ashura.day8", route: "/ashura/day8" },
  { id: "ashura_day_9", nameKey: "ashura.day9", route: "/ashura/day9" },
  { id: "ashura_day_10", nameKey: "ashura.day10", route: "/ashura/day10" },
];

export const SECTIONS_DATA: SectionType[] = [
  {
    id: "prophets",
    titleKey: "sections.prophets",
    backgroundImage: require("@/assets/images/prophets.png"),
    levels: PROPHETS_DATA,
  },
  {
    id: "ahlulbayt",
    titleKey: "sections.ahlulbayt",
    backgroundImage: require("@/assets/images/ahlulBayt.jpeg"),
    levels: AHLULBAYT_DATA,
  },
  {
    id: "ashura",
    titleKey: "sections.ashura",
    backgroundImage: require("@/assets/images/quran.png"),
    levels: ASHURA_DATA,
  },
];

// Helper to get level order (array of IDs) for a section
export const getLevelOrder = (sectionId: string): string[] => {
  const section = SECTIONS_DATA.find((s) => s.id === sectionId);
  return section ? section.levels.map((l) => l.id) : [];
};

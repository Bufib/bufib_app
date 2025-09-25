// constants/prophetsData.ts

import { HistoryDataType, SectionType } from "@/constants/Types";

export const PROPHETS_DATA: HistoryDataType[] = [
  {
    id: "adam",
    nameKey: "prophets.adam",
    route: "../knowledge/history/prophets/adam",
  },
  {
    id: "nuh",
    nameKey: "prophets.nuh",
    route: "../knowledge/history/prophets/nuh",
  },
  {
    id: "ibrahim",
    nameKey: "prophets.ibrahim",
    route: "../knowledge/history/prophets/ibrahim",
  },
  {
    id: "lut",
    nameKey: "prophets.lut",
    route: "../knowledge/history/prophets/lut",
  },
  {
    id: "ismail",
    nameKey: "prophets.ismail",
    route: "../knowledge/history/prophets/ismail",
  },
  {
    id: "yaqub",
    nameKey: "prophets.yaqub",
    route: "../knowledge/history/prophets/yaqub",
  },
  {
    id: "yusuf",
    nameKey: "prophets.yusuf",
    route: "../knowledge/history/prophets/yusuf",
  },
  {
    id: "ayyub",
    nameKey: "prophets.ayyub",
    route: "../knowledge/history/prophets/ayyub",
  },
  {
    id: "musa",
    nameKey: "prophets.musa",
    route: "../knowledge/history/prophets/musa",
  },
  {
    id: "harun",
    nameKey: "prophets.harun",
    route: "../knowledge/history/prophets/harun",
  },
  {
    id: "dawud",
    nameKey: "prophets.dawud",
    route: "../knowledge/history/prophets/dawud",
  },
  {
    id: "sulayman",
    nameKey: "prophets.sulayman",
    route: "../knowledge/history/prophets/sulayman",
  },
  {
    id: "yunus",
    nameKey: "prophets.yunus",
    route: "../knowledge/history/prophets/yunus",
  },
  {
    id: "zakariya",
    nameKey: "prophets.zakariya",
    route: "../knowledge/history/prophets/zakariya",
  },
  {
    id: "yahya",
    nameKey: "prophets.yahya",
    route: "../knowledge/history/prophets/yahya",
  },
  {
    id: "isa",
    nameKey: "prophets.isa",
    route: "../knowledge/history/prophets/isa",
  },
  {
    id: "muhammad",
    nameKey: "prophets.muhammad",
    route: "../knowledge/history/prophets/muhammad",
  },
];

export const AHLULBAYT_DATA: HistoryDataType[] = [
  { id: "fatima", nameKey: "ahlulbayt.fatima", route: "/ahlulbayt/fatima" },
  { id: "Imam Ali (a.)", nameKey: "ahlulbayt.ali", route: "/ahlulbayt/ali" },
  { id: "Imam Hassan (a.)", nameKey: "ahlulbayt.hassan", route: "/ahlulbayt/hassan" },
  { id: "Imam Hussein (a.)", nameKey: "ahlulbayt.hussein", route: "/ahlulbayt/hussein" },
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
];

// Helper to get level order (array of IDs) for a section
export const getLevelOrder = (sectionId: string): string[] => {
  const section = SECTIONS_DATA.find((s) => s.id === sectionId);
  return section ? section.levels.map((l) => l.id) : [];
};

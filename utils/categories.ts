import i18n from "./i18n";

export const questionCategories = [
  {
    name: i18n.t("rechtsfragen"),
    image: require("@/assets/images/rechtsfragen.png"),
    value: "Rechtsfragen",
  },
  {
    name: i18n.t("quran"),
    image: require("@/assets/images/quran.png"),
    value: "Quran",
  },
  {
    name: i18n.t("geschichte"),
    image: require("@/assets/images/geschichte.png"),
    value: "Geschichte",
  },
  {
    name: i18n.t("glaubensfragen"),
    image: require("@/assets/images/glaubensfragen.png"),
    value: "Glaubensfragen",
  },
  {
    name: i18n.t("ethik"),
    image: require("@/assets/images/ethik.png"),
    value: "Ethik",
  },
  {
    name: i18n.t("ratschlaege"),
    image: require("@/assets/images/ratschlaege.png"),
    value: "Ratschläge",
  },
];

// Prayer categories using translations
export const prayerCategories = [
  {
    id: 0,
    name: i18n.t("dua"),
    image: require("@/assets/images/dua.png"),
    value: "Dua",
  },
  {
    id: 1,
    name: i18n.t("salat"),
    image: require("@/assets/images/salat.png"),
    value: "Salat",
  },
  {
    id: 2,
    name: i18n.t("ziyarat"),
    image: require("@/assets/images/ziyarat.png"),
    value: "Ziyarat",
  },

  {
    id: 3,
    name: i18n.t("munajat"),
    image: require("@/assets/images/munajat.png"),
    value: "Munajat",
  },
  {
    id: 4,
    name: i18n.t("special"),
    image: require("@/assets/images/special.png"),
    value: "Special",
  },

  {
    id: 5,
    name: i18n.t("names"),
    image: require("@/assets/images/names.png"),
    value: "Names",
  },
];

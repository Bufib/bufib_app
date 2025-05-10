import i18n from "./i18n";

export const categories = [
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

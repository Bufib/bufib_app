// import { getQuestionInternalURL } from "@/db/queries/questions";
// import { router } from "expo-router";

// // Internal urls are the title (unique!) of the questions
// const handleOpenInternallUrl = async (
//   title: string,
//   language: string,
//   type: string
// ) => {
//   if (type === "questionLink") {
//     try {
//       const question = await getQuestionInternalURL(title, language);
//       if (!question) {
//         console.log("Question not found for title:", title);
//         return;
//       }

//       router.push({
//         pathname: "/(displayQuestion)",
//         params: {
//           category: question.question_category_name,
//           subcategory: question.question_subcategory_name,
//           questionId: question.id.toString(),
//           questionTitle: question.title,
//         },
//       });
//     } catch (error) {
//       console.error("Error fetching question:", error);
//     }
//   }
// };

// export default handleOpenInternallUrl;
// src/utils/handleOpenInternalUrl.ts
import { router } from "expo-router";
import { LanguageCode } from "@/constants/Types";
import { getQuestionInternalURL } from "@/db/queries/questions";
import { getPrayerInternalURL } from "@/db/queries/prayers";
import { getQuranInternalURL } from "@/db/queries/quran";

type InternalLinkType = "questionLink" | "prayerLink" | "quranLink";

const ROUTES = {
  question: "/(displayQuestion)",
  prayer: "/(displayPrayer)/prayer",
  quran: "/(displaySura)",
} as const;

const handleOpenInternallUrl = async (
  identifier: string,
  lang: LanguageCode,
  type: InternalLinkType
): Promise<void> => {
  const value = identifier.trim();
  if (!value) {
    console.warn("handleOpenInternallUrl: empty identifier.");
    return;
  }

  try {
    switch (type) {
      // AFTER
      case "questionLink": {
        const id = Number(value);
        if (Number.isNaN(id)) {
          console.warn(
            "handleOpenInternallUrl: invalid questionLink identifier (expected numeric id):",
            value
          );
          return;
        }

        const question = await getQuestionInternalURL(id, lang);
        if (!question) {
          console.warn(
            "handleOpenInternallUrl: Question not found for id:",
            id
          );
          return;
        }

        router.push({
          pathname: ROUTES.question,
          params: {
            category: question.question_category_name,
            subcategory: question.question_subcategory_name,
            questionId: String(question.id),
            // drop questionTitle if you no longer use it
          },
        });
        return;
      }

      case "prayerLink": {
        const prayer = await getPrayerInternalURL(value, lang);
        if (!prayer) {
          console.warn(
            "handleOpenInternallUrl: Prayer not found for identifier:",
            value
          );
          return;
        }

        router.push({
          pathname: ROUTES.prayer,
          params: { prayer: String(prayer.id) },
        });
        return;
      }

      case "quranLink": {
        const verse = await getQuranInternalURL(value, lang);
        if (!verse) {
          console.warn(
            "handleOpenInternallUrl: Quran reference not resolved:",
            value
          );
          return;
        }

        router.push({
          pathname: ROUTES.quran,
          params: {
            suraId: String(verse.sura),
            verseId: String(verse.aya),
          },
        });
        return;
      }

      default: {
        console.warn(
          "handleOpenInternallUrl: Unsupported type:",
          type,
          "for identifier:",
          value
        );
      }
    }
  } catch (error) {
    console.error(
      "handleOpenInternallUrl: Unexpected error while handling internal link:",
      { identifier: value, type, lang, error }
    );
  }
};

export default handleOpenInternallUrl;

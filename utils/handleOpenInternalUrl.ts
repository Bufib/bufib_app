import { getQuestionInternalURL } from "@/db/queries/questions";
import { router } from "expo-router";

// Internal urls are the title (unique!) of the questions
const handleOpenInternallUrl = async (title: string, language: string) => {
  try {
    const question = await getQuestionInternalURL(title, language);
    if (!question) {
      console.log("Question not found for title:", title);
      return;
    }

    router.push({
      pathname: "/(displayQuestion)",
      params: {
        category: question.question_category_name,
        subcategory: question.question_subcategory_name,
        questionId: question.id.toString(),
        questionTitle: question.title,
      },
    });
  } catch (error) {
    console.error("Error fetching question:", error);
  }
};

export default handleOpenInternallUrl;

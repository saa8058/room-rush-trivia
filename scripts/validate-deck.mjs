import { CATEGORY_MODES, TRIVIA_QUESTIONS } from "../src/questions.js";

const requiredCategories = CATEGORY_MODES.filter((category) => category !== "Mixed Party");
const errors = [];
const ids = new Set();
const nonVisualQuestionText = new Map();

for (const question of TRIVIA_QUESTIONS) {
  for (const key of ["id", "category", "difficulty", "question", "choices", "correctIndex", "explanation"]) {
    if (question[key] === undefined || question[key] === "") errors.push(`${question.id || "(missing id)"} is missing ${key}.`);
  }
  if (ids.has(question.id)) errors.push(`Duplicate question id: ${question.id}`);
  ids.add(question.id);
  if (!requiredCategories.includes(question.category)) errors.push(`${question.id} has invalid category ${question.category}`);
  if (!["Easy", "Medium", "Hard"].includes(question.difficulty)) errors.push(`${question.id} has invalid difficulty.`);
  if (!Array.isArray(question.choices) || question.choices.length !== 4) errors.push(`${question.id} must have exactly 4 choices.`);
  if (!Number.isInteger(question.correctIndex) || question.correctIndex < 0 || question.correctIndex > 3) errors.push(`${question.id} has invalid correctIndex.`);
  if (question.mediaType !== undefined && question.mediaType !== "image") errors.push(`${question.id} has unsupported mediaType.`);
  if (question.imageUrl !== undefined && !isAllowedImageUrl(question.imageUrl)) errors.push(`${question.id} imageUrl should use an approved image source.`);
  if (question.imageUrl && (!question.imageAlt || !question.imageCaption)) errors.push(`${question.id} image questions need imageAlt and imageCaption.`);
  if (!question.mediaType) {
    const duplicate = nonVisualQuestionText.get(question.question);
    if (duplicate) errors.push(`${question.id} repeats text-only question wording from ${duplicate}.`);
    nonVisualQuestionText.set(question.question, question.id);
  }
}

if (TRIVIA_QUESTIONS.length < 950) errors.push(`Expected around 1000 questions, found ${TRIVIA_QUESTIONS.length}.`);

for (const category of requiredCategories) {
  const count = TRIVIA_QUESTIONS.filter((question) => question.category === category).length;
  if (count < 10) errors.push(`${category} needs at least 10 questions, found ${count}.`);
}

const visualQuestions = TRIVIA_QUESTIONS.filter((question) => question.mediaType === "image");
if (visualQuestions.length < 200) errors.push(`Expected at least 200 visual questions, found ${visualQuestions.length}.`);

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${TRIVIA_QUESTIONS.length} trivia questions across ${requiredCategories.length} categories, including ${visualQuestions.length} visual questions.`);

function isAllowedImageUrl(imageUrl) {
  const value = String(imageUrl);
  return value.startsWith("/images/questions/")
    || value.startsWith("/api/wiki-image?")
    || value.startsWith("https://flagcdn.com/")
    || value.startsWith("https://cdn.simpleicons.org/");
}

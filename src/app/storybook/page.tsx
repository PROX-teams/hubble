import StoryCardGrid from "@/widgets/storycard-container/StoryCardContainer";
import data from "@/shared/mock/story.json";
import type { StoryEntity } from "@/entities/story/story.types";

const stories: StoryEntity[] = Array(9).fill(data).map((item, idx) => ({
  ...item,
  id: idx + 1, 
}));

export default function StorybookPage() {
  return <StoryCardGrid stories={stories} />;
}
  
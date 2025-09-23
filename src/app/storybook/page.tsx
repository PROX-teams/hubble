import StoryCardGrid from "@/entities/story/ui/story-card/StoryCardContent";
import data from "@/shared/ui/storycard/mock.json";
import type { StoryEntity } from "@/shared/types/story.types";

const stories: StoryEntity[] = Array(9).fill(data).map((item, idx) => ({
  ...item,
  id: idx + 1, 
}));

export default function StorybookPage() {
  return <StoryCardGrid stories={stories} />;
}
  
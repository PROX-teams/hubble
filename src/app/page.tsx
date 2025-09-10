import StoryCard from "@/shared/ui/storycard/StoryCard";
import data from "@/shared/ui/storycard/mock.json";
import { gridContainer} from "@/shared/ui/storycard/StoryCardGrid.css";
import type { StoryEntity } from "@/shared/types/story.types";

const stories: StoryEntity[] = Array(8).fill(data).map((item, idx) => ({
  ...item,
  id: idx + 1, 
}));

export default function MainPage() {
  return (
        <div className={gridContainer}>
          {stories.map((item) => (
            <StoryCard key={item.id} data={item} />
          ))}
        </div>
  );
}

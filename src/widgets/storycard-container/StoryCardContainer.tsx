import * as S from "./StoryCardContainer.css";
import type { StoryEntity } from "@/entities/story/story.types";
import StoryCard from "@/entities/story/ui/story-card/StoryCard";

const StoryCardContainer= ({ stories }: { stories: StoryEntity[] }) => {
  return (
        <div className={S.gridContainer}>
          {stories.length === 0 && <span>스토리가 없습니다</span>}
          {stories.map((item) => (
            <StoryCard key={item.id} data={item}/>
          ))}
        </div>
  );
};

export default StoryCardContainer;



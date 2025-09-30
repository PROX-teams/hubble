import * as S from "./StoryCardContent.css";
import type { StoryEntity } from "@/shared/types/story.types";
import StoryCard from "@/shared/ui/storycard/StoryCard";

const StoryCardContent = ({ stories }: { stories: StoryEntity[] }) => {
  return (
        <div className={S.gridContainer}>
          {stories.length === 0 && <span>스토리가 없습니다</span>}
          {stories.map((item) => (
            <StoryCard key={item.id} data={item}/>
          ))}
        </div>
  );
};

export default StoryCardContent;



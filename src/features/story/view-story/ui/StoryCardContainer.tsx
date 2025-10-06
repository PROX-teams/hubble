"use client";

import type { StoryEntity } from "@/entities/story/story.types";
import StoryCard from "@/entities/story/ui/story-card/StoryCard";
import * as S from "./StoryCardContainer.css"
import useStoryModal from "../model/useStoryModal";
import StoryCardModal from "@/widgets/storycard-modal/StoryCardModal";

interface StoryGridWithModalProps {
  stories: StoryEntity[];
}

const StoryCardContainer = ({ stories }: StoryGridWithModalProps) => {
  const { isOpen, selectedId, open, close } = useStoryModal();

  return (
    <>
      <div className={S.gridContainer}>
        {stories.length === 0 && <span>스토리가 없습니다</span>}
        {stories.map((item) => (
          <StoryCard key={item.id} data={item} onClick={() => open(item.id)} />
        ))}
      </div>
      {isOpen && selectedId != null && (
        <StoryCardModal id={selectedId} onClose={close} />
      )}
    </>
  );
};

export default StoryCardContainer;

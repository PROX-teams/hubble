"use client";

import type { Story } from "@/entities/story/story.types";
import StoryCard from "@/entities/story/ui/story-card/StoryCard";
import * as S from "./StoryCardContainer.css"
import useStoryModal from "../model/useStoryModal";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// 모달 컴포넌트를 지연 로딩 (클라이언트 사이드 전용)
const StoryCardModal = dynamic(() => import("@/widgets/storycard-modal/StoryCardModal"), {
  ssr: false,
});

interface StoryGridWithModalProps {
  stories: Story[];
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
      <AnimatePresence>
        {isOpen && selectedId != null && (
          <StoryCardModal id={selectedId} onClose={close} />
        )}
      </AnimatePresence>
    </>
  );
};

export default StoryCardContainer;

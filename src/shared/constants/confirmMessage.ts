interface ConfirmMessage {
  title: string;
  description: string;
}
type MessageType = "DELETE_STORY" | "DELETE_BOOKMARK" | "DELETE_GENERAL";

const CONFIRM_MESSAGES: Record<MessageType, ConfirmMessage> = {
  DELETE_STORY: {
    title: "정말 삭제하시겠습니까?",
    description:
      "스토리를 삭제하면 포함된 노트도 함께 삭제되며, \n 복구할 수 없습니다. 삭제 전 내용을 꼭 확인해주세요.",
  },
  DELETE_BOOKMARK: {
    title: "정말 삭제하시겠습니까?",
    description:
      "북마크를 삭제하면 포함된 노트도 함께 삭제되며,\n  복구할 수 없습니다. 삭제 전 내용을 꼭 확인해주세요.",
  },
  DELETE_GENERAL: {
    title: "정말 삭제하시겠습니까?",
    description:
      "삭제한 이후에는 복구할 수 없습니다. \n 삭제 전 내용을 꼭 확인해주세요.",
  },
};

export { CONFIRM_MESSAGES };
export type { MessageType };

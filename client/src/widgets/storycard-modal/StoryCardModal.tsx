import Modal from "@/shared/ui/modal/modal/Modal";

interface StoryCardModalProps {
    onClose: () => void;
    id: number;
}
/**
 * 
 * StoryCardModal 컴포넌트
 *
 * 스토리 카드 클릭 시 나타나는 임시 모달 컴포넌트입니다.
 * 
 */
const StoryCardModal = ({ onClose, id }: StoryCardModalProps) => {
  return (
    <Modal hide={onClose} hideOnClickOutside>
      <div>스토리 모달 {id}</div>
    </Modal>
  );
};
export default StoryCardModal;

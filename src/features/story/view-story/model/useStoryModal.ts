import { useCallback, useState } from "react";
import useModal from "@/shared/model/hooks/useModal";

const useStoryModal = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const open = useCallback((id: number) => {
    setSelectedId(id);
    openModal();
  }, [openModal]);

  const close = useCallback(() => {
    setSelectedId(null);
    closeModal();
  }, [closeModal]);

  return { isOpen, selectedId, open, close };
};

export default useStoryModal;


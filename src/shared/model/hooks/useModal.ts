import { useCallback, useState } from "react";

const useModal = () => {
  const [isOpen, toggleModal] = useState(false);

  const openModal = useCallback(() => {
    toggleModal(true);
  }, []);

  const closeModal = useCallback(() => {
    toggleModal(false);
  }, []);

  return { isOpen, openModal, closeModal };
};

export default useModal;

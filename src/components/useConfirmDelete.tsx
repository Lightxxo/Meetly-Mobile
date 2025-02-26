import { useState } from "react";
import DeleteConfirmationModal from "./DeleteConfirmationModal"; 

const useConfirmDelete = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null); 

  const confirmDelete = (deleteAction: () => void) => {
    setOnConfirm(() => () => deleteAction()); 
    setIsOpen(true);
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm(); 
    setIsOpen(false);
  };

  return {
    confirmDelete,
    modal: (
      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
      />
    ),
  };
};

export default useConfirmDelete;

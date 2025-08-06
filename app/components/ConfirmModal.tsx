import { useState } from "react";

interface ConfirmModalProps {
  onAction: () => void;
  message: string;
  okWord: string;
  idOpen: boolean;
}
const ConfirmModal: React.FC<ConfirmModalProps> = ({
  onAction,
  message,
  okWord,
  idOpen,
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(idOpen);

  const handleConfirm = () => {
    onAction();
    setIsConfirmOpen(false);
  };

  const handleCancel = () => {
    setIsConfirmOpen(false);
  };

  return (
    <>
      {isConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-10">
          <div className="bg-white p-2 rounded-xl shadow-md">
            <div className="p-4 text-gray-900">{message}</div>
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-4"
            >
              キャンセル
            </button>
            <button
              onClick={handleConfirm}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              {okWord}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmModal;

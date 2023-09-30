import { useState } from "react";
import DeleteSvg from "./svg/DeleteSvg";

interface DeleteButtonProps {
  onDelete: () => void;
  name?: string;
}
const DeleteButton: React.FC<DeleteButtonProps> = ({ onDelete, name }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirm = () => {
    onDelete();
    setIsConfirmOpen(false);
  };

  const handleCancel = () => {
    setIsConfirmOpen(false);
  };

  return (
    <>
      <button
        onClick={handleDeleteClick}
        className="text-red-500 w-full border-b border-gray-300 p-2"
      >
        <span>{name && name + "を"}削除する</span>
      </button>
      {isConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-10">
          <div className="bg-white p-2 rounded-xl shadow-md">
            <div className="p-4 text-gray-900">本当に削除しますか？</div>
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-4"
            >
              キャンセル
            </button>
            <button
              onClick={handleConfirm}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              削除
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteButton;

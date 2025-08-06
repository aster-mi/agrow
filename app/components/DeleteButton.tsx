import { useState } from "react";
import DeleteSvg from "./svg/DeleteSvg";

interface DeleteButtonProps {
  onDelete: () => void;
}
const DeleteButton: React.FC<DeleteButtonProps> = ({ onDelete }) => {
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
      <div onClick={handleDeleteClick}>
        <div className="p-3 rounded-md shadow-md bg-red-500 w-12 h-12 fill-white">
          <DeleteSvg />
        </div>
        <div className="text-xs text-gray-600 text-center mt-1">削除</div>
      </div>
      {isConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-10">
          <div className="bg-white p-5 rounded-xl shadow-2xl border-2 border-red-500">
            <div className="p-4 font-bold text-lg">本当に削除しますか？</div>
            <div className="flex flex-row justify-between">
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white w-20 h-10 rounded hover:bg-gray-600 mr-4"
              >
                キャンセル
              </button>
              <button
                onClick={handleConfirm}
                className="bg-red-500 text-white w-20 h-10 rounded hover:bg-green-600"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteButton;

import React, { useState } from "react";
import { Modal } from "antd";

type ModalButtonProps = {
  children: React.ReactNode;
  buttonChildren: React.ReactNode;
  wrapClassName?: string;
  className?: string;
};

const ModalButton = ({
  children,
  buttonChildren,
  wrapClassName,
  className,
}: ModalButtonProps) => {
  const [visible, setVisible] = useState(false);

  const handleCancel = () => setVisible(false);
  const handleOpen = () => setVisible(true);

  return (
    <>
      <button onClick={handleOpen}>{buttonChildren}</button>

      <Modal
        open={visible}
        onCancel={handleCancel}
        footer={null}
        wrapClassName={wrapClassName}
        className={className}
      >
        {children}
      </Modal>
    </>
  );
};

export default ModalButton;

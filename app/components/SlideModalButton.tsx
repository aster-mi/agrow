import React, { useState } from "react";
import { Modal } from "antd";

type SlideModalButtonProps = {
  children: React.ReactNode;
  buttonText: string;
};

const SlideModalButton = ({ children, buttonText }: SlideModalButtonProps) => {
  const [visible, setVisible] = useState(false);

  const handleCancel = () => setVisible(false);
  const handleOpen = () => setVisible(true);

  return (
    <>
      <button onClick={handleOpen}>{buttonText}</button>

      <Modal open={visible} onCancel={handleCancel} footer={null}>
        {children}
      </Modal>
    </>
  );
};

export default SlideModalButton;

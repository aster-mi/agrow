"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "antd";

type ModalButtonProps = {
  children: React.ReactNode;
  buttonChildren: JSX.Element;
  wrapClassName?: string;
  className?: string;
  isVisible?: boolean;
};

const ModalButton = ({
  children,
  buttonChildren,
  wrapClassName,
  className,
  isVisible,
}: ModalButtonProps) => {
  const [visible, setVisible] = useState(false);

  const handleCancel = () => setVisible(false);
  const handleOpen = () => setVisible(true);

  useEffect(() => {
    if (isVisible === undefined) return;
    setVisible(isVisible);
  }, [isVisible]);

  return (
    <>
      {buttonChildren &&
        React.cloneElement(buttonChildren, { onClick: handleOpen })}

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

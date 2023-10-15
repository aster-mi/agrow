"use client";

import React, { use, useState } from "react";
import ShareSvg from "./svg/ShareSvg";
import MenuDotsSvg from "./svg/MenuDots";

interface MenuButtonProps {
  contents: React.ReactNode;
}
const MenuButton: React.FC<MenuButtonProps> = ({ contents }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // メニューが開いている場合に表示する内容
  const menuContent = isMenuOpen && (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="absolute z-10 top-4 w-full">
        <div className="bg-white border rounded-lg shadow-lg">
          <div
            className="flex items-center justify-center flex-col p-1"
            onClick={handleMenuClick}
          >
            {contents}
            <button className="text-blue-500 w-full p-2">閉じる</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button onClick={handleMenuClick}>
        <MenuDotsSvg />
      </button>
      <div>{menuContent}</div>
    </>
  );
};

export default MenuButton;

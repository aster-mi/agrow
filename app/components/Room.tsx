import React from "react";

export default function Room() {
  return (
    <div className="room-container">
      <div className="room-floor"></div>
      <div className="room-wall room-wall-left"></div>
      <div className="room-wall room-wall-right"></div>
      <div className="room-wall room-wall-back"></div>
      <div className="room-wall room-wall-front"></div>
    </div>
  );
}

import React, { useContext, useEffect, useState } from "react";

import "./customCursor.scss";

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });

  useEffect(() => {
    const mouseMoveHandler = (event) => {
      const { clientX, clientY } = event;
      setMousePosition({ x: clientX, y: clientY });
    };
    document.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      document.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, []);

  const { x, y } = mousePosition;

  return (
    <>
      <div
        className="cursor"
        style={{ left: `${x}px`, top: `${y}px` }}
      />
    </>
  );
};

export default CustomCursor;

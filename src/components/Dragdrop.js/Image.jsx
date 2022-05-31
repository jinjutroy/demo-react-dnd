import React, { useEffect } from "react";
import { useDrag } from "react-dnd";

function Picture({ id, type, setElement }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "paragraph" || "button",
    item: { id: id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  useEffect(() => {
    if (isDragging && id === 2) {
      setElement("ElementButton");
    } else if (isDragging && id === 1) {
      setElement("ElementParagraph");
    } else {
      setElement("");
    }
  }, [isDragging]);
  if (type === "paragraph") {
    return (
      <div className="item-board" ref={drag}>
        <div className="dragElement"></div>
        <p>Paragraph </p>
      </div>
    );
  } else if (type === "button") {
    return (
      <div className="item-board" ref={drag}>
        <div className="dragElement"></div>
        <p>Button</p>
      </div>
    );
  }
}

export default Picture;

import React, { memo } from "react";

function Board(props) {
  const board = props.board;
  if (board) {
    return (
      <div>
        {board.map((picture, index) => {
          if (picture.type === "button") {
            return (
              <div className="board-item" key={index}>
                <button onClick={props.showDialog} id={picture.id}>
                  {picture.id === Number(props.text.id)
                    ? props.text.text
                    : picture.text || "Button"}
                </button>
              </div>
            );
          } else {
            return (
              <div className="board-item" key={index}>
                <p onClick={props.showDialog} id={picture.id}>
                  {picture.id === Number(props.text.id)
                    ? props.text.text
                    : picture.text || "Paragraph"}
                </p>
              </div>
            );
          }
        })}
      </div>
    );
  }
}

export default memo(Board);

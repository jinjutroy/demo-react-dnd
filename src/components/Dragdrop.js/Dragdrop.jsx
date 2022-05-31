import React, { useEffect, useState } from "react";
import Element from "./Image";
import { useDrop } from "react-dnd";
import "./Dragdrop.css";
import Board from "./Board";
import { Link } from "react-router-dom";
import NotificationDialog from "./Notification";
import { useDispatch, useSelector } from "react-redux";
import { createElement, deleteElementR } from "../../actions/actions";

const ElementList = [
  {
    id: 1,
    type: "paragraph",
    message: "",
    text: "",
  },
  {
    id: 2,
    type: "button",
    message: "",
    text: "",
  },
];

function DragDrop() {
  const [board, setBoard] = useState([]);
  // const [backupBoard,setBackupBoard] = useState([]);
  const [xLocation, setXLocation] = useState(200);
  const [yLocation, setYLocation] = useState(51);
  const [elementDrag, setElementDrag] = useState("");
  const [btnClick, setBtnClick] = useState(false);
  const [paragraphClick, setParagraphClick] = useState(false);
  const [text, setText] = useState("");
  const [config, setConfig] = useState();

  const [undo, setUndo] = useState([]);
  const [redo, setRedo] = useState([]);

  const [isUndo, setIsUndo] = useState();
  const [isRedo, setIsRedo] = useState();

  const counter = useSelector((state) => state.actionsUndo);
  const dispatch = useDispatch();
  useEffect(() => {
    setUndo(counter);
  }, [counter]);
  useEffect(() => {
    if (undo.length !== 0) {
      setIsUndo(true);
    } else {
      setIsUndo(false);
    }
  }, [undo.length]);

  useEffect(() => {
    if (redo.length !== 0) {
      setIsRedo(true);
    } else {
      setIsRedo(false);
    }
  }, [redo.length]);

  const [, drop] = useDrop(() => ({
    accept: "paragraph" || "button",
    drop: (item) => {
      let id = item.id - 1;
      addToBoard(id);
      setConfig();
    },
  }));

  useEffect(() => {
    fetch("https://api-demo-nextjs.herokuapp.com/api/data")
      .then((response) => response.json())
      .then((data) => {
        setBoard(data.data.value[0]);
      });
  }, []);

  // hander With Data
  const addToData = (e) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idReq: e.id,
        message: e.message,
        text: e.text,
        type: e.type,
      }),
    };
    fetch("https://api-demo-nextjs.herokuapp.com/api/data", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        data.result.shift();
        setBoard(data.result);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };
  const deleteFromData = (id) => {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idDel: Number(id),
      }),
    };
    fetch("https://api-demo-nextjs.herokuapp.com/api/data", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        data.result.shift();
        setBoard(data.result);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };
  const saveToData = (config) => { 
    let temp = config;
    if (temp.length === 0) return;
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: temp.message ,
        text: temp.text || "",
        type:  temp.type,
      }),
    };
    fetch(
      "https://api-demo-nextjs.herokuapp.com/api/data/" + temp.id,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        data.result.shift();
        setBoard(data.result);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const addToBoard = (id) => {
    let newElements = {
      id: Math.floor(Math.random() * 1000000),
      message: ElementList[id].message,
      text: ElementList[id].text,
      type: ElementList[id].type,
    };
    addToData(newElements);
    dispatch(createElement(newElements));
    setIsUndo(true);
  };
  //get location mousemove
  const getLocation = (e) => {
    setXLocation(e.clientX);
    setYLocation(e.clientY);
  };

  const showDialog = (e) => {
    let id = e.target.id;
    let element = board.filter((value) => value.id === Number(id))[0];
    let temp = {
      id: id,
      component:
        element.type === "button" ? "ElementButton" : "ElementParagraph",
      props: {},
    };
    if (element.text !== "") {
      temp.props.text = element.text;
    }
    if (element.message !== "") {
      temp.props.message = element.message;
    }
    setConfig(temp);

    if (element.type === "button") {
      setBtnClick(true);
      setParagraphClick(false);
      setText({});
    }
    if (element.type === "paragraph") {
      setParagraphClick(true);
      setBtnClick(false);
      setText({});
    }
  };
  const updateText = (e) => { 
    let temp = config;
    setText({
      id: temp.id,
      text: e.target.value,
    });
    let obj = {
      ...temp,
      props: {
        ...temp.props,
        text: e.target.value,
      },
    };
    setConfig(obj);
    board.forEach((element,index) => { 
      if(element.id === Number(obj.id)) {
        board[index].text = e.target.value;
      }
    });
  };
  const updateAlertMessage = (e) => {
    
    let temp = config;
    let obj = {
      ...temp,
      props: {
        ...temp.props,
        message: e.target.value,
      },
    };
    board.forEach((element,index) => { 
      if(element.id === Number(obj.id)) {
        board[index].message = e.target.value;
      }
    });
    // board[index].text = e.target.value; 
    setConfig(obj);
  };
  
  const deleteElement = async (e) => {
    dispatch(deleteElementR(config));
    deleteFromData(config.id);
    setConfig();
    setBtnClick(false);
    setParagraphClick(false);
  };

  const saveChange = () => { 
    board.forEach(element => { 
      saveToData(element);
    }); 
  };
  const handlerUndo = () => {
    if (!isUndo) {
      return;
    }
    let element = undo.pop();
    setRedo([...redo, element]);
    if (element?.action === "CREATE") {
      deleteFromData(element?.data?.id);
    } else if (element?.action === "DELETE") {
      let temp = {
        id: Number(element.data?.id),
        message: element.data?.props?.message || "",
        text: element.data?.props?.text || "",
        type:
          element.data?.component === "ElementParagraph"
            ? "paragraph"
            : "button",
      };
      addToData(temp);
    }
  };

  const handlerRedo = () => {
    if (!isRedo) {
      return;
    }
    let element = redo.pop();
    setUndo([...undo, element]);
    if (element?.action === "CREATE") {
      addToData(element.data);
    } else if (element?.action === "DELETE") {
      deleteFromData(element?.data?.id);
    }
  };
  const handlerExport = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(board)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";
    link.click();
  };
  const handlerImport = () => {
    board.forEach(element => {
      deleteFromData(element.id)
    });
    const link = document.createElement("input");
    link.type = "file";
    link.click();
    link.addEventListener("change", (event) => {
      const fileList = event.target.files[0];
      var reader = new FileReader(); 
      reader.onload = function(e) { 
        var contents = e.target.result;
        var json = JSON.parse(contents); 
        json.forEach(element => {
           addToData(element)
        });
    };
      reader.readAsText(fileList); 
    });
  };
  return (
    <div className="container">
      <div className="nav-bar">
        <div
          onClick={() => saveChange()}
          className="nav-bar__item absnav-bar__save"
        >
          Save
        </div>
        <div
          onClick={() => handlerUndo()}
          className={
            isUndo
              ? "nav-bar__item nav-bar__undo "
              : " nav-bar__item nav-bar__undo unactive"
          }
        >
          Undo
        </div>
        <div
          onClick={() => handlerRedo()}
          className={
            isRedo
              ? "nav-bar__item nav-bar__redo"
              : " nav-bar__item nav-bar__redo unactive"
          }
        >
          Redo
        </div>
        <div
          onClick={() => handlerExport()}
          className="nav-bar__item nav-bar__export"
        >
          Export
        </div>
        <div
          onClick={() => handlerImport()}
          className="nav-bar__item nav-bar__import"
        >
          Import
        </div>
        <Link
          className="nav-bar__item nav-bar__view"
          to="/consumers"
          target="_blank"
        >
          View
        </Link>
        <NotificationDialog />
      </div>
      <div className="wrapper">
        <div className="wrapper-board">
          <div className="Pictures">
            {ElementList.map((picture, index) => {
              return (
                <Element
                  key={index}
                  type={picture.type}
                  id={picture.id}
                  setElement={(value) => setElementDrag(value)}
                />
              );
            })}
          </div>
          <div className="Board" onMouseMove={(e) => getLocation(e)} ref={drop}>
            <div className="details">
              <div>
                Mouse: ({xLocation - 200}, {yLocation - 51})
              </div>
              <div>Dragging: {elementDrag}</div>
              <div>Instances: {board.length}</div>
              <div>Config: {JSON.stringify(config)}</div>
            </div>
            <Board
              board={board}
              text={text}
              showDialog={(value) => showDialog(value)}
            />
            <div className="change-info">
              <div className={btnClick ? "change-info show" : " hide"}>
                <div className="wrap-button">
                  <div className="">
                    <div>
                      <div>Button Text</div>
                      <input
                        onFocus={(e) => (e.target.value = "")}
                        onChange={(e) => updateText(e)}
                        type="text"
                      />
                    </div>
                    <div>
                      <div>Alert Message</div>
                      <input
                        onFocus={(e) => (e.target.value = "")}
                        onChange={(e) => updateAlertMessage(e)}
                        type="text"
                      />
                    </div>
                  </div>
                  <button
                    onClick={(e) => deleteElement(e)}
                    className="button-delete"
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className={paragraphClick ? "change-info show" : " hide"}>
                <div className="wrap-paragraph">
                  <div>
                    <div>Paragraph Text</div>
                    <input
                      onFocus={(e) => (e.target.value = "")}
                      onChange={(e) => updateText(e)}
                      type="text"
                    />
                  </div>
                  <button
                    onClick={(e) => deleteElement(e)}
                    className="button-delete"
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DragDrop;

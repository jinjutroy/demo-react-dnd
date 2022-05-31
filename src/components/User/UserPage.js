
import React, { useEffect, useState } from 'react';
import "./UserPage.css"

export default function Consumers(props) {
    const [elementList, setElementList] = useState([]);
    useEffect(() => {
        fetch("https://api-demo-nextjs.herokuapp.com/api/data")
            .then((response) => response.json())
            .then((data) => {
                setElementList(data.data.value[0]);
            });
    }, []);

    const showDialog = (e) => {
        const id = e.target.id;
        const element = elementList.filter(value => value.id === Number(id))[0];
        console.log(element);
        alert(element.message);
    }
    if (elementList) {
        return (
            <div className='wrapper-view-consumers'>
                {elementList.map((element, index) => {
                    if (element.type === "button") {
                        return (
                            <div key={index} onClick={props.showDialog}>
                                <button onClick={e => showDialog(e)} id={element.id} >{element.text || "Button"}</button>
                            </div>
                        );
                    } else {
                        return <div key={index} onClick={props.showDialog}>
                            <p id={element.id}  >{(element.text || "Paragraph")}</p>
                        </div>

                    }
                })}

            </div>
        )
    }else{
        <h1>Don't have data</h1>
    }
}
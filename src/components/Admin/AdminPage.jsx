import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'; 
import DragDrop from '../Dragdrop.js/Dragdrop';


export default function AdminPage() {
    return <div>
        <DndProvider backend={HTML5Backend}>
            <div className="App">
                <DragDrop />
            </div>
        </DndProvider>
    </div>
}
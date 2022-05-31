import React from 'react';
import './App.css';
import AdminPage from './components/Admin/AdminPage';
import {
  BrowserRouter as Router,
  Routes,
  Route, 
  Navigate
} from "react-router-dom";
import Consumers from './components/User/UserPage';
function App() {
  return ( 
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminPage/>}>
         
        </Route>
        <Route path="/consumers" element={<Consumers/>}>
          
        </Route>
        <Route path="/" element={<Navigate to="/admin"/>}>  
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

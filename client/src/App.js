import React from "react"
import './App.css';
import Landing from './Pages/Landing'
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import WorkerManager from "./Pages/WorkerManager";
import MenuAppBar from "./components/MenuAppBar";



function App() {
  

  return (
    
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<MenuAppBar />}>
            <Route index element={<Landing />} />
            <Route path="/workermanager" element={<WorkerManager />} />
            
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;

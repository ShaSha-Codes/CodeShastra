import React from "react"
import './App.css';
import Landing from './Pages/Landing'
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import WorkerManager from "./Pages/WorkerManager";
import MenuAppBar from "./components/MenuAppBar";
import Attendance from "./Pages/Attendance";
import Violations from "./Pages/Violations";
import Dashboard from "./Pages/Dashboard";
import FaceRecognition from './Pages/FaceRecognition'
import Location from "./Pages/Location";
import Safety from "./Pages/Safety"



function App() {
  

  return (
    
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<MenuAppBar />}>
            <Route index element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/video" element={<FaceRecognition/>}/>
            <Route path="/safety" element={<Safety/>}/>
              <Route path="/location" element={<Location/>}/>
            <Route path="/workermanager" element={<WorkerManager />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/violations" element={<Violations />} />
            
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;

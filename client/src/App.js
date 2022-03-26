import React from "react"
import './App.css';
import Landing from './Pages/Landing'
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import WorkerManager from "./Pages/WorkerManager";
import MenuAppBar from "./components/MenuAppBar";
import Attendance from "./Pages/Attendance";
import Violations from "./Pages/Violations";
<<<<<<< HEAD
import Dashboard from "./Pages/Dashboard";
=======
import FaceRecognition from './Pages/FaceRecognition'
import Location from "./Pages/Location";
>>>>>>> 9fd8433fc713f580f77431f6de226b6d116aa4aa



function App() {
  

  return (
    
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<MenuAppBar />}>
            <Route index element={<Landing />} />
<<<<<<< HEAD
            <Route path="/dashboard" element={<Dashboard />} />
=======
            <Route path="/video" element={<FaceRecognition/>}/>
              <Route path="/location" element={<Location/>}/>
>>>>>>> 9fd8433fc713f580f77431f6de226b6d116aa4aa
            <Route path="/workermanager" element={<WorkerManager />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/violations" element={<Violations />} />
            
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;

// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner"; 
import Home from "./components/Home";


// Components

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />


        
        


      </Routes>
      
      <Toaster richColors position="top-right" />

    </Router>
  );
}

export default App;

// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppContainer from "./AppContainer/AppContainer";
import { useState } from 'react'

// 페이지 import 
import HomePage from "./pages/HomePage/HomePage" ; 
import HostPage from "./pages/HostPage/HostPage" ;
// Context Privider 
import {AuthProvider} from "./contexts/AuthContext" ; 

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContainer>
          <Routes>
            {/* 기본 경로 */ }
            <Route path = "/" element={<HomePage/>}/>
            <Route path = "/host" element={<HostPage/>}/>
          </Routes>
        </AppContainer>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

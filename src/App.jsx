// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppContainer from "./AppContainer/AppContainer";
import { useState } from 'react'

// 페이지 import 
import HomePage from "./pages/HomePage/HomePage" ; 
import HostPage from "./pages/HostPage/HostPage" ;
import LoginPage from "./pages/LoginPage/LoginPage" ;
import SigninPage from "./pages/SigninPage/SigninPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import DetailPage from "./pages/DetailPage/DetailPage";
import RegistPage from './pages/RegistPage/RegistPage';

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
            <Route path = "/login" element={<LoginPage/>}/>
            <Route path = "/signin" element={<SigninPage/>}/>
            <Route path = "/search" element={<SearchPage/>}/>
            <Route path = "/detail" element={<DetailPage/>}/>
            <Route path = "/regist" element={<RegistPage/>}/>
          </Routes>
        </AppContainer>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

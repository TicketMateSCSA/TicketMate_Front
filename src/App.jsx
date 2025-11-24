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
<<<<<<< HEAD
import RegistPage from './pages/RegistPage/RegistPage';
=======
import MyPage from "./pages/MyPage/MyPage";
>>>>>>> 1f70dab449317ab489e18e005b3e32b6f0985f51

// Context Privider 
import {AuthProvider} from "./contexts/AuthContext" ; 
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContainer>
          <Routes>
            {/* 기본 경로 */ }
            <Route path = "/" element={<HomePage/>}/>
            <Route path = "/host" element={<ProtectedRoute><HostPage/></ProtectedRoute>}/>
            <Route path = "/login" element={<LoginPage/>}/>
            <Route path = "/signin" element={<SigninPage/>}/>
            <Route path = "/search" element={<SearchPage/>}/>
            <Route path = "/detail" element={<DetailPage/>}/>
<<<<<<< HEAD
            <Route path = "/regist" element={<RegistPage/>}/>
=======
            <Route path = "/myPage" element={<ProtectedRoute><MyPage/></ProtectedRoute>}/>
>>>>>>> 1f70dab449317ab489e18e005b3e32b6f0985f51
          </Routes>
        </AppContainer>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

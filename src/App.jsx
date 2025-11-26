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
import MyPage from "./pages/MyPage/MyPage";
import AdminLoginPage from "./pages/AdminPage/AdminLoginPage";
import AdminPage from "./pages/AdminPage/AdminPage";

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
            <Route path = "/detail/:matePostId" element={<DetailPage/>}/>
            <Route path = "/regist/:matePostId" element={<ProtectedRoute><RegistPage/></ProtectedRoute>}/>
            <Route path = "/myPage" element={<ProtectedRoute><MyPage/></ProtectedRoute>}/>
          </Routes>
        </AppContainer>
        <Routes>
            <Route path = "/admin/login" element={<ProtectedRoute><AdminLoginPage/></ProtectedRoute>}/>
            <Route path = "/admin" element={<ProtectedRoute><AdminPage/></ProtectedRoute>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

// src/AppContainer/AppContainer.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import './AppContainer.css';

const AppContainer = ({ children }) => {
  const location = useLocation();

  // admin 페이지 경로 리스트
  const adminPaths = ["/admin", "/admin/login"];
  const isAdminPage = adminPaths.includes(location.pathname);

  // admin 페이지면 AppContainer CSS 적용 안 함
  if (isAdminPage) {
    return <>{children}</>;
  }

  // 일반 페이지에서는 AppContainer CSS 적용
  return (
    <div className="app-wrapper">
      <div className="app-content">
        {children}
      </div>
    </div>
  );
}

export default AppContainer;

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation(); 

    if (isLoading) {
        // 로딩 중에는 스켈레톤 표시 가능
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        // 로그인 안 됐으면 로그인 페이지로 이동
        return <Navigate to="/login" state={{ from: location, showAlert:true }} replace />;
    }

    // 로그인 되어 있으면 children 렌더링
    return children;
};

export default ProtectedRoute;

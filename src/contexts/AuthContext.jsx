import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { apiFetch } from '../utils/api';

// 일반 회원 정보 조회
const fetchMyProfile = async () => {
    const memUrl = `${import.meta.env.VITE_POSTS_URL}/members/me`;
    const res = await apiFetch(memUrl, { method: "GET" });
    return res.result || null;
};

// 관리자 정보 조회
const fetchAdminProfile = async () => {
    const adminUrl = `${import.meta.env.VITE_POSTS_URL}/admin/me`;
    const res = await apiFetch(adminUrl, { method: "GET" });
    return res.result || null;
};

// AuthContext 생성
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [userProfile, setUserProfile] = useState(null);     // 일반 회원
    const [adminProfile, setAdminProfile] = useState(null);   // 관리자 전용

    // 일반 로그인 성공 처리
    const loginSuccess = useCallback((userData) => {
        setIsAuthenticated(true);
        setAdminProfile(null);   // 일반 로그인 시 관리자 정보 초기화
        setUserProfile(userData);
    }, []);

    // 관리자 로그인 성공 처리
    const adminLoginSuccess = useCallback((adminData) => {
        setIsAuthenticated(true);
        setUserProfile(null);    // 관리자 로그인 시 회원 정보 초기화
        setAdminProfile(adminData);
    }, []);

    // ------ 일반 로그인 ------
    const login = useCallback(async (email, password) => {
        try {
            const loginUrl = `${import.meta.env.VITE_POSTS_URL}/login`;
            const body = { mem_email: email, mem_password: password };

            const res = await apiFetch(loginUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            if (res.code === "COMMON200") {
                const memberProfile = await fetchMyProfile();
                loginSuccess(memberProfile);
            } else {
                alert(res.message);
            }

            return res;

        } catch (error) {
            console.error("로그인 오류:", error);
            throw error;
        }
    }, [loginSuccess]);

    // ------ 관리자 로그인 ------
    const admin_login = useCallback(async (email, password, key) => {
        try {
            const loginUrl = `${import.meta.env.VITE_POSTS_URL}/admin/login`;
            const body = { mem_email: email, mem_password: password, admin_key: key };

            const res = await apiFetch(loginUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            if (res.code === "COMMON200") {
                const profile = await fetchAdminProfile();
                adminLoginSuccess(profile);
            } else {
                alert(res.message);
            }

            return res;

        } catch (error) {
            console.error("관리자 로그인 오류:", error);
            throw error;
        }
    }, [adminLoginSuccess]);

    // ------ 로그아웃 ------
    const logout = useCallback(async () => {
        try {
            const logoutUrl = `${import.meta.env.VITE_POSTS_URL}/logout`;
            await apiFetch(logoutUrl, { method: "POST" });
        } catch (e) {
            console.error("로그아웃 오류:", e);
        } finally {
            setIsAuthenticated(false);
            setUserProfile(null);
            setAdminProfile(null);
        }
    }, []);

    // ------ 새로고침 시 세션 복원 ------
    useEffect(() => {
        const restore = async () => {
            try {
                // 관리자 세션이 우선
                const admin = await fetchAdminProfile();
                if (admin) {
                    setAdminProfile(admin);
                    setIsAuthenticated(true);
                    return;
                }

                const member = await fetchMyProfile();
                if (member) {
                    setUserProfile(member);
                    setIsAuthenticated(true);
                    return;
                }

                setIsAuthenticated(false);

            } catch (e) {
                setIsAuthenticated(false);
                setUserProfile(null);
                setAdminProfile(null);
            } finally {
                setIsLoading(false);
            }
        };

        restore();
    }, []);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            isLoading,

            userProfile,
            adminProfile,

            login,
            loginSuccess,

            admin_login,
            adminLoginSuccess,

            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

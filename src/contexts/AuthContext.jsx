import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { apiFetch } from '../utils/api';

// GET members/me 호출(새로고침 시 세션 확인)
const fetchMyProfile = async () => {
    const memUrl = `${import.meta.env.VITE_POSTS_URL}/members/me`;
    const res = await apiFetch(memUrl, { method: "GET" });
    // 서버 응답 구조가 { code, result } 라면 result를 반환
    return res.result || null;
};

// 1. Context 생성
const AuthContext = createContext(null);

// 2. Provider 컴포넌트
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태

    const loginSuccess = useCallback((userData) => {
        setIsAuthenticated(true);
        setUserProfile(userData);
    }, []);

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
                // 로그인 성공 후 실제 회원 정보 가져오기
                const memberProfile = await fetchMyProfile();
                loginSuccess(memberProfile);
            } else if (res.code === "NON_MEMBER400") {
                alert(res.message);
            } else if (res.code === "WRONG_PASSWORD401") {
                alert(res.message);
            }

            return res;
        } catch (error) {
            console.error("예상치 못한 오류:", error);
            throw error;
        }
    }, [loginSuccess]);

    const logout = useCallback(async () => {
        try {
            const logoutUrl = `${import.meta.env.VITE_POSTS_URL}/logout`;
            await apiFetch(logoutUrl, { method: "POST" }); // Session 기반이면 쿠키 삭제 등 처리
        } catch (error) {
            console.error("로그아웃 실패:", error);
        } finally {
            setIsAuthenticated(false);
            setUserProfile(null);
        }
    }, []);

    // 새로고침 시 로그인 상태 복구
    useEffect(() => {
        const loadUser = async () => {
            try {
                const memberProfile = await fetchMyProfile();
                if (memberProfile) {
                    setIsAuthenticated(true);
                    setUserProfile(memberProfile);
                } else {
                    setIsAuthenticated(false);
                    setUserProfile(null);
                }
            } catch (error) {
                setIsAuthenticated(false);
                setUserProfile(null);
            } finally {
                setIsLoading(false);
            }
        };
        loadUser();
    }, []);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            userProfile,
            isLoading,
            loginSuccess,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// 4. 사용자 정의 훅
export const useAuth = () => useContext(AuthContext);

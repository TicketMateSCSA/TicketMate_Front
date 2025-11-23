import React, { createContext, useState, useContext, useCallback, useEffect } from 'react'; // ⭐ useEffect 추가
import { apiFetch } from '../utils/api';

// GET members/me 호출(새로고침 시 세션 확인)
const fetchMyProfile = async () => {
    const memUrl = `${import.meta.env.VITE_POSTS_URL}/members/me`;
    // console.log(`${import.meta.env.VITE_POSTS_URL}`)
    const member = await apiFetch(memUrl, {
        method:"GET", 
    }); 
    return member
};

// 1. Context 생성
const AuthContext = createContext(null);

// 2. Provider 컴포넌트
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    // ⭐ 로딩 상태 추가: 인증 정보 복구 중임을 나타냅니다.
    const [isLoading, setIsLoading] = useState(true); 

    const loginSuccess = useCallback((userData) => {
        setIsAuthenticated(true);
        setUserProfile(userData);
    }, []);

    const login = useCallback(async (email, password) => {
        try {
            const loginUrl = `${import.meta.env.VITE_POSTS_URL}/login`;
            const body = {
                mem_email: email,
                mem_password: password
            };
            console.log("서버로 보내는 RequestBody:", JSON.stringify(body));

            const res = await apiFetch(loginUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body) 
            });

            if (res.code === "COMMON200") {
                loginSuccess(res.data);
            }else if (res.code === "NON_MEMBER400") {
                alert(res.message) ; 
            }else if (res.code === "WRONG_PASSWORD401") {
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
    
    // ⭐ 3. 새로고침 시 로그인 상태 복구 useEffect
    useEffect(() => {
        const loadUser = async () => {
            try {
                // 1. /users/me Mock API 호출을 통해 사용자 정보 로드 시도
                const member = await fetchMyProfile(); 

                // 2. 응답 성공 시 로그인 상태 복구
                setIsAuthenticated(true);
                setUserProfile(member);
            } catch (error) {
                // 3. 응답 실패 시 (세션 만료 등) 로그인 상태 유지 안 함
                setIsAuthenticated(false);
                setUserProfile(null);
            } finally {
                // 4. 로딩 완료
                setIsLoading(false); 
            }
        };
        loadUser();
    }, []); // 마운트 시점에 단 한 번만 실행

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            userProfile, 
            isLoading, // ⭐ isLoading 상태 제공
            loginSuccess,
            login, 
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// 4. 사용자 정의 훅 (Hook)
export const useAuth = () => useContext(AuthContext);
import React, { createContext, useState, useContext, useCallback, useEffect } from 'react'; // ⭐ useEffect 추가

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

    const logout = useCallback(() => {
        setIsAuthenticated(false);
        setUserProfile(null);
        // TODO: 백엔드 로그아웃 API 호출 및 쿠키 삭제 로직 추가 (나중에 구현)
    }, []);
    
    // ⭐ 3. 새로고침 시 로그인 상태 복구 useEffect
    useEffect(() => {
        const loadUser = async () => {
            try {
                // 1. /users/me Mock API 호출을 통해 사용자 정보 로드 시도
                const user = await fetchMyProfile(); 

                // 2. 응답 성공 시 로그인 상태 복구
                setIsAuthenticated(true);
                setUserProfile(user);
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
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// 4. 사용자 정의 훅 (Hook)
export const useAuth = () => useContext(AuthContext);
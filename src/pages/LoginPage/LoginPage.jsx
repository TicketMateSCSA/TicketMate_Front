import "./LoginPage.css";
import Navigator from "../../components/Navigator/Navigator";
import { useNavigate, useLocation } from "react-router-dom";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";

function Login(){
    const navigate = useNavigate();
    const location = useLocation(); 

    const hasShownAlert = useRef(false);

    useEffect(() => {
        if (!hasShownAlert.current && location.state?.from) {
            alert("해당 서비스는 로그인이 필요합니다.");
            hasShownAlert.current = true;
        }
    }, [location.state]);
        
    const goToSigninPage = () => {
        navigate("/signin");
    }
    const { isAuthenticated, userProfile, login, logout } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const from = location.state?.from?.pathname || "/";

    const handleLogin = async () => {
    try {
        const res = await login(email, password);

        // userProfile에서 관리자 여부 확인
        const profile = res.result || userProfile; 
        console.log("User Profile after login:", profile);
        if(profile?._manager){
            const confirmRedirect = window.confirm(
                "관리자 계정은 일반 로그인 페이지로 로그인할 수 없습니다. 관리자 로그인 페이지로 이동하시겠습니까?"
            );
            if(confirmRedirect){
                navigate("/admin/login");
            }
            return;
        }

        if (res.code === "COMMON200") {
            navigate(from, { replace: true });
        } else {
            setErrorMessage(res.message || "로그인 실패");
        }

        } catch (error) {
            setErrorMessage("로그인 중 오류가 발생했습니다.");
            // console.error(error);
        } finally {
            console.clear(); // 콘솔에 안 뜨도록
        }
    };

    return (
        <div className="login-page-container">
            <Navigator/>

            <div className="box">
                <p className="title">로그인</p>

                <p className="name">이메일<span className="star">*</span></p>
                <input
                    className="write"
                    type="email"
                    placeholder="abc@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
                />

                <p className="name">비밀번호<span className="star">*</span></p>
                <input
                    className="write"
                    type="password"
                    placeholder="******"
                    value={password}
                    autoComplete="off"
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
                />
                <br/>
                {/* <input type="checkbox" name="lg" value="mt"/> */}
                {/* <p className="maintain">로그인 유지</p> */}
                {/* <p className="findPwd">비밀번호 찾기</p> */}

                {/* {errorMessage && <p className="error">{errorMessage}</p>} */}

                <button className="loginBtn" onClick={handleLogin}>로그인</button>

                <p className="noAccount">
                    계정이 없으신가요?
                    <span className="signIn" onClick={goToSigninPage}>회원가입</span>
                </p>
            </div>
        </div>
    )
}

export default Login;

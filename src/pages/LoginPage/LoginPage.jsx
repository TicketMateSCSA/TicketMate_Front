import "./LoginPage.css";
import Navigator from "../../components/Navigator/Navigator";
import { useNavigate } from "react-router-dom";

import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

function Login(){
    const navigate = useNavigate();
    
    const goToSigninPage = () => {
        navigate("/signin");
    }
    
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async () => {
        try {
            const res = await login(email, password);
            console.log("LoginPage-email=>", email);
            console.log("LoginPage-password=>", password);
            console.log(res.code) ; 
            
            if (res.code === "COMMON200") {
                navigate("/"); // 로그인 성공 시 홈으로
            } else {
                setErrorMessage(res.message || "로그인 실패");
            }
        } catch (error) {
            setErrorMessage("로그인 중 오류가 발생했습니다.");
            console.error(error);
        }
    };

    return (
        <div className="login-page-container">
            <Navigator/>

            <div className="box">
                <p className="title">로그인</p>

                <p className="name">이메일<span className="star">*</span></p>
                <input className="write" type="email" placeholder="abc@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)}/>

                <p className="name">비밀번호<span className="star">*</span></p>
                <input className="write" type="password" placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <br/>
                <input type="checkbox" name="lg" value="mt"/>

                <p className="maintain">로그인 유지</p>
                <p className="findPwd">비밀번호 찾기</p>

                {errorMessage && <p className="error">{errorMessage}</p>}

                <button className="loginBtn" onClick={handleLogin}>로그인</button>

                <p className="noAccount">계정이 없으신가요?<span className="signIn" onClick={goToSigninPage} >회원가입</span></p>
                
            </div>
        </div>
    )
}

export default Login;
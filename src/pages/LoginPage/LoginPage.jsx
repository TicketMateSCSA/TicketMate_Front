import "./LoginPage.css";
import Navigator from "../../components/Navigator/Navigator";
import { useNavigate } from "react-router-dom";

function Login(){
    const navigate = useNavigate();

    const goToSigninPage = () => {
        navigate("/signin");
    }

    return (
        <div className="login-page-container">
            <Navigator/>

            <div className="box">
                <p className="title">로그인</p>

                <p className="name">이메일<span class="star">*</span></p>
                <input className="write" type="email" placeholder="abc@gmail.com"/>

                <p className="name">비밀번호<span class="star">*</span></p>
                <input className="write" type="password" placeholder="******"/>
                <br/>
                <input type="checkbox" name="lg" value="mt"/>

                <p className="maintain">로그인 유지</p>
                <p className="findPwd">비밀번호 찾기</p>

                <button className="loginBtn">로그인</button>

                <p className="noAccount">계정이 없으신가요?<span className="signIn" onClick={goToSigninPage} >회원가입</span></p>
                
            </div>
        </div>
    )
}

export default Login;
import './Navigator.css';
import logo from '../../assets/images/logo.png';
import searchIcon from '../../assets/icons/searchIcon.png';

import { useNavigate, useLocation } from "react-router-dom";

function Navigator(){
    const navigate = useNavigate();
    const location = useLocation();

    const goToHomePage = () => {
        navigate("/");
    }
    const goToHostPage = () => {
        navigate("/host");
    }
    const goToLoginPage = () => {
        navigate("/login");
    }
    const goToSigninPage = () => {
        navigate("/signin");
    }

    return (
        <nav>
            {/* 1. 좌상단 로고, 우상단 검색창 */}
            <div className="head">
                <img src={logo}></img>
                <input type="text" placeholder='공연, 메이트 검색'></input>
                <button>
                    <img src={searchIcon}></img>
                </button>
            </div>

            {/* 2. 네비게이터 */}
            <div className="navi">
                <button className={location.pathname === "/" ? "home active" : "home"}
                        onClick={goToHomePage}
                        >홈</button>
                
                {/* onclick 설정 필요 */}
                <button className="findMate">메이트 찾기</button>

                <button className={location.pathname === "/host" ? "host active" : "host"}
                        onClick={goToHostPage}
                        >메이트 모집하기</button>

                {/* onclick 설정 필요 */}
                <button className="info">공연 정보</button>

                <button className={location.pathname == "/login" ? "login active" : "login"}
                        onClick={goToLoginPage}
                    >로그인</button>

                <button className={location.pathname == "/signin" ? "signin active" : "signin" }
                        onClick={goToSigninPage}
                        >회원가입</button>
            </div>
        </nav>
        
    );
}

export default Navigator;
import './Navigator.css';
import logo from '../../assets/images/logo.png';
import searchIcon from '../../assets/icons/searchIcon.png';
import noProfile from '../../assets/images/no-profile.png';

import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';

function Navigator(){
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, userProfile, logout } = useAuth();

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
    const goToSearchPage = () => {
        navigate("/search");
    }
    const goToMyPage = () => {
        navigate("/myPage");
    }

    // 로그아웃
    const handleLogout = () => {
        const confirmLogout = window.confirm("정말 로그아웃 하시겠습니까?");
        if (confirmLogout){
            logout();
            navigate(from, { replace: true });
        }
    };

    return (
        <nav>
            {/* 1. 좌상단 로고, 우상단 검색창 */}
            <div className="head">
                <img src={logo} onClick={goToHomePage}></img>
                <input type="text" placeholder='공연, 메이트 검색'></input>
                <button>
                    <img src={searchIcon}></img>
                </button>
            </div>

            {/* 2. 네비게이터 */}
            <div className="navi">
            <button className={location.pathname === "/" ? "home active" : "home"} onClick={goToHomePage}>홈</button>
            <button className={location.pathname === "/search" || location.pathname === "/detail" || location.pathname == "/regist" ? "search active" : "search"} onClick={goToSearchPage}>메이트 찾기</button>
            <button className={location.pathname === "/host" ? "host active" : "host"} onClick={goToHostPage}>메이트 모집하기</button>
            <button className="info">공연 정보</button>

            {isAuthenticated ? (
                <>  
                    <button className={location.pathname === "/myPage" ? "user-nickname active" : "user-nickname"} onClick={goToMyPage}>
                        <img className="nav-myImg" src={userProfile.mem_img_url? userProfile.mem_img_url : noProfile} alt="profile" />
                        <span className="nav-myNN">{userProfile?.mem_nn? userProfile.mem_nn: userProfile.mem_name} 님</span>
                    </button>
                    <button className="logout" onClick={handleLogout}>로그아웃</button>
                </>
            ) : (
                <>
                    <button className={location.pathname === "/login" ? "login active" : "login"} onClick={goToLoginPage}>로그인</button>
                    <button className={location.pathname === "/signin" ? "signin active" : "signin"} onClick={goToSigninPage}>회원가입</button>
                </>
            )}
            </div>
        </nav>
        
    );
}

export default Navigator;
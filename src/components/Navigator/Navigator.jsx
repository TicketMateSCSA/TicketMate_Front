import './Navigator.css';
import logo from '../../assets/images/logo.png';
import searchIcon from '../../assets/icons/searchIcon.png';

function Navigator(){
    return (
        <nav>
            <div class="head">
                <img src={logo}></img>
                <input type="text" placeholder='공연, 메이트 검색'></input>
                <button>
                    <img src={searchIcon}></img>
                </button>
            </div>

            <div class="navi">
                <button class="home">홈</button>
                <button class="findMate">메이트 찾기</button>
                <button class="getMate">메이트 모집하기</button>
                <button class="info">공연 정보</button>

                <button class="logIn">로그인</button>
                <button class="signIn">회원가입</button>
            </div>
        </nav>
        
    );
}

export default Navigator;
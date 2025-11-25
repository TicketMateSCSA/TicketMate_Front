import "./MyPage.css";
import Navigator from "../../components/Navigator/Navigator";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ageMap = {0: '10대', 1: '20대', 2: '30대', 3: '40대', 4: '50대+'};
const genderMap = {0: '무관', 1: '남성', 2: '여성'};

function MyPage(){
    const { isAuthenticated, userProfile, logout } = useAuth();

    if (!isAuthenticated) {
        return (
            <div className="my-page-container">
                <h1>로그인이 필요합니다.</h1>
            </div>
        );
    }

    return(
        <div className="my-page-container">
            <Navigator />
            <div className="box">
                <h1>MY PAGE</h1>
                <div className="user-info">
                    <p>프로필 이미지: {userProfile?.mem_img_url && (
                        <img 
                            src={userProfile.mem_img_url} 
                            alt="프로필 이미지" 
                            className="profile-img"
                        />
                    )} </p>
                    <p>닉네임: {userProfile?.mem_nn}님</p>
                    <p>이메일: {userProfile?.mem_email}</p>
                    <p>성별: {genderMap[userProfile?.mem_gender]}</p>
                    <p>생년월일: {userProfile?.mem_bd}</p>
                    <p>점수: {userProfile?.mem_score}</p>
                    <p>메이트 수: {userProfile?.mem_num_of_mates}</p>
                </div>
            </div>
        </div>
    )
}

export default MyPage;

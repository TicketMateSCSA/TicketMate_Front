import "./SigninPage.css";
import Navigator from "../../components/Navigator/Navigator";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Signin() {
    const navigate = useNavigate();

    const goToLoginPage = () => {
        navigate("/login");
    };

    // 체크박스 상태 관리
    const [allChecked, setAllChecked] = useState(false);
    const [checks, setChecks] = useState({
        one: false,
        two: false,
        three: false,
    });

    // 전체 동의 클릭 시
    const handleAllChange = (e) => {
        const checked = e.target.checked;
        setAllChecked(checked);
        setChecks({
            one: checked,
            two: checked,
            three: checked,
        });
    };

    // 개별 박스 클릭 시
    const handleItemChange = (e) => {
        const { name, checked } = e.target;
        const newChecks = {
            ...checks,
            [name]: checked,
        };
        setChecks(newChecks);

        // 개별 체크박스 3개가 모두 체크되면 전체도 체크
        const all = Object.values(newChecks).every((v) => v === true);
        setAllChecked(all);
    };

    return (
        <div className="signin-page-container">
            <Navigator />

            <div className="box2">
                <p className="title">회원가입</p>

                <p className="name">이름<span className="star">*</span></p>
                <input className="write" type="text" placeholder="홍길동" />

                <p className="name">닉네임</p>
                <input className="write" type="text" placeholder="회원33" />

                <p className="name">이메일<span className="star">*</span></p>
                <input className="write" type="email" placeholder="abc@gmail.com" />

                <p className="name">비밀번호<span className="star">*</span></p>
                <input className="write" type="password" placeholder="******" />

                <br />

                {/* 전체 동의 */}
                <input
                    className="checkall"
                    type="checkbox"
                    checked={allChecked}
                    onChange={handleAllChange}
                />
                <p className="allOK">전체 동의</p>

                {/* 개별 체크 1 */}
                <input
                    className="checkOne"
                    type="checkbox"
                    name="one"
                    checked={checks.one}
                    onChange={handleItemChange}
                />
                <p className="oneOK">[필수] 이용 약관 동의</p>

                {/* 개별 체크 2 */}
                <input
                    className="checkTwo"
                    type="checkbox"
                    name="two"
                    checked={checks.two}
                    onChange={handleItemChange}
                />
                <p className="twoOK">[필수] 개인정보 처리 방침 동의</p>

                {/* 개별 체크 3 */}
                <input
                    className="checkThree"
                    type="checkbox"
                    name="three"
                    checked={checks.three}
                    onChange={handleItemChange}
                />
                <p className="threeOK">[선택] 마케팅 정보 수신 동의</p>

                <button className="signinBtn">회원가입</button>

                <p className="yesAccount">
                    이미 계정이 있으신가요?
                    <span className="logIn" onClick={goToLoginPage}>
                        로그인
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Signin;

import "./SigninPage.css";
import Navigator from "../../components/Navigator/Navigator";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiFetch } from '../../utils/api';

function Signin() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

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

    const [formData, setFormData] = useState({
        mem_name: "",
        mem_nn: "",
        mem_email: "",
        mem_pwd: "",
    });

    // input 변경 시
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

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
        const newChecks = { ...checks, [name]: checked };
        setChecks(newChecks);

        const all = Object.values(newChecks).every((v) => v === true);
        setAllChecked(all);
    };

    // 회원가입 POST 요청
    const handleSignIn = async () => {
        // 필수 체크
        if (!formData.mem_name || !formData.mem_email || !formData.mem_pwd) {
            alert("필수 항목을 모두 입력해주세요.");
            return;
        }

        if (!formData.mem_email.trim().includes("@")) {
            alert("이메일 형식을 지켜주세요. (@ 포함)");
            return;
        }

        if (!checks.one || !checks.two) {
            alert("필수 약관에 동의해주세요.");
            return;
        }

        try {
            const signUpUrl = `${import.meta.env.VITE_POSTS_URL}/member`;
            const data = await apiFetch(signUpUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });


            if (data.code === "COMMON200") {
                alert("회원가입 성공! 로그인 페이지로 이동합니다.");
                navigate("/login");
            } else if (data.code === "DUPLICATED_EMAIL402") {
                alert("이미 사용 중인 이메일입니다.");
            } else if (data.code === "DUPLICATED_NICKNAME403") {
                alert("이미 사용 중인 닉네임입니다.");
            } else {
                alert(data.message || "회원가입에 실패했습니다.");
            }
        } catch (error) {
            alert("회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            console.error(error);
        }
    };


    return (
        <div className="signin-page-container">
            <Navigator />

            <div className="box2">
                <p className="title">회원가입</p>

                <p className="name">
                    이름<span className="star">*</span>
                </p>
                <input
                    className="write"
                    type="text"
                    placeholder="홍길동"
                    name="mem_name"
                    value={formData.mem_name}
                    onChange={handleInputChange}
                />

                <p className="name">닉네임</p>
                <input
                    className="write"
                    type="text"
                    placeholder="회원33"
                    name="mem_nn"
                    value={formData.mem_nn}
                    onChange={handleInputChange}
                />

                <p className="name">
                    이메일<span className="star">*</span>
                </p>
                <input
                    className="write"
                    type="email"
                    placeholder="abc@gmail.com"
                    name="mem_email"
                    value={formData.mem_email}
                    onChange={handleInputChange}
                />

                <p className="name">
                    비밀번호<span className="star">*</span>
                </p>
                <input
                    className="write"
                    type="password"
                    placeholder="******"
                    name="mem_pwd"
                    autoComplete="new-password"
                    value={formData.mem_pwd}
                    onChange={handleInputChange}
                />

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

                {errorMessage && <p className="error">{errorMessage}</p>}

                <button className="signinBtn" onClick={handleSignIn}>
                    회원가입
                </button>

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

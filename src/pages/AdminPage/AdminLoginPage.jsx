import "./AdminLoginPage.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

function AdminLoginPage() {
    const { isAuthenticated, isLoading } = useAuth();    
        if (!isAuthenticated) {
        // 로그인 안 됐으면 로그인 페이지로 이동
            navigate("/login", { replace: true, state: { from: "/admin/login" } });
        }

    const navigate = useNavigate();
    const { admin_login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [adminKey, setAdminKey] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // 관리자 로그인 요청
    const handleLogin = async () => {
        try {
            const res = await admin_login(email, password, adminKey);

            console.log("Admin Login Response:", res);

            if (res.code === "COMMON200") {
                alert("관리자 로그인 성공!");
                navigate("/admin");
            } else {
                setErrorMessage(res.message || "로그인 실패");
            }

        } catch (error) {
            console.error("로그인 오류:", error);
            setErrorMessage("서버 오류가 발생했습니다.");
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-box">

                <h1 className="admin-title">ADMIN LOGIN</h1>
                <p className="admin-sub">Management System Access</p>

                <div className="admin-form-group">
                    <label>ID</label>
                    <input
                        type="text"
                        className="admin-input"
                        placeholder="관리자 ID 입력"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="admin-form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        className="admin-input"
                        placeholder="비밀번호 입력"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="admin-form-group">
                    <label>고유 KEY</label>
                    <input
                        type="text"
                        className="admin-input"
                        placeholder="고유 KEY 입력"
                        value={adminKey}
                        onChange={(e) => setAdminKey(e.target.value)}
                    />
                </div>

                {errorMessage && (
                    <p className="admin-error">{errorMessage}</p>
                )}

                <button className="admin-login-btn" onClick={handleLogin}>
                    로그인
                </button>

                <p className="admin-warn">※ 허가된 관리자만 접근 가능합니다.</p>

            </div>
        </div>
    );
}

export default AdminLoginPage;

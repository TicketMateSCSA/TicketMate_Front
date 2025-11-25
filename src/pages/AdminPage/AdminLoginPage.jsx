import "./AdminLoginPage.css";
import Navigator from "../../components/Navigator/Navigator";

function AdminLoginPage(){
    return (
        <div class="admin-login-container">
            <div class="admin-box">

                <h1 class="admin-title">ADMIN LOGIN</h1>
                <p class="admin-sub">Management System Access</p>

                <div class="admin-form-group">
                    <label>ID</label>
                    <input type="text" class="admin-input" placeholder="관리자 ID 입력"/>
                </div>

                <div class="admin-form-group">
                    <label>Password</label>
                    <input type="password" class="admin-input" placeholder="비밀번호 입력"/>
                </div>

                <div class="admin-form-group">
                    <label>고유 KEY</label>
                    <input type="text" class="admin-input" placeholder="고유 KEY 입력"/>
                </div>

                <button class="admin-login-btn">로그인</button>

                <p class="admin-warn">※ 허가된 관리자만 접근 가능합니다.</p>

            </div>
        </div>
    )
}

export default AdminLoginPage;
import "./AdminLoginPage.css";
import Navigator from "../../components/Navigator/Navigator";

function AdminLoginPage(){
    return (
        <div className='detail-page-container'>
            <button onClick={() => window.history.back()}>뒤로가기</button>
            <h1>Admin Login Page</h1>
        </div>
    )
}

export default AdminLoginPage;
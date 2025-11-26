import "./AdminPage.css";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api";

function AdminPage() {
    const {  isAuthenticated, userProfile, login, logout, adminProfile } = useAuth();
    const [memberList, setMemberList] = useState([]);

    // 회원 목록 가져오기
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const url = `${import.meta.env.VITE_POSTS_URL}/admin/members`;
                const res = await apiFetch(url, { method: "GET" });

                if (res.code === "COMMON200") {
                    // 데이터가 많지 않으므로 임시로 5개만 표시
                    setMemberList(res.result.slice(0, 5)); 
                } else {
                    console.error("회원 데이터 로드 실패:", res.message);
                }
            } catch (error) {
                console.error("서버 오류:", error);
            }
        };

        fetchMembers();
    }, []);

    return (
        <div className='admin-page-container'>
            <header className="admin-header">
                <div className="profile-box">
                    <div className="profile-img"></div>
                    <div className="profile-info">
                        <div className="profile-name">{adminProfile?.mem_name}</div>
                        <div className="profile-email">{adminProfile?.mem_email}</div>
                        <div className="profile-role">
                            {adminProfile?.team_name} {adminProfile?.admin_rank}
                        </div>
                    </div>
                </div>

                <div className="status-box">
                    <div className="status-item">전체 회원: <span>1234</span></div>
                    <div className="status-item">블랙리스트 회원: <span>24</span></div>
                    <div className="status-item">전체 게시글: <span>2341</span></div>
                    <div className="status-item warning">미처리 신고: <span>31</span></div>
                    <div className="status-item">오늘 가입 회원: <span>12</span></div>
                </div>
            </header>

            <main>
                {/* 기존 게시글 테이블 유지 (이미지 데이터 반영) */}
                <section className="section-box">
                    <div className="section-title">게시글 관리</div>
                    
                    {/* 게시글 탭 및 검색 영역 추가 */}
                    <div className="tab-menu post-menu">
                        <div className="tab-group">
                            <div className="tab active">전체</div>
                            <div className="tab">신고된 글</div>
                            <div className="tab">삭제된 글</div>
                        </div>
                    </div>
                    
                    <table className="data-table">
                        <thead>
                            <tr className="table-header-row">
                                <th>번호</th>
                                <th>분류</th>
                                <th>제목</th>
                                <th>작성자</th>
                                <th>작성자 이메일</th>
                                <th>신고수</th>
                                <th>작성일</th>
                                <th>관리</th>
                                <th>처리일</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="data-row">
                                <td>(임시)156</td>
                                <td>(임시)뮤지컬</td>
                                <td>(임시)레미제라블 같이 보실 분?</td>
                                <td>(임시)미니언123</td>
                                <td>(임시)이메일</td>
                                <td>(임시)13</td>
                                <td>(임시)작성일</td>
                                <td>(임시)처리일</td>
                                <td className="btn-group">
                                    <button className="btn blue">상세</button>
                                    <button className="btn red">삭제</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="pagination">
                        {/* 페이지네이션 버튼 영역 추가 */}
                    </div>
                </section>

                {/* 회원 관리 테이블 */}
                {/* ------- 회원 관리 섹션 수정 ------- */}
                <section className="section-box">
                    <div className="section-title">회원 관리</div>

                    <div className="tab-menu member-menu">
                        <div className="tab-group">
                            <div className="tab active">전체</div>
                            <div className="tab">블랙리스트</div>
                        </div>
                    </div>

                    <table className="data-table">
                        <thead>
                            <tr className="table-header-row">
                                <th>번호</th>
                                <th>닉네임</th>
                                <th>이메일</th>
                                <th>신고수</th>
                                <th>블랙 여부</th>
                                <th>사유</th>
                                <th>등록일</th>
                                <th>관리</th>
                                <th>처리일</th>
                            </tr>
                        </thead>

                        <tbody>
                            {memberList.length > 0 ? memberList.map((m, idx) => (
                                <tr className="data-row" key={m.m_rep_id}>
                                    <td>{m.m_rep_id}</td>
                                    <td>{m.mem_nn}</td>
                                    <td>{m.mem_email}</td>
                                    <td>-</td>
                                    <td>{m.mem_bl === 1 ? "O" : "X"}</td>
                                    <td>{m.m_rep_cont || "-"}</td>
                                    <td>{m.mem_created_at?.slice(0, 10) || "-"}</td>
                                    <td className="btn-group">
                                        <button className="btn blue">상세</button>
                                        {m.mem_bl === 1 ? (
                                            <button className="btn green">해제</button>
                                        ) : (
                                            <button className="btn red">추가</button>
                                        )}
                                    </td>
                                    <td>
                                        신고일
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: "center" }}>
                                        회원 정보가 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="pagination"></div>

                    <div className="blacklist-add-box">
                        <input type="text" placeholder="회원 닉네임 또는 이메일" />
                        <input type="text" placeholder="사유" />
                        <button className="btn btn-search red-bg">블랙리스트 추가</button>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default AdminPage;
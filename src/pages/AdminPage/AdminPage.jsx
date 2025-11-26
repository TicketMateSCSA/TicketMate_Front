import React from "react"; // 함수형 컴포넌트용 React 임포트 추가 (필요시)
import "./AdminPage.css";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api";

function AdminPage() {
    const { isAuthenticated, userProfile, login, logout, adminProfile } = useAuth();
    const [memberList, setMemberList] = useState([]);

    // 회원 목록 가져오기
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const url = `${import.meta.env.VITE_POSTS_URL}/admin/members`;
                const res = await apiFetch(url, { method: "GET" });

                if (res.code === "COMMON200") {
                    setMemberList(res.result.slice(0, 5));
                    console.log("회원 데이터 로드 성공:", res.result);
                } else {
                    console.error("회원 데이터 로드 실패:", res.message);
                }
            } catch (error) {
                console.error("서버 오류:", error);
            }
        };

        fetchMembers();
    }, []);

    // 블랙리스트 상태 토글 함수 (추가 / 해제)
    const toggleBlacklistStatus = async (m_rep_id, currentStatus) => {
        // 현재 상태에 따라 메시지 변경
        const message =
            currentStatus === 1
                ? "블랙리스트를 해제하시겠습니까?"
                : "블랙리스트로 추가하시겠습니까?";

        const confirmed = window.confirm(message);
        if (!confirmed) return; // 취소하면 종료
        
        try {
            const url = `${import.meta.env.VITE_POSTS_URL}/admin/report/${m_rep_id}/status`;
            // 현재 상태를 토글: 0 -> 1, 1 -> 0
            const newStatus = currentStatus === 1 ? 0 : 1;

            const res = await apiFetch(url, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ mem_bl: newStatus }), // 서버 API 스펙에 맞춰 요청 바디 조정 필요
            });

            if (res.code === "COMMON200") {
                // 상태 변경 성공 시 UI 반영
                setMemberList((prevList) =>
                    prevList.map((member) =>
                        member.m_rep_id === m_rep_id
                            ? { ...member, mem_bl: newStatus }
                            : member
                    )
                );
            } else {
                console.error("상태 변경 실패:", res.message);
                alert("상태 변경에 실패했습니다.");
            }
        } catch (error) {
            console.error("서버 오류:", error);
            alert("서버 오류가 발생했습니다.");
        }
    };

    return (
        <div className="admin-page-container">
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
                                <th>회원가입일</th>
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
                                    <td>{m.report_cnt || "-"}</td>
                                    <td>{m.mem_bl === 1 ? "O" : "X"}</td>
                                    <td>{m.m_rep_cont || "-"}</td>
                                    <td>{m.mem_created_at?.slice(0, 10) || "-"}</td>
                                    <td className="btn-group">
                                        <button className="btn blue">상세</button>
                                        {m.mem_bl === 1 ? (
                                            <button
                                                className="btn green"
                                                onClick={() => toggleBlacklistStatus(m.m_rep_id, 1)}
                                            >
                                                해제
                                            </button>
                                        ) : (
                                            <button
                                                className="btn red"
                                                onClick={() => toggleBlacklistStatus(m.m_rep_id, 0)}
                                            >
                                                추가
                                            </button>
                                        )}
                                    </td>
                                    <td>신고일</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="9" style={{ textAlign: "center" }}>
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

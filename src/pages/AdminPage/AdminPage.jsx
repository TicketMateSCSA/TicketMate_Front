import React, { useEffect, useState } from "react";
import "./AdminPage.css";
import { useAuth } from "../../contexts/AuthContext";
import { apiFetch } from "../../utils/api";
import { useNavigate } from "react-router-dom";

function AdminPage() {
    const { adminProfile } = useAuth();
    const [memberList, setMemberList] = useState([]);
    const [postList, setPostList] = useState([]);

    // 회원 로딩 상태 관리
    const [loadingMap, setLoadingMap] = useState({});
    // 게시글 삭제 로딩 상태 관리
    const [postLoadingMap, setPostLoadingMap] = useState({});

    const navigate = useNavigate();
    const goToHomePage = () => navigate("/");

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const url = `${import.meta.env.VITE_POSTS_URL}/admin/members`;
                const res = await apiFetch(url, { method: "GET" });
                if (res.code === "COMMON200") {
                    setMemberList(res.result.slice(0, 5));
                }
            } catch (e) {
                console.error("회원 데이터 에러:", e);
            }
        };

        const fetchPosts = async () => {
            try {
                const url = `${import.meta.env.VITE_POSTS_URL}/admin/posts`;
                const res = await apiFetch(url, { method: "GET" });
                if (res.code === "COMMON200") {
                    setPostList(res.result.reportPostDTOList.slice(0, 5));
                }
            } catch (e) {
                console.error("게시글 데이터 에러:", e);
            }
        };

        fetchMembers();
        fetchPosts();
    }, []);

    // 블랙리스트 추가 / 해제 + 처리일 기록
    const toggleBlacklistStatus = async (m_rep_id, currentStatus) => {
        const confirmed = window.confirm(
            currentStatus === 1
                ? "블랙리스트를 해제하시겠습니까?"
                : "블랙리스트로 추가하시겠습니까?"
        );
        if (!confirmed) return;

        setLoadingMap(prev => ({ ...prev, [m_rep_id]: true }));

        try {
            const url = `${import.meta.env.VITE_POSTS_URL}/admin/report/${m_rep_id}/status`;
            const newStatus = currentStatus === 1 ? 0 : 1;

            const res = await apiFetch(url, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mem_bl: newStatus }),
            });

            if (res.code === "COMMON200") {
                const now = new Date().toISOString();
                setMemberList(prev =>
                    prev.map(m =>
                        m.m_rep_id === m_rep_id
                            ? { ...m, mem_bl: newStatus, processed_at: now }
                            : m
                    )
                );
            } else {
                alert("상태 변경 실패");
            }
        } catch (e) {
            console.error(e);
            alert("서버 오류 발생");
        } finally {
            setTimeout(() => {
                setLoadingMap(prev => ({ ...prev, [m_rep_id]: false }));
            }, 2000);
        }
    };

    // 게시글 삭제 처리 + 처리일 반영 + 로딩
    const deletePost = async (mate_post_id) => {
        const confirmed = window.confirm("정말 삭제하시겠습니까?");
        if (!confirmed) return;

        setPostLoadingMap(prev => ({ ...prev, [mate_post_id]: true }));

        try {
            const url = `${import.meta.env.VITE_POSTS_URL}/post/${mate_post_id}`;
            const res = await apiFetch(url, { method: "DELETE" });

            if (res.code === "COMMON200") {
                const now = new Date().toISOString();

                setPostList(prev =>
                    prev.map(p =>
                        p.mate_post_id === mate_post_id
                            ? { ...p, processed_at: now, deleted: true }
                            : p
                    )
                );
            } else {
                alert("삭제 실패");
            }
        } catch (e) {
            console.error(e);
            alert("서버 오류 발생");
        } finally {
            setTimeout(() => {
                setPostLoadingMap(prev => ({ ...prev, [mate_post_id]: false }));
            }, 2000);
        }
    };

    return (
        <div className="admin-page-container">
            <button className="btn btn-home" onClick={goToHomePage}>유저 화면으로 이동</button>

            <header className="admin-header">
                <div className="profile-box">
                    <div className="profile-img"></div>
                    <div className="profile-info">
                        <div className="profile-name">{adminProfile?.mem_name}</div>
                        <div className="profile-email">{adminProfile?.mem_email}</div>
                        <div className="profile-role">{adminProfile?.team_name} {adminProfile?.admin_rank}</div>
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

                {/* 게시글 관리 */}
                <section className="section-box">
                    <div className="section-title">게시글 관리</div>

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
                            {postList.length > 0 ? postList.map((p) => (
                                <tr className={`data-row ${p.deleted ? "deleted-row" : ""}`} key={p.mate_post_id}>
                                    <td>{p.mate_post_id}</td>
                                    <td>{p.cat_name}</td>
                                    <td>{p.mate_title}</td>
                                    <td>{p.mem_nn}</td>
                                    <td>{p.mem_email || "-"}</td>
                                    <td>{p.report_count}</td>
                                    <td>{p.mate_created_at?.slice(0, 10) || "-"}</td>
                                    <td className="btn-group">
                                        <button className="btn blue">상세</button>

                                        {!p.deleted && (
                                            postLoadingMap[p.mate_post_id]
                                                ? <span className="loading">로딩중...</span>
                                                : <button className="btn red" onClick={() => deletePost(p.mate_post_id)}>삭제</button>
                                        )}

                                        {p.deleted && <span className="deleted-text">삭제됨</span>}
                                    </td>
                                    <td>{p.processed_at?.slice(0, 10) || "-"}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="9" style={{ textAlign: "center" }}>게시글 정보가 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>

                {/* 회원 관리 */}
                <section className="section-box">
                    <div className="section-title">회원 관리</div>

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
                            {memberList.length > 0 ? memberList.map((m) => (
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

                                        {loadingMap[m.m_rep_id]
                                            ? <span className="loading">로딩중...</span>
                                            : m.mem_bl === 1
                                                ? <button className="btn green" onClick={() => toggleBlacklistStatus(m.m_rep_id, 1)}>해제</button>
                                                : <button className="btn red" onClick={() => toggleBlacklistStatus(m.m_rep_id, 0)}>추가</button>
                                        }
                                    </td>
                                    <td>{m.processed_at?.slice(0, 10) || "-"}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="9" style={{ textAlign: "center" }}>회원 정보가 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
}

export default AdminPage;

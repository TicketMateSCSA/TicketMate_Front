// src/components/Navigator/Navigator.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import Pagination from '../Pagination/Pagination';

import './Navigator.css';
import logo from '../../assets/images/logo.png';
import searchIcon from '../../assets/icons/searchIcon.png';
import noProfile from '../../assets/images/no-profile.png';
import noImage from '../../assets/images/no-image.png';

const searchURL = `${import.meta.env.VITE_POSTS_URL}/posts/search`;

function TransTime({ startDate }) {
    let slicedDate = "(계속)";
    if (startDate) {
        let dateNtime = startDate.split("T");
        let dateParts = dateNtime[0].split("-");
        let timeParts = dateNtime[1].split(":").slice(0, 2).join(":");
        slicedDate = `${dateParts[0]}년 ${dateParts[1]}월 ${dateParts[2]}일 ${timeParts}`;
    }
    return slicedDate;
}

function Navigator() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalPage, setTotalPage] = useState(1);
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const searchRef = useRef(null);
    const abortRef = useRef(null);

    const { isAuthenticated, userProfile, adminProfile, logout } = useAuth();
    const profile = userProfile || adminProfile; // 안전하게 프로필 선택

    // 페이지 이동 함수
    const goToHomePage = () => navigate("/");
    const goToHostPage = () => navigate("/host");
    const goToLoginPage = () => navigate("/login");
    const goToSigninPage = () => navigate("/signin");
    const goToSearchPage = () => navigate("/search");
    const goToMyPage = () => navigate("/myPage");
    const goToInfoPage = () => navigate("/info");

    // 로그아웃
    const handleLogout = () => {
        if (window.confirm("정말 로그아웃 하시겠습니까?")) {
            logout();
            navigate("/", { replace: true });
        }
    };

    // 검색 API
    useEffect(() => {
        if (query.trim() === "" || !open) {
            setData(null);
            setLoading(false);
            setError(null);
            return;
        }

        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `${searchURL}?keyword=${query}&page=${page}`,
                    { signal: controller.signal }
                );
                if (!response.ok) throw new Error("HTTP Error: " + response.status);

                const json = await response.json();
                setData(json);
                setTotalPage(json?.result?.totalPages || 1);
            } catch (err) {
                console.error("검색 API 오류:", err);

                // 404 포함 모든 실패 → 검색 결과 없음 처리
                setData({
                    result: {
                        postPreviewDTOList: []
                    }
                });
            }finally {
                setLoading(false);
            }
        };

        fetchData();
        return () => controller.abort();
    }, [query, page, open]);

    // 드롭다운 외 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (opt) => {
        setOpen(false);
        navigate(`/detail/${opt.mate_post_id}`);
        window.location.reload();
    };

    const handleKeyDown = (e) => {
        const currentList = data?.result?.postPreviewDTOList || [];
        if (e.key === "Enter" && currentList?.length > 0) handleSelect(currentList[0]);
    };

    const handleButton = () => {
        const currentList = data?.result?.postPreviewDTOList || [];
        if (currentList?.length > 0) handleSelect(currentList[0]);
    };

    const list = data?.result?.postPreviewDTOList ?? [];

    return (
        <nav>
            {/* 상단 로고 + 검색창 */}
            <div className="head" ref={searchRef}>
                <img src={logo} alt="logo" onClick={goToHomePage} />
                <input
                    type="text"
                    placeholder='공연, 메이트 검색'
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setPage(1); setOpen(true); }}
                    onFocus={() => setOpen(true)}
                    onKeyDown={handleKeyDown}
                />
                {open && <div className="dropdown-overlay" onClick={() => setOpen(false)}></div>}
                {open && !list && <ul className="dropdown-list2" style={{ color: "#999" }}>검색 결과 없음</ul>}
                {open && query.trim() !== "" && (
                    <ul className="dropdown-list2">
                        {loading && <li className="dropdown-item2 disabled">검색 중...</li>}
                        {error && <li className="dropdown-item2 disabled">검색 결과 없음</li>}
                        
                        {!loading && !error && (
                            <>
                                {list?.length === 0 ? (
                                    <li className="dropdown-item2 disabled">검색 결과 없음</li>
                                ) : (
                                    list?.map((opt, idx) => (
                                        <li key={idx} className="dropdown-item2" onClick={() => handleSelect(opt)}>
                                            <div className="dd-section">
                                                <img src={opt.perf_img_url ? opt.perf_img_url : noImage} alt="공연 이미지" />
                                                <div className="dd-box">
                                                    <p className="dd-title">{opt.mate_title}</p>
                                                    <p className="dd-body">
                                                        공연: {opt.perf_name}<br />
                                                        일시: <TransTime startDate={opt.mate_view_date} /><br />
                                                        장소: {opt.perf_loc}<br />
                                                        모집인원: {opt.mate_num_of_need} (현재 {opt.mate_num_of_confirmed}/{opt.mate_num_of_need})
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                )}
                                {list?.length > 0 && <Pagination page={page} setPage={setPage} totalPages={totalPage} />}
                            </>
                        )}
                    </ul>
                )}
                <button className="searchsearchbutton" onClick={handleButton}>
                    <img src={searchIcon} alt="search" />
                </button>
            </div>

            {/* 네비게이터 버튼 */}
            <div className="navi">
                <button className={location.pathname === "/" ? "home active" : "home"} onClick={goToHomePage}>홈</button>
                <button className={location.pathname === "/search" || location.pathname === "/detail" || location.pathname === "/regist" ? "search active" : "search"} onClick={goToSearchPage}>메이트 찾기</button>
                <button className={location.pathname === "/host" ? "host active" : "host"} onClick={goToHostPage}>메이트 모집하기</button>
                <button className={location.pathname === "/info" ? "info active" : "info"} onClick={goToInfoPage}>공연 정보</button>

                {isAuthenticated && profile ? (
                    <>
                        <button className={location.pathname === "/myPage" ? "user-nickname active" : "user-nickname"} onClick={goToMyPage}>
                            <img className="nav-myImg" src={profile.mem_img_url ? profile.mem_img_url : noProfile} alt="profile" />
                            <span className="nav-myNN">{profile.mem_nn ? profile.mem_nn : profile.mem_name} 님</span>
                        </button>
                        <button className="logout" onClick={handleLogout}>로그아웃</button>
                    </>
                ) : (
                    <>
                        <button className={location.pathname === "/login" ? "login active" : "login"} onClick={goToLoginPage}>로그인</button>
                        <button className={location.pathname === "/signin" ? "signin active" : "signin"} onClick={goToSigninPage}>회원가입</button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navigator;

import './Navigator.css';
import logo from '../../assets/images/logo.png';
import searchIcon from '../../assets/icons/searchIcon.png';
import noProfile from '../../assets/images/no-profile.png';
import noImage from '../../assets/images/no-image.png';

import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import Pagination from '../Pagination/Pagination';

const searchURL = `${import.meta.env.VITE_POSTS_URL}/posts/search`;

function TransTime({startDate}){
    let dateNtime = "";
    let slicedDate = "(계속)";

    if (startDate){
        dateNtime = startDate ? startDate.split("T") : [];
        dateNtime[0] = dateNtime[0].split("-").splice(0, 3);
        dateNtime[0] = dateNtime[0][0] + "년 " + dateNtime[0][1] + "월 " + dateNtime[0][2] + "일 "
        dateNtime[1] = dateNtime[1].split(":").slice(0, 2).join(":");
        slicedDate = dateNtime.slice(0, 2).join(" ");
    }

    return slicedDate;
}

function Navigator(){
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalPage, setTotalPage] = useState(1); // 페이지 개수
    const [page, setPage] = useState(1);

    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const searchRef = useRef(null);
    const { isAuthenticated, userProfile, logout } = useAuth();
    
    const abortRef = useRef(null);

    const goToHomePage = () => {
        navigate("/");
    }
    const goToHostPage = () => {
        navigate("/host");
    }
    const goToLoginPage = () => {
        navigate("/login");
    }
    const goToSigninPage = () => {
        navigate("/signin");
    }
    const goToSearchPage = () => {
        navigate("/search");
    }
    const goToMyPage = () => {
        navigate("/myPage");
    }

    

    // 로그아웃
    const handleLogout = () => {
        const confirmLogout = window.confirm("정말 로그아웃 하시겠습니까?");
        if (confirmLogout){
            logout();
            navigate(from, { replace: true });
        }
    };
    
    useEffect(() => {
        if (query.trim() === "" || !open) {
            setData(null);
            setLoading(false);
            setError(null);
            return;
        }

        // 🔥 이전 요청 취소
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

                if (!response.ok) {
                    throw new Error("HTTP Error: " + response.status);
                }

                const json = await response.json();
                setData(json);

                if (json.code === "MATEPOST401:_NO_POST_LIST") {
                    setTotalPage(1);
                    setPage(1);
                } else {
                    const tPage = json?.result?.totalPages || 1;
                    setTotalPage(tPage);
                }

            } catch (err) {
                if (err.name === "AbortError") return; 
                setError(err.message);
                setData(null);
            } finally {
                console.clear();
            }

            setLoading(false);
        };

        fetchData();

        return () => controller.abort();
    }, [query, page, open]);


    useEffect(() => {
        function handleClickOutside(event) {
            // 즉, 드롭다운 영역(searchRef로 지정된 요소)을 벗어난 곳을 클릭했을 때
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setOpen(false); // 드롭다운 닫기
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setOpen]);

    const handleSelect = (opt) => {
        setOpen(false);
        navigate(`/detail/${opt.mate_post_id}`)
        window.location.reload();
    }

    const handleKeyDown = (e) => {
        const currentList = data?.result?.postPreviewDTOList; // 최신 list를 가져옴
        if (e.key === "Enter" && currentList?.length > 0) {
            handleSelect(currentList[0]);
        }
    }

    const handleButton = () => {
        const currentList = data?.result?.postPreviewDTOList; // 최신 list를 가져옴
        if (currentList?.length > 0) {
            handleSelect(currentList[0]);
        }
    }

    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error: {error}</p>;
    
    const list = data?.result?.postPreviewDTOList;
    

    return (
        <nav>
            {/* 1. 좌상단 로고, 우상단 검색창 */}
            <div className="head" ref={searchRef}>
                <img src={logo} onClick={goToHomePage}></img>
                <input type="text" 
                    placeholder='공연, 메이트 검색'
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setPage(1);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    onKeyDown={handleKeyDown}
                    ></input>
                {/* 오버레이 */}
                {open && (
                    <div className="dropdown-overlay" onClick={() => setOpen(false)}></div>
                )}
                
                {open && !list && (
                    <ul className="dropdown-list2" style={{color:"#999"}}>
                        검색 결과 없음
                    </ul>
                )}
                {open && query.trim() !== "" && (
                    <ul className="dropdown-list2" >
                        {/* 로딩 중일 때 */}
                        {loading && <li className="dropdown-item2 disabled">검색 중...</li>}

                        {/* 에러 발생 시 */}
                        {error && <li className="dropdown-item2 disabled">검색 결과 없음</li>}

                        {/* 로딩/에러가 아닐 때 */}
                        {!loading && !error && (
                            <>
                                {/* 3-1. API 호출은 성공했으나, 검색 결과가 없는 경우 처리 */}
                                {list?.length === 0 || data?.code === "MATEPOST401:_NO_POST_LIST" ? (
                                    <li className="dropdown-item2 disabled">검색 결과 없음</li>
                                ) : (
                                    // 정상적인 결과 목록
                                    list?.map((opt, idx) => (
                                        <li
                                            key={idx}
                                            className="dropdown-item2"
                                            onClick={() => handleSelect(opt)}
                                        >
                                            {/* 검색 결과 표시 로직... */}
                                            <div className="dd-section">
                                                <img src={opt.perf_img_url? opt.perf_img_url: noImage} alt="공연 이미지"/>
                                                <div className="dd-box">
                                                    <p className="dd-title">{opt.mate_title}</p>
                                                    <p className="dd-body">
                                                        공연: {opt.perf_name}<br/>
                                                        일시: {<TransTime startDate={opt.mate_view_date}/>}<br/>
                                                        장소: {opt.perf_loc}<br/>
                                                        모집인원: {opt.mate_num_of_need} (현재 {opt.mate_num_of_confirmed}/{opt.mate_num_of_need})
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                )}

                                {/* 페이지네이션은 검색 결과가 있을 때만 표시 */}
                                {list?.length > 0 && (
                                    <Pagination page={page} setPage={setPage} totalPages={totalPage}/>
                                )}
                            </>
                        )}
                    </ul>
                )}

                <button className="searchsearchbutton" onClick={handleButton}>
                    <img src={searchIcon}></img>
                </button>
            </div>

            {/* 2. 네비게이터 */}
            <div className="navi">
            <button className={location.pathname === "/" ? "home active" : "home"} onClick={goToHomePage}>홈</button>
            <button className={location.pathname === "/search" || location.pathname === "/detail" || location.pathname == "/regist" ? "search active" : "search"} onClick={goToSearchPage}>메이트 찾기</button>
            <button className={location.pathname === "/host" ? "host active" : "host"} onClick={goToHostPage}>메이트 모집하기</button>
            <button className="info">공연 정보</button>

            {isAuthenticated ? (
                <>  
                    <button className={location.pathname === "/myPage" ? "user-nickname active" : "user-nickname"} onClick={goToMyPage}>
                        <img className="nav-myImg" src={userProfile.mem_img_url? userProfile.mem_img_url : noProfile} alt="profile" />
                        <span className="nav-myNN">{userProfile?.mem_nn? userProfile.mem_nn: userProfile.mem_name} 님</span>
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
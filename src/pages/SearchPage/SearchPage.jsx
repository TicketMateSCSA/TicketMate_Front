import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // 1. Axios import 추가

import "./SearchPage.css";
import Navigator from "../../components/Navigator/Navigator";
import Pagination from "../../components/Pagination/Pagination";

import noImage from '../../assets/images/no-image.png';
import noProfile from '../../assets/images/no-profile.png';

const filterUrl = `${import.meta.env.VITE_POSTS_URL}/posts/filter`;
const catUrl = `${import.meta.env.VITE_POSTS_URL}/categories`;

const stateMapRev = {0: "전체", 1: "모집중", 2: "모집완료"};
const ageMapRev = {2: '10대', 4: '20대', 8: '30대', 16: '40대', 32: '50대+'}
const genderMapRev = {0: '무관', 1: '남성', 2: '여성'}

function DecodeAgeMask({mask}) {
  const result = [];

  for (const [bit, label] of Object.entries(ageMapRev)) {
    const bitValue = Number(bit);

    if (mask & bitValue) {
      result.push(label);
    }
  }

  return result.join(" ");
}
{/* <DecodeAgeMask mask= {item.mem_age_range}/> */}

function SearchSection({item}){
    const navigate = useNavigate();

    const tags = item.mate_hashtag ? item.mate_hashtag.split(" ") : [];
    const slicedTag = tags.slice(0, 5);

    const dateNtime = item.mate_view_date ? item.mate_view_date.split("T") : [];
    dateNtime[0] = dateNtime[0].split("-").splice(0, 3);
    dateNtime[0] = dateNtime[0][0] + "년 " + dateNtime[0][1] + "월 " + dateNtime[0][2] + "일 "
    dateNtime[1] = dateNtime[1].split(":").slice(0, 2).join(":");
    const slicedDate = dateNtime.slice(0, 2).join(" ");

    // 버튼 클릭
    const handleClick = async (item) => {
        navigate(`/detail/${item.mate_post_id}`);  
    }

    return (
        <div className="search-section-func" onClick={() => handleClick(item)}>
            <img className="search-section-img" 
                src={item.perf_img_url ? item.perf_img_url : noImage}
                alt={item.perf_name}/>

            <div className="search-section-content">
                <span className="search-section-category">{item.cat_name}</span>
                <span className="search-section-state"
                    style={
                        {backgroundColor: item.mate_status === 1 ? "#A1FFA6" : "#E0E0E0",
                        borderColor: item.mate_status === 1 ? "#40A646" : "#656565",
                        color: item.mate_status === 1? "#40A646" : "#656565"
                    }}>{stateMapRev[item.mate_status]}</span>
                <p className="search-section-title">{item.mate_title}</p>
                
                <p className="search-section-body1">
                    공연: {item.perf_name}<br/>
                    일시: {slicedDate}
                    <span className="search-section-accountInfo">
                    <img src={item.mem_img_url ? item.mem_img_url : noProfile}/>
                    <span>{item.mem_nn ? item.mem_nn : item.mem_name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ageMapRev[item.mem_age_range]} {genderMapRev[item.mem_gender]}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;조회 {item.mate_view_cnt}</span>
                </span>
                    </p>
                    
                <p className="search-section-body2">
                    장소: {item.perf_loc}<br/>
                    모집 인원: {item.mate_num_of_need} (현재 {item.mate_num_of_confirmed}/{item.mate_num_of_need})</p>
                
                <div className="search-tag-container">
                    {slicedTag.map((tag, idx) => (
                    <span className="search-section-tag" key={idx}>{tag}</span>
                    )) }
                </div>
                
            </div>
        </div>
    )
}



function Search(){
    const [dataList, setDataList] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState(["전체"]);
    const [selectedState, setSelectedState] = useState("전체");
    const [selectedAge, setSelectedAge] = useState(["전체"]);
    const [selectedGender, setSelectedGender] = useState("무관");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedSort, setSelectedSort] = useState("최신순");
    const [page, setPage] = useState(1);

    const today = new Date().toISOString().split("T")[0];

    // 카테고리 목록 상태를 별도로 관리
    const [categoryList, setCategoryList] = useState([]); // catList를 대체
    const [totalPostCount, setTotalPostCount] = useState(0); // 전체 게시글 수 (페이지네이션용)
    const [totalPage, setTotalPage] = useState(1); // 페이지 개수
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // 1. 초기 카테고리 데이터 Fetch
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(catUrl);
                setCategoryList(response.data?.result?.getCategoryDTOList || []);
                setLoading(false);
            } catch (error) {
                // 카테고리 로딩 실패는 Critical하지 않으므로, console.error만 하고 UI는 로딩 완료로 표시
                // console.error("카테고리 로딩 실패:", error);
                setError("카테고리 목록을 불러오지 못했습니다.");
                setLoading(false);
            } finally{
                console.clear();
            }
        };
        fetchCategories();
    }, []);


    // [백]
    const buildQuery = useCallback(() => {
        const params = new URLSearchParams();

        // 카테고리 ID 매핑 생성
        const categoryMap = {"전체": 0};
        categoryList.forEach(item => {
            categoryMap[item.cat_name] = item.cat_id;
        });

        selectedCategories.forEach(cat => {
            const catId = categoryMap[cat];
            if (catId != 0) params.append("cat_id", catId);
        });

        // 모집 상태
        const stateMap = { "전체": 0, "모집중": 1, "모집완료": 2 };
        params.append("mate_status", stateMap[selectedState] || 0);

        // 연령대
        const ageMap = { "전체": 1 << 0, "10대": 1 << 1, "20대": 1 << 2, "30대": 1 << 3, "40대": 1 << 4, "50대+": 1 << 5 };
        let ageBit = 0;
        // "전체"가 선택되지 않은 경우에만 비트 연산 수행
        if (!selectedAge.includes("전체")) {
            selectedAge.forEach(age => {
                ageBit |= ageMap[age] || 0;
            });
        } else {
            ageBit = 1 << 0; // "전체"에 해당하는 비트 값 (코드에 따라 0일 수도 있음)
        }
        params.append("mate_pref_age", ageBit);

        // 성별
        const genderMap = { "무관": 0, "남성": 1, "여성": 2 };
        params.append("mate_gender", genderMap[selectedGender] || 0);

        // 날짜
        if (startDate) params.append("perf_sat", startDate+"T00:00:00");
        else params.append("perf_sat", today+"T00:00:00");
        if (endDate) params.append("perf_eat", endDate+"T00:00:00");
        
        // 정렬
        const sortMap = { "최신순": "latest", "마감임박순": "deadline", "인기순": "popular", "조회순": "views" };
        params.append("sort", sortMap[selectedSort] || "latest");

        // 페이지
        params.append("page", page);
        // console.log(params.toString());
        return params.toString();
    }, [page, selectedCategories, selectedState, selectedAge, selectedGender, startDate, endDate, selectedSort, categoryList]);

    
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        const queryString = buildQuery();

        try {
            const url = `${filterUrl}?${queryString}`
            const response = await axios.get(url); 
            
            const data = response.data;
            // console.log(data);
            const list = data?.result?.postPreviewDTOList || []; 
            
            const totalCount = data?.result?.totalElements;
            setTotalPostCount(totalCount || 0); 
            const tPage = data?.result?.totalPages;
            setTotalPage(tPage || 1);
            
            setDataList(list);
            setLoading(false);
        } catch (err) {
            if (err.response) {
                if (err.response.status === 404 || err.response.status === 401) {
                    // console.warn(`HTTP ${err.response.status} 응답 수신: 데이터 없음 또는 권한 부족으로 처리.`);
                    
                    setDataList([]); 
                    setTotalPostCount(0); 
                    setTotalPage(1); 
                } else {
                    // console.error("서버 응답 오류:", err.response.data);
                    setError(err.response.data?.message || `HTTP Error: ${err.response.status}`);
                    setDataList([]); 
                }
            } else {
                // console.error("네트워크 또는 요청 설정 오류:", err.message);
                setError(err.message);
                setDataList([]); 
            }
            setLoading(false);
        } finally{
            
            console.clear();
        }
    }, [buildQuery]);

    useEffect(() => {
    if (categoryList.length > 0) {
        fetchData();
    }
    }, [fetchData, categoryList]); // 카테고리 불러와진 후 실행되도록

    const handleChangeCategories = (event) => {
        const { value, checked } = event.target;
        if (value === "전체") {             
            setSelectedCategories(["전체"]);
        } else {
            if (checked) {
                setSelectedCategories([...selectedCategories.filter(c => c !== "전체"), value]);
            } else {
                const newSelected = selectedCategories.filter((c) => c !== value);
                setSelectedCategories(newSelected.length === 0 ? ["전체"] : newSelected);
            }
        }
        
    };

    const handleChangeState = (event) => {
        setSelectedState(event.target.value);
    };

    const handleChangeAge = (event) => {
        const { value, checked } = event.target;

        if (value === "전체") {
            setSelectedAge(["전체"]);
        } else {
            if (checked) {
                setSelectedAge([...selectedAge.filter(c => c !== "전체"), value]);
            } else {
                const newSelected = selectedAge.filter((c) => c !== value);
                setSelectedAge(newSelected.length === 0 ? ["전체"] : newSelected);
            }
        }
    };


     const handleChangeGender = (event) => {
        setSelectedGender(event.target.value);
    };

    const handleStartDate = (e) => {
        const value = e.target.value;
        setStartDate(value);
        setEndDate("");
    };

    const handleEndDate = (e) => {
        const value = e.target.value;
        setEndDate(value);
    };

    const handleChangeSort = (event) => {
        setSelectedSort(event.target.value);
    };

    // 로딩 및 에러 메시지
    const LoadingSpinner = () => (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
          <p className="ml-4 text-lg text-indigo-600">목록을 불러오는 중...</p>
        </div>
      );

    if (loading) return <LoadingSpinner />;

    return (
        <div className="search-page-container">
            <Navigator/>
            
            {/* 1. 헤더 */}
            <div className='header'>
                <p className="head">메이트 찾기</p>
                <p className="body">함께 공연을 즐길 메이트를 찾아보세요!</p>
            </div>

            {/* 2. 카테고리 */}
            <div className="search-box search-category">
                <p className="search-category">카테고리</p>
                <div className="search-btn-group category-btn">

                    <div key="all-category"> 
                        <input type="checkbox" id="search-category-btn1" value="전체"
                            checked={selectedCategories.includes("전체")}
                            onChange={handleChangeCategories}
                            // defaultChecked
                        />
                        <label htmlFor="search-category-btn1">{"전체"}</label>
                    </div>

                    {/* 고유한 key (cat_id) 사용 권장 */}
                    {categoryList.map((item) => (
                        <div key={item.cat_id || item.cat_name}> 
                            <input
                                type="checkbox"
                                id={`search-category-btn-${item.cat_id}`}
                                value={item.cat_name}
                                checked={selectedCategories.includes(item.cat_name)}
                                onChange={handleChangeCategories}
                            />
                            <label htmlFor={`search-category-btn-${item.cat_id}`}>{item.cat_name}</label>
                        </div>
                    ))}
        
                </div>
            </div>

            {/* 3. 선호 사항 */}
            <div className="search-box search-prefer">

                {/* 3-1. 모집상태 */}
                <p className="search-state">모집상태</p>
                <div className="search-btn-group">
                    <input
                        type="radio" id="search-btn1" name="state" value="전체"
                        checked={selectedState === "전체"}
                        onChange={handleChangeState}
                    />
                    <label htmlFor="search-btn1">전체</label>

                    <input
                        type="radio" id="search-btn2" name="state" value="모집중"
                        checked={selectedState === "모집중"}
                        onChange={handleChangeState}
                    />
                    <label htmlFor="search-btn2">모집중</label>

                    <input
                        type="radio" id="search-btn3" name="state" value="모집완료"
                        checked={selectedState === "모집완료"}
                        onChange={handleChangeState}
                    />
                    <label htmlFor="search-btn3">모집완료</label>
                </div>
                

                {/* 3-2. 연령대 */}
                <p className="search-age">연령대</p>
                <div className="search-btn-group age-btn">
                    <input type="checkbox" id="search-age-btn1" value="전체"
                        checked={selectedAge.includes("전체")}
                        onChange={handleChangeAge}
                    />
                    <label htmlFor="search-age-btn1">{"전체"}</label>

                    <input type="checkbox" id="search-age-btn2" value="10대"
                        checked={selectedAge.includes("10대")}
                        onChange={handleChangeAge}
                    />
                    <label htmlFor="search-age-btn2">{"10대"}</label>

                    <input type="checkbox" id="search-age-btn3" value="20대"
                        checked={selectedAge.includes("20대")}
                        onChange={handleChangeAge}
                    />
                    <label htmlFor="search-age-btn3">{"20대"}</label>

                    <input type="checkbox" id="search-age-btn4" value="30대"
                        checked={selectedAge.includes("30대")}
                        onChange={handleChangeAge}
                    />
                    <label htmlFor="search-age-btn4">{"30대"}</label>

                    <input type="checkbox" id="search-age-btn5" value="40대"
                        checked={selectedAge.includes("40대")}
                        onChange={handleChangeAge}
                    />
                    <label htmlFor="search-age-btn5">{"40대"}</label>

                    <input type="checkbox" id="search-age-btn6" value="50대+"
                        checked={selectedAge.includes("50대+")}
                        onChange={handleChangeAge}
                    />
                    <label htmlFor="search-age-btn6">{"50대+"}</label>
                    </div>                    

                {/* 3-3. 공연 날짜 */}
                <p className="search-per-date">공연날짜</p>
                <input
                    className="search-start-date" type="date" value={startDate}
                    min={today}          // 오늘 이전은 선택 불가
                    onChange={handleStartDate}
                    placeholder={today}
                />
                <span className="search-bla">~</span>


                <input
                    className="search-end-date" type="date" value={endDate}
                    min={startDate}      // 종료일은 시작일 이전 불가
                    onChange={handleEndDate}
                />

                {/* 3-4. 성별 */}
                <p className="search-gender">성별</p>
                <div className="search-btn-group gender-btn">
                    <input
                        type="radio" id="search-gender-btn1" name="gender" value="무관"
                        checked={selectedGender === "무관"}
                        onChange={handleChangeGender}
                    />
                    <label htmlFor="search-gender-btn1">무관</label>

                    <input
                        type="radio" id="search-gender-btn2" name="gender" value="남성"
                        checked={selectedGender === "남성"}
                        onChange={handleChangeGender}
                    />
                    <label htmlFor="search-gender-btn2">남성</label>

                    <input
                        type="radio" id="search-gender-btn3" name="gender" value="여성"
                        checked={selectedGender === "여성"}
                        onChange={handleChangeGender}
                    />
                    <label htmlFor="search-gender-btn3">여성</label>
                </div>
            </div>

            {/* 4. 정렬 조건 */}
            <div className="search-btn-group sort-btn">
                <input
                    type="radio" id="search-sort-btn1" name="sort" value="최신순"
                    checked={selectedSort === "최신순"}
                    onChange={handleChangeSort}
                />
                <label htmlFor="search-sort-btn1">최신순</label>

                <input
                    type="radio" id="search-sort-btn2" name="sort" value="마감임박순"
                    checked={selectedSort === "마감임박순"}
                    onChange={handleChangeSort}
                />
                <label htmlFor="search-sort-btn2">마감임박순</label>

                <input
                    type="radio" id="search-sort-btn3" name="sort" value="인기순"
                    checked={selectedSort === "인기순"}
                    onChange={handleChangeSort}
                />
                <label htmlFor="search-sort-btn3">인기순</label>

                <input
                    type="radio" id="search-sort-btn4" name="sort" value="조회순"
                    checked={selectedSort === "조회순"}
                    onChange={handleChangeSort}
                />
                <label htmlFor="search-sort-btn4">조회순</label>
            </div>

            {/* 5. 목록 */}
            
            <p className="search-content-length">총 {totalPostCount? totalPostCount:0}개의 메이트 모집글</p>
            {loading ? (
                <p>목록을 불러오는 중...</p>
            ) : error ? (                
                <p>목록을 불러오는 데 오류가 발생했습니다: {error.message || error}</p>
            ) : (                
                <div className="search-whole-content">
                    {dataList.length > 0 ? (
                        dataList.map((item, idx) => (
                            <SearchSection key={`swc${idx}`} item={item} />
                        ))
                    ) : (
                        <p className="swc-error">검색 조건에 맞는 결과가 없습니다.</p>
                    )}

                    {/* 6. 페이지 */}
                    <div className="search-paging">
                        <Pagination page={page} setPage={setPage} totalPages={totalPage} />
                    </div>
                </div>
            )}
    
        </div>

    )
}

export default Search;

import { useState, useEffect, useCallback } from "react";
import format from "date-format";

import "./SearchPage.css";
import Navigator from "../../components/Navigator/Navigator";
import Pagination from "../../components/Pagination/Pagination";

import noImage from '../../assets/images/no-image.png';
import noProfile from '../../assets/images/no-profile.png';

const filterUrl = `${import.meta.env.VITE_POSTS_URL}/posts`;
const catUrl = `${import.meta.env.VITE_POSTS_URL}/categories`;

const stateMapRev = {0: "전체", 1: "모집중", 2: "모집완료"};
const ageMapRev = {0: '10대', 1: '20대', 2: '30대', 3: '40대', 4: '50대+'}
const genderMapRev = {0: '무관', 1: '남성', 2: '여성'}

function SearchSection({item}){
    const tags = item.mate_hashtag ? item.mate_hashtag.split(" ") : [];
    const slicedTag = tags.slice(0, 5);

    const dateNtime = item.mate_view_date ? item.mate_view_date.split("T") : [];
    dateNtime[0] = dateNtime[0].split("-").splice(0, 3);
    dateNtime[0] = dateNtime[0][0] + "년 " + dateNtime[0][1] + "월 " + dateNtime[0][2] + "일 "
    dateNtime[1] = dateNtime[1].split(":").slice(0, 2).join(":");
    const slicedDate = dateNtime.slice(0, 2).join(" ");

    return (
        <div className="search-section-func">
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
                    <div className="search-section-accountInfo">
                    <img src={item.mem_img_url ? item.mem_img_url : noProfile}/>
                    <p>{item.mem_nn ? item.mem_nn : item.mem_name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ageMapRev[item.mem_age_range]} {genderMapRev[item.mem_gender]}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;조회 {item.mate_view_cnt}</p>
                </div>
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // 1. 초기 카테고리 데이터 Fetch (한 번만 실행)
    useEffect(() => {
        fetch(catUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                // 카테고리 데이터를 전역 상태가 아닌 컴포넌트 상태로 저장
                setCategoryList(data?.result?.getCategoryDTOList || []);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
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
            params.append("cat_id", catId);
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
        if (startDate) params.append("perf_sat", format("yyyy-MM-ddThh:MM:SS", new Date(startDate)));
        else params.append("perf_sat", format("yyyy-MM-ddThh:MM:SS", new Date(today)));
        if (endDate) params.append("perf_eat", format("yyyy-MM-ddThh:MM:SS", new Date(endDate)));
        console.log(typeof(format("yyyy-MM-ddThh:MM:SS", new Date(today))));
        
        // 정렬
        const sortMap = { "최신순": "latest", "마감임박순": "deadline", "인기순": "popular", "조회순": "views" };
        params.append("sort", sortMap[selectedSort] || "latest");

        // 페이지
        params.append("page", page);
        console.log(params.toString());
        return params.toString();
    }, [page, selectedCategories, selectedState, selectedAge, selectedGender, startDate, endDate, selectedSort, categoryList]);

    
    const fetchData = useCallback(async () => {
        setLoading(true); // 새 데이터 로딩 시작
        setError(null);
        const queryString = buildQuery();

        try {
            // filterUrl에 쿼리스트링 추가
            const url = `${filterUrl}?${queryString}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const list = data?.result?.postPreviewDTOList.slice(0, 4) || []; // 4개
            console.log(list);

            // TODO
            const totalCount = 40;
            setTotalPostCount(totalCount); 

            setDataList(list);
            setLoading(false);
        } catch (err) {
            console.error("데이터 fetching 오류:", err);
            setError(err.message);
            setDataList([]); // 오류 발생 시 목록 초기화
            setLoading(false);
        }
    }, [buildQuery]); // buildQuery가 변경될 때만 fetchData 재정의

    useEffect(() => {
        fetchData();
        // fetchData가 buildQuery를 의존하므로, buildQuery의 의존성(필터 조건들)이 변경되면
        // fetchData가 새로운 쿼리로 재요청하게 됩니다.
    }, [fetchData]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    // console.log(catList);

    const handleChangeCategories = (event) => {
        const { value, checked } = event.target;

        if (value === "전체") {
        if (checked) {
            // 전체 체크하면 나머지 해제
            setSelectedCategories(["전체"]);
        } else {
            setSelectedCategories([]);
        }
        } else {
        if (checked) {
            // 나머지 선택하면 전체 해제
            setSelectedCategories([...selectedCategories.filter(c => c !== "전체"), value]);
        } else {
            setSelectedCategories(selectedCategories.filter((c) => c !== value));
        }
        }
    };

    const handleChangeState = (event) => {
        setSelectedState(event.target.value);
    };

    const handleChangeAge = (event) => {
        const { value, checked } = event.target;

        if (value === "전체") {
        if (checked) {
            setSelectedAge(["전체"]);
        } else {
            setSelectedAge([]);
        }
        } else {
        if (checked) {
            setSelectedAge([...selectedAge.filter(c => c !== "전체"), value]);
        } else {
            setSelectedAge(selectedAge.filter((c) => c !== value));
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
                            defaultChecked
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
            <p className="search-content-length">총 {totalPostCount}개의 메이트 모집글</p>
            {loading ? (
                <p>목록을 불러오는 중...</p>
            ) : error ? (
                <p>목록을 불러오는 데 오류가 발생했습니다: {error}</p>
            ) : (
                <div className="search-whole-content">
                    {dataList.length > 0 ? (
                        dataList.map((item) => (
                            <SearchSection key={item.mate_id || item.mate_title} item={item} />
                        ))
                    ) : (
                        <p>검색 조건에 맞는 결과가 없습니다.</p>
                    )}
                    
                    {/* 6. 페이지 */}
                    <div className="search-paging">
                        {/* totalPages를 서버에서 받은 totalPostCount로 계산. 페이지당 4개라고 가정. */}
                        <Pagination page={page} setPage={setPage} totalPages={Math.ceil(totalPostCount / 4)} />
                    </div>
                </div>
            )}
    
        </div>

    )
}

export default Search;

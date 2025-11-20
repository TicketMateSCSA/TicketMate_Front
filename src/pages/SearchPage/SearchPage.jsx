import { useState, useEffect } from "react";

import "./SearchPage.css";
import Navigator from "../../components/Navigator/Navigator";
import Pagination from "../../components/Pagination/Pagination";



function SearchSection({item}){
    return (
        <div className="search-section-func">

        </div>
    )
}



function Search(){
    const [selectedCategories, setSelectedCategories] = useState(["전체"]);
    const [selectedState, setSelectedState] = useState("전체");
    const [selectedAge, setSelectedAge] = useState(["전체"]);
    const [selectedGender, setSelectedGender] = useState("무관");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedSort, setSelectedSort] = useState("최신순");
    const [page, setPage] = useState(1);

    // 오늘 날짜(YYYY-MM-DD)
    const today = new Date().toISOString().split("T")[0];

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

    // [백]
    const buildQuery = () => {
        const params = new URLSearchParams();

        // 카테고리
        const categoryMap = {"전체": 0, "콘서트": 1, "뮤지컬": 2, "연극": 3, "전시": 4, '기타': 5}
        selectedCategories.forEach(cat => {
            params.append("cat_id", categoryMap[cat] || 0);
        });
        
        // 모집 상태
        const stateMap = { "전체": 0, "모집중": 1, "모집완료": 2};
        params.append("mate_status", stateMap[selectedState] || 0);

        // 연령대
        const ageMap = {"전체": 1 << 0, "10대": 1 << 1, "20대": 1 << 2, "30대": 1 << 3, "40대": 1 << 4, "50대+": 1 << 5 };
        let ageBit = 0;
        selectedAge.forEach(age => {
            ageBit |= ageMap[age]; 
        })
        // console.log(ageBit);
        params.append("mate_pref_age", ageBit);

        // 성별
        const genderMap = { "무관": 0, "남성": 1, "여성": 2 };
        params.append("mate_gender", genderMap[selectedGender] || 0);

        // 날짜
        if (startDate) params.append("perf_sat", startDate);
        if (endDate) params.append("perf_eat", endDate);

        // 정렬
        const sortMap = { "최신순": "latest", "마감임박순": "deadline", "인기순": "popular", "조회순": "views"};
        params.append("sort", sortMap[selectedSort] || "latest");

        // 페이지
        params.append("page", page);

        return params.toString();
        };

    let dataLength;

    const fetchData = async () => {
        const queryString = buildQuery();
        // const filterUrl = `${import.meta.env.VITE_POSTS_URL}/posts/filter?${queryString}`;
        const filterUrl = `${import.meta.env.VITE_POSTS_URL}/posts`; // 테스트용

        try {
            const response = await fetch(filterUrl);
            const data = await response.json();
            dataLength = Math.ceil(data.length / 4);
            // console.log(data);
            // 필요하면 setData(data) 해서 화면에 렌더
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
        }, [page, selectedCategories, selectedState, selectedAge, selectedGender, startDate, endDate, selectedSort]);


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
                    <input type="checkbox" id="search-category-btn1" value="전체"
                        checked={selectedCategories.includes("전체")}
                        onChange={handleChangeCategories}
                    />
                    <label htmlFor="search-category-btn1">{"전체"}</label>
                    <input type="checkbox" id="search-category-btn2" value="콘서트"
                        checked={selectedCategories.includes("콘서트")}
                        onChange={handleChangeCategories}
                    />
                    <label htmlFor="search-category-btn2">{"콘서트"}</label>
                    <input type="checkbox" id="search-category-btn3" value="뮤지컬"
                        checked={selectedCategories.includes("뮤지컬")}
                        onChange={handleChangeCategories}
                    />
                    <label htmlFor="search-category-btn3">{"뮤지컬"}</label>
                    <input type="checkbox" id="search-category-btn4" value="연극"
                        checked={selectedCategories.includes("연극")}
                        onChange={handleChangeCategories}
                    />
                    <label htmlFor="search-category-btn4">{"연극"}</label>
                    <input type="checkbox" id="search-category-btn5" value="전시"
                        checked={selectedCategories.includes("전시")}
                        onChange={handleChangeCategories}
                    />
                    <label htmlFor="search-category-btn5">{"전시"}</label>
                    <input type="checkbox" id="search-category-btn6" value="기타"
                        checked={selectedCategories.includes("기타")}
                        onChange={handleChangeCategories}
                    />
                    <label htmlFor="search-category-btn6">{"기타"}</label>
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
            <div className="search-whole-content">
                <SearchSection/>
                <SearchSection/>
                <SearchSection/>
                <SearchSection/>

                {/* 6. 페이지 */}
                <div className="search-paging">
                    <Pagination page={page} setPage={setPage} totalPages={dataLength}/>
                </div>
            
            </div>
        </div>

    )
}

export default Search;

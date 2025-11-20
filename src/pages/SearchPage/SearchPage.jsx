import { useState } from "react";

import "./SearchPage.css";
import Navigator from "../../components/Navigator/Navigator";

function Search(){
    const [selectedCategories, setSelectedCategories] = useState(["전체"]);
    const [selectedState, setSelectedState] = useState("전체");
    const [selectedAge, setSelectedAge] = useState(["전체"]);
    const [selectedGender, setSelectedGender] = useState("무관");

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


    return (
        <div class="search-page-container">
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

                {/* 3-4. 성별 */}
                <p className="search-gender">성별</p>
                <div className="search-btn-group gender-btn">
                    <input
                        type="radio" id="search-gender-btn1" name="state" value="무관"
                        checked={selectedGender === "무관"}
                        onChange={handleChangeGender}
                    />
                    <label htmlFor="search-btn1">무관</label>

                    <input
                        type="radio" id="search-gender-btn2" name="state" value="남성"
                        checked={selectedGender === "남성"}
                        onChange={handleChangeGender}
                    />
                    <label htmlFor="search-btn2">남성</label>

                    <input
                        type="radio" id="search-gender-btn3" name="state" value="여성"
                        checked={selectedGender === "여성"}
                        onChange={handleChangeGender}
                    />
                    <label htmlFor="search-btn3">여성</label>
                </div>
                </div>
            </div>

    )
}

export default Search;

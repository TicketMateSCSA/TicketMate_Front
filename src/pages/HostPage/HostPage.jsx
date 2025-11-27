import {useState, useEffect} from "react";
// import format from "data-format";

import './HostPage.css';
import Navigator from "../../components/Navigator/Navigator";
import noImage from '../../assets/images/no-image.png';
import { useNavigate } from "react-router-dom";

const perfURL = `${import.meta.env.VITE_POSTS_URL}/performances`;
const postURL = `${import.meta.env.VITE_POSTS_URL}/post`;

function TransTime({startDate}){
    let dateNtime = "";
    let slicedDate = "(계속)";

    if (startDate){
        dateNtime = startDate.split("T");
        dateNtime[0] = dateNtime[0].split("-").splice(0, 3);
        dateNtime[0] = dateNtime[0][0] + "년 " + dateNtime[0][1] + "월 " + dateNtime[0][2] + "일 "
        slicedDate = dateNtime.slice(0, 1).join(" ");
    }

    return slicedDate;
}


function HostPage(){
    const navigate = useNavigate();

    const today = new Date().toISOString().split("T")[0];

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedShow, setSelectedShow] = useState(null);

    // 입력용 ---------------------------
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [viewDate, setViewDate] = useState(null);
    const [viewTime, setViewTime] = useState(null);
    const [locTime, setLocTime] = useState("");
    const [numNeed, setNumNeed] = useState(1);
    const [selectedGender, setSelectedGender] = useState("무관");
    const [selectedAge, setSelectedAge] = useState(["전체"]);
    const [hashTag, setHashTag] = useState("");

    // 핸들러 ---------------------------
    const handleTitle = (e) => {
        const value = e.target.value;

        if (value.length <= 80) {
            setTitle(value);
        }else{
            alert("제목을 80자 이내로 입력해주세요.")
        }
    }

    const handleContent = (e) => {
        const value = e.target.value;

        if (value.length <= 1000) {
            setContent(value);
        }else{
            alert("상세 내용을 1000자 이내로 입력해주세요.")
        }
    }

    const handleViewDate = (e) => {
        setViewDate(e.target.value);
    }

    const handleViewTime = (e) => {
        setViewTime(e.target.value);
    }

    const handleLocTime = (e) => {
        const value = e.target.value;

        if (value.length <= 30) {
            setLocTime(value);
        }else{
            alert("만남 장소/시간을 30자 이내로 입력해주세요.")
        }
    }

    const handleNumNeed = (e) => {
        setNumNeed(e.target.value);
    }

    const handleSelectedGender = (e) => {
        setSelectedGender(e.target.value);
    }

    const handleHashTag = (e) => {
        const value = e.target.value;

        if (value.length <= 10) {
            setHashTag(value);
        }else{
            alert("태그를 10자 이내로 입력해주세요.")
        }
    }

    const handleChangeAge = (event) => {
        const { value, checked } = event.target;

        if (value === "전체") {
            setSelectedAge(["전체"]);
        } else {
            if (checked) {
                const newSelected = [...selectedAge.filter(c => c !== "전체"), value];
                setSelectedAge(newSelected.length === 5 ? ["전체"] : newSelected); // 다 찼는지

            } else {
                const newSelected = selectedAge.filter((c) => c !== value);
                setSelectedAge(newSelected.length === 0 ? ["전체"] : newSelected);
            }
        }
    };

    // 폼 초기화 로직 추가 ---------------------------
    // const resetForm = () => {
    //     setTitle('');
    //     setContent('');
    //     setViewDate(null);
    //     setViewTime(null);
    //     setLocTime("");
    //     setNumNeed(1); // 기본값으로 설정
    //     setSelectedGender("무관"); // 기본값으로 설정
    //     setSelectedAge(["전체"]); // 기본값으로 설정
    //     setHashTag("");
    //     // 공연 선택 관련 초기화
    //     setQuery("");
    //     setOpen(false);
    //     setSelectedShow(null);
    // };

    // 백 -------------------------------
    const buildBody = () => {
        // 0. 필수 값 검증 로직 추가
        if (!selectedShow) {
            throw new Error("공연을 선택해주세요.");
        }
        if (!title.trim()) {
            throw new Error("제목을 입력해주세요.");
        }
        if (!viewDate || !viewTime) {
            throw new Error("관람 날짜와 시간을 선택해주세요.");
        }
        if (!locTime.trim()) {
            throw new Error("만남 장소/시간을 입력해주세요.");
        }
        if (!content.trim()) {
            throw new Error("상세 내용을 입력해주세요.");
        }


        
        // 1. 필요한 모든 데이터를 객체로 구성합니다.
        const bodyData = {
            "mate_perf_id": selectedShow.perf_id,
            "mate_title": title,
            "mate_content": content,
            // 날짜와 시간 형식을 그대로 사용합니다.
            "mate_view_date": viewDate + "T" + viewTime + ":00", 
            "mate_loc_time": locTime,
            "mate_num_of_need": numNeed,
        };

        // 2. 성별 매핑 처리
        const genderMap = { "무관": 0, "남성": 1, "여성": 2 };
        bodyData.mate_pref_gender = genderMap[selectedGender];

        // 3. 연령대 비트마스크 처리
        const ageMap = {
            "전체": 1 << 0, 
            "10대": 1 << 1, 
            "20대": 1 << 2, 
            "30대": 1 << 3, 
            "40대": 1 << 4, 
            "50대+": 1 << 5 
        };
        let ageBit = 0;
        selectedAge.forEach(age => {
            ageBit |= ageMap[age]; 
        });
        bodyData.mate_pref_age = ageBit;
        
        // 4. 해시태그 처리
        bodyData.mate_hashtag = hashTag;

        // POST 요청 시, 이 객체를 보통 JSON.stringify()를 사용하여 문자열화하여 보냅니다.
        return bodyData; 
    };

    // POST 함수 수정: 결과를 반환하도록 유지
    const postData = async (url, dataToSend) => {
        try {
            const response = await fetch(url, {
                method: 'POST', // POST 메소드 지정
                headers: {
                    // 서버가 JSON 데이터를 예상하고 있음을 알립니다.
                    'Content-Type': 'application/json', 
                    // 필요한 경우 다른 헤더 (예: 인증 토큰) 추가
                },
                // JavaScript 객체를 JSON 문자열로 변환하여 요청 본문에 넣습니다.
                body: JSON.stringify(dataToSend), 
            });

            if (!response.ok) {
                // 응답 본문을 읽어 더 상세한 오류 메시지 제공 시도
                const errorBody = await response.text();
                throw new Error(`HTTP error! status: ${response.status}. Body: ${errorBody}`);
            }

            const result = await response.json(); // 서버 응답 처리
            return result;

        } catch (error) {
            console.error('Error posting data:', error);
            throw error; // 에러를 호출자에게 다시 던져서 처리하도록 합니다.
        }
    };

    // 버튼 클릭 핸들러 추가
    const handleSubmit = async () => {
        try {
        // 1. 전송할 데이터를 준비합니다. (buildBody에서 유효성 검사 수행)
        const dataToSend = buildBody(); 
        
        // 2. 서버로 데이터를 전송합니다.
        const result = await postData(postURL, dataToSend); 
        
        // console.log('Post Success:', result);
        alert("메이트 모집글이 성공적으로 등록되었습니다!");

        // console.log(result.result);
        navigate(`/detail/${result.result}`)

    } catch (error) {
        console.error('Submission failed:', error);
        
        // buildBody에서 발생한 유효성 검사 에러 또는 POST 요청 에러를 사용자에게 보여줍니다.
        // 유효성 검사 에러 메시지가 더 명확하므로 이를 활용합니다.
        alert(`${error.message}`); 
    }
    };

    
    useEffect(() => {
        fetch(perfURL)
        .then((response) => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            // console.log(data);
            console.clear();
            setData(data);
            setLoading(false);
        })
        .catch((error) => {
            setError(error.message);
            setLoading(false);
        });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    
    const list = data?.result?.getPerformanceDTOList;
    
    // 드롭다운 옵션
    const options = list.map(item => ({
        value: item,
        label: item.perf_name
    }));

    // 검색어로 필터링
    const filtered = options.filter(opt =>
        opt.label.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelect = (opt) => {
        setSelectedShow(opt.value);
        setQuery(opt.label);
        setOpen(false);
    }

    // 엔터 입력 시 첫 번째 항목 선택
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && filtered.length > 0) {
            handleSelect(filtered[0]);
        }
    }

    return(
        <div className="host-page-container">
            <Navigator/>
        

            {/* 1. 헤더 */}
            <div className='header'>
                <p className="head">메이트 모집하기</p>
                <p className="body">함께 공연을 즐길 메이트를 모집해볼까요?</p>

                {/* <button className="save">임시저장</button> */}
                <button className="post" onClick={handleSubmit}>등록하기</button>
            </div>
            
            {/* 2. 양식 */}
            <div className='form'>
                {/* 2-1. 공연 관련 */}
                <div className='show'>
                    <p className="chooseShow">공연 선택<span className="star">*</span></p>
                    <input
                        className="searchShow"
                        type="text"
                        placeholder="공연 검색 또는 선택"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setOpen(true);
                        }}
                        onFocus={() => setOpen(true)}
                        onKeyDown={handleKeyDown}
                    />

                    {open &&  (
                        <ul className="dropdown-list">
                            {query && filtered.length == 0 &&
                            (<li>
                                검색 결과 없음</li>)}
                            {filtered.map((opt, idx) => (
                                <li
                                    key={idx}
                                    className="dropdown-item"
                                    onClick={() => handleSelect(opt)}
                                >
                                    {opt.label}
                                </li>
                            ))}
                        </ul>
                    )}

                    {selectedShow && (
                        <div className="selected-show">
                            <img className="showImage" 
                                    src={selectedShow.perf_img_url ? selectedShow.perf_img_url : noImage}
                                    alt={selectedShow.perf_name}/>

                            <ul className="showInfo">
                                <li>공연: {selectedShow.perf_name}</li>
                                <li>장소: {selectedShow.perf_loc}</li>
                                <li>기간: <TransTime startDate={selectedShow.perf_sat}/> ~ <TransTime startDate={selectedShow.perf_eat}/></li>
                                <li>연령 제한: {selectedShow.perf_lim_age}세</li>
                                <li>장르: {selectedShow.cat_name}</li>
                            </ul>
                        </div>
                    )}
                    
                </div>

                {/* 2-2. 글 관련 */}
                
                <div className='post'>
                    <p className="post-title">제목<span className="star">*</span></p>
                    <input className="writeTitle" type='text'
                        value={title}
                        placeholder='함께 공연 보실 분 구합니다!'
                        onChange={handleTitle}/>
                    <p className="date">관람 날짜<span className="star">*</span></p>
                    <input
                        className="chooseDate"
                        type="date"
                        value={viewDate || ""}
                        min={selectedShow 
                                ? (selectedShow.perf_start_date > today ? selectedShow.perf_start_date : today)
                                : today}
                        max={selectedShow ? selectedShow.perf_end_date : ""}
                        onChange={handleViewDate}
                    />
                    
                    <p className="time">관람 시간<span className="star">*</span></p>
                    <input
                        className="chooseTime"
                        type="time"
                        value={viewTime || ""}
                        min={selectedShow ? selectedShow.perf_start_time : ""}
                        max={selectedShow ? selectedShow.perf_end_time : ""}
                        onChange={handleViewTime}
                    />


                    <p className="peopleNum">모집 인원<span className="star">*</span></p>
                    <input className="choosePeopleNum" type='number' min={1} 
                        placeholder='인원 수'
                        value={numNeed}
                        onChange={handleNumNeed}></input>
                
                    <p className="like">선호 조건</p>

                    <p className="age">연령대</p>
                    <div className="btn-group">
                        <input type="checkbox" id="btn1" name="select" value="전체"
                        checked={selectedAge.includes("전체")}
                        onChange={handleChangeAge}
                        defaultChecked />
                        <label htmlFor="btn1">전체</label>

                        <input type="checkbox" id="btn2" name="select" value="10대"
                        checked={selectedAge.includes("10대")}
                        onChange={handleChangeAge}/>
                        <label htmlFor="btn2">10대</label>

                        <input type="checkbox" id="btn3" name="select" value="20대"
                        checked={selectedAge.includes("20대")}
                        onChange={handleChangeAge}/>
                        <label htmlFor="btn3">20대</label>

                        <input type="checkbox" id="btn4" name="select" value="30대"
                        checked={selectedAge.includes("30대")}
                        onChange={handleChangeAge}/>
                        <label htmlFor="btn4">30대</label>

                        <input type="checkbox" id="btn5" name="select" value="40대"
                        checked={selectedAge.includes("40대")}
                        onChange={handleChangeAge}/>
                        <label htmlFor="btn5">40대</label>

                        <input type="checkbox" id="btn6" name="select" value="50대+"
                        checked={selectedAge.includes("50대+")}
                        onChange={handleChangeAge}/>
                        <label htmlFor="btn6">50대+</label>
                    </div>

                    
                    <p className="gender">성별</p>
                        <div className="btn-group2">
                            <input type="radio" id="btn7" name="select2"  value="무관"
                            checked={selectedGender === "무관"}
                            onChange={handleSelectedGender}
                            defaultChecked/>
                            <label htmlFor="btn7">무관</label>

                            <input type="radio" id="btn8" name="select2" value="남성"
                            checked={selectedGender === "남성"}
                            onChange={handleSelectedGender}/>
                            <label htmlFor="btn8">남성</label>

                            <input type="radio" id="btn9" name="select2" value="여성"
                            checked={selectedGender === "여성"}
                            onChange={handleSelectedGender}/>
                            <label htmlFor="btn9">여성</label>
                        </div>
                
                    <p className="meetLocTime">만남 장소/시간<span className="star">*</span></p>
                    <input className="writeMeetLT" type="text" 
                        placeholder='공연장 입구에서, 공연 시작 30분 전에!'
                        onChange={handleLocTime}
                        value={locTime}/>

                    <p className="message" >상세 내용<span className="star">*</span></p>
                    <textarea value={content} className="writeMessage" rows="10" placeholder="메이트에게 전하고 싶은 내용을 작성해주세요.
매칭된 메이트와 연락할 수단(오픈채팅, 연락처)이 필요하다면, 이곳에 작성해도 좋아요."
onChange={handleContent} />

                    <p className="tag">태그</p>
                    <input value={hashTag} className="writeTag" placeholder='#태그1 #태그2'
                    onChange={handleHashTag} />

                    
                </div>

            <p className="warning1"><span className="star">*</span> 표시된 항목은 필수 입력 사항입니다.</p>
            <p className="warning2">허위 정보나 부적절한 내용은 삭제될 수 있습니다.</p>
            </div>
        </div>
    )
}

export default HostPage ; 
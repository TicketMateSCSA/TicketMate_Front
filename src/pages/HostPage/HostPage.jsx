import {useState, useEffect} from "react";

import './HostPage.css';
import Navigator from "../../components/Navigator/Navigator";
import noImage from '../../assets/images/no-image.png';

const perfURL = `${import.meta.env.VITE_POSTS_URL}/performances`;


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
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedShow, setSelectedShow] = useState(null);

    const today = new Date().toISOString().split("T")[0];

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

                <button className="save">임시저장</button>
                <button className="post">등록하기</button>
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

                    {open && query && (
                        <ul className="dropdown-list">
                            {filtered.length === 0 && (
                                <li className="dropdown-item disabled">검색 결과 없음</li>
                            )}
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
                    <input className="writeTitle" type='text' placeholder='함께 공연 보실 분 구합니다!'/>
                    
                    <p className="date">관람 날짜<span className="star">*</span></p>
                    <input
                        className="chooseDate"
                        type="date"
                        value={selectedShow ? selectedShow.perf_start_date : ""}
                        min={selectedShow 
                                ? (selectedShow.perf_start_date > today ? selectedShow.perf_start_date : today)
                                : today}
                        max={selectedShow ? selectedShow.perf_end_date : ""}
                        onChange={(e) =>
                            setSelectedShow(prev => ({ ...prev, perf_start_date: e.target.value }))
                        }
                        />
                    
                    <p className="time">관람 시간<span className="star">*</span></p>
                    <input
                        className="chooseTime"
                        type="time"
                        value={selectedShow ? selectedShow.perf_start_time : ""}
                        min={selectedShow ? selectedShow.perf_start_time : ""}
                        max={selectedShow ? selectedShow.perf_end_time : ""}
                        onChange={(e) =>
                            setSelectedShow(prev => ({ ...prev, perf_start_time: e.target.value }))
                        }
                        />

                    <p className="peopleNum">모집 인원<span className="star">*</span></p>
                    <input className="choosePeopleNum" type='number' min={1} placeholder='인원 수'></input>
                
                    <p className="like">선호 조건</p>

                    <p className="age">연령대</p>
                    <div className="btn-group">
                        <input type="radio" id="btn1" name="select" defaultChecked />
                        <label htmlFor="btn1">전체</label>

                        <input type="radio" id="btn2" name="select" />
                        <label htmlFor="btn2">10대</label>

                        <input type="radio" id="btn3" name="select" />
                        <label htmlFor="btn3">20대</label>

                        <input type="radio" id="btn4" name="select" />
                        <label htmlFor="btn4">30대</label>

                        <input type="radio" id="btn5" name="select" />
                        <label htmlFor="btn5">40대</label>

                        <input type="radio" id="btn6" name="select" />
                        <label htmlFor="btn6">50대+</label>
                    </div>

                    
                    <p className="gender">성별</p>
                        <div className="btn-group2">
                            <input type="radio" id="btn7" name="select2" defaultChecked/>
                            <label htmlFor="btn7">무관</label>

                            <input type="radio" id="btn8" name="select2" />
                            <label htmlFor="btn8">남성</label>

                            <input type="radio" id="btn9" name="select2" />
                            <label htmlFor="btn9">여성</label>
                        </div>
                
                    <p className="meetLocTime">만남 장소/시간<span className="star">*</span></p>
                    <input className="writeMeetLT" type="text" placeholder='공연장 입구에서, 공연 시작 30분 전에!'/>

                    <p className="message">상세 내용</p>
                    <textarea className="writeMessage" rows="10" placeholder="메이트에게 전하고 싶은 내용을 작성해주세요.
매칭된 메이트와 연락할 수단(오픈채팅, 연락처)이 필요하다면, 이곳에 작성해도 좋아요."/>

                    <p className="tag">태그</p>
                    <input className="writeTag" placeholder='#태그1 #태그2 #태그3'/>

                    
                </div>

            <p className="warning1"><span className="star">*</span> 표시된 항목은 필수 입력 사항입니다.</p>
            <p className="warning2">허위 정보나 부적절한 내용은 삭제될 수 있습니다.</p>
                
            </div>

            
        </div>
    )
}

export default HostPage ; 
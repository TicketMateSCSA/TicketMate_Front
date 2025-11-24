import {useState, useEffect, useContext} from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import "./DetailPage.css";
import Navigator from "../../components/Navigator/Navigator";
import noImage from '../../assets/images/no-image.png';
import noProfile from '../../assets/images/no-profile.png';

const matePostId = 32;
const postURL = `${import.meta.env.VITE_POSTS_URL}/post`;
const sendURL = `${import.meta.env.VITE_POSTS_URL}/posts`;

const ageMap = {0: '10대', 1: '20대', 2: '30대', 3: '40대', 4: '50대+'}
const genderMap = {0: '무관', 1: '남성', 2: '여성'}
const stateMapRev = {0: "전체", 1: "모집중", 2: "모집완료"};

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

function Detail(){
    const navigate = useNavigate();

    const { isAuthenticated, userProfile } = useAuth();
    const [reqData, setReqData] = useState(null);
    const [myContent, setMyContent] = useState(null);

    const handleMyContent = (e) => {
        setMyContent(e.target.value);
    }

    const fetchData = async () => {
        try {
            const response = await fetch(`${postURL}/${matePostId}`);
            const data = await response.json();
            setReqData(data);
            console.log(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
        }, []);
    

    const postData = async (url) => {
        const dataToSend = {
            "req_post_id": obj.mem_post_id,
            "req_msg": myContent
        };
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

    // 버튼 클릭
    const handleSubmit = async () => {
        try {
        const result = await postData(sendURL + `/${obj.mate_post_id}/apply`); 
        
        console.log('Post Success:', result);
        navigate(`/regist?mate_post_id=${obj.mate_post_id}`);
        } catch (error) {
            console.error('Error posting data:', error);
            throw error; // 에러를 호출자에게 다시 던져서 처리하도록 합니다.
        }
        
    }

    const obj = reqData?.result;
    
    const tags = obj?.mate_hashtag ? obj.mate_hashtag.split(" ") : [];
    const slicedTag = tags?.slice(0, 5);

    return (
        <div className='detail-page-container'>
            <Navigator/>

            {/* 1. 헤더 */}
            <div className='header'>
                <p className="head">메이트 찾기</p>
                <p className="body">함께 공연을 즐길 메이트를 찾아보세요!</p>
            </div>

            {/* 2. 양식 */}
            { obj && (
            <div className='form'>
                <div className='detail-left'>
                    <img src={obj.perf_img_url? obj.perf_img_url: noImage}/>
                    <div className='left-info'>
                        <p className="bold">공연 정보</p>
                        <p>{obj.perf_name}</p>
                        <p><TransTime startDate={obj.perf_sat}/> ~ <TransTime startDate={obj.perf_eat}/></p>
                        <p>{obj.perf_loc}</p>
                        <button>상세 정보 보기</button>
                    </div>

                    <div className='left-host'>
                        <p className="bold">호스트 정보</p>
                        <img src={obj.host_img_url ? obj.host_img_url : noProfile}/>
                        <p className="lh-nn">{obj.host_nn ? obj.host_nn : obj.host_name}</p>
                        <p className="lh-gender"> {ageMap[obj.host_age_range]} {genderMap[obj.host_gender]}</p>
                        <p className="lh-mate">
                            메이트 온도&nbsp;&nbsp;&nbsp;{obj.host_score}°<br/>
                            메이트 횟수&nbsp;&nbsp;&nbsp;{obj.host_num_of_mates}회</p>
                    </div>
                </div>

                <div className='detail-right'>
                    <p className="right-title">{obj.mate_title}</p>
                    <div className="right-state"
                        style={
                            {backgroundColor: obj.mate_status === 1 ? "#A1FFA6" : "#E0E0E0",
                            borderColor: obj.mate_status === 1 ? "#40A646" : "#656565",
                            color: obj.mate_status === 1? "#40A646" : "#656565"
                        }}>{stateMapRev[obj.mate_status]}
                            <br/>
                            ({obj.mate_num_of_confirmed}/{obj.mate_num_of_need})
                    </div>
                    <p className="right-mini">작성일 <TransTime flag={false} startDate={obj.mate_created_at}/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;조회 {obj.mate_view_cnt}</p>
                    
                    <div className="right-perf-info">
                        <div className="right-left">
                            <p>관람일시&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{<TransTime startDate={obj.mate_view_date}/>}</p>
                            <p>모집인원&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{obj.mate_num_of_need} (현재 {obj.mate_num_of_confirmed}/{obj.mate_num_of_need})</p>
                        </div>
                        <div className="right-right">
                            <p>관람시간&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{obj.mate_view_date.split("T")[1].split(":").slice(0, 2).join(":")}</p>
                            <p>선호사항&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ageMap[obj.mate_pref_age]} {genderMap[obj.mate_pref_gender]}</p>
                        </div>                    
                    </div>

                    <p className="right-loctime">만남 장소/시간</p>
                    <div className="right-meet-loctime">
                        {obj.mate_loc_time}
                    </div>

                    <p className="right-meet-content">상세 내용</p>
                    <div className="right-perf-content">
                        {obj.mate_content}
                    </div>
                    
                    <div className="right-tag-container">
                        {slicedTag.map((tag, idx) => (
                            <span className="right-section-tag" key={idx}>{tag}</span>
                        )) }
                    </div>

                    <div className="right-line"/>
                    <div className="right-message-box">
                        <p className="right-line-title">신청 메시지</p>
                        <textarea row={10} className="right-message-content" 
                            placeholder="호스트에게 간단한 자기소개와 신청 의사를 전달해주세요. 연락 수단을 전달해도 좋습니다."
                            onChange={handleMyContent}/>
                    

                    { isAuthenticated ? (
                        <div>
                            <p className="right-content-my-info">내 정보</p>
                            <div className="right-left-my-info">
                                <p>닉네임&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{userProfile.mem_nn? userProfile.mem_nn : userProfile.mem_name}</p>
                                <p>성별&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{genderMap[userProfile.mem_gender]}</p>
                            </div>
                            <div className="right-right-my-info">
                                <p>연령대&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ageMap[userProfile.mem_age_range]}</p>
                                <p>메이트 온도&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{userProfile.mem_score}°</p>
                            </div> 
                        </div>
                    ) : <p className="right-needLogin">메이트를 신청하려면 로그인이 필요합니다.</p>}
                        
                    </div>

                    <button className="mate-apply-button" onClick={handleSubmit}>메이트 신청하기</button>
                               </div>
                
               
                <p className="warning2">허위 정보나 부적절한 내용은 삭제될 수 있습니다.</p>
                
            </div>
            
            )}




        </div>
    )
}

export default Detail;
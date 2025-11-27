import "./RegistPage.css";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navigator from "../../components/Navigator/Navigator";

import successIcon from '../../assets/icons/request-success-icon.png';
import noImage from '../../assets/images/no-image.png';
import noProfile from '../../assets/images/no-profile.png'

const postsUrl = `${import.meta.env.VITE_POSTS_URL}/posts`;
const requestUrl = `${import.meta.env.VITE_POSTS_URL}/requests`;

function RegistSection({item}){
    const navigate = useNavigate();
    
    const stateMapRev = {0: "전체", 1: "모집중", 2: "모집완료"};
    const ageMapRev = {0: '10대', 1: '20대', 2: '30대', 3: '40대', 4: '50대+'}
    const genderMapRev = {0: '무관', 1: '남성', 2: '여성'}

    const tags = item.mate_hashtag ? item.mate_hashtag.split(" ") : [];
    const slicedTag = tags.slice(0, 5);

    const dateNtime = item.mate_view_date ? item.mate_view_date.split("T") : [];
    dateNtime[0] = dateNtime[0].split("-").splice(0, 3);
    dateNtime[0] = dateNtime[0][0] + "년 " + dateNtime[0][1] + "월 " + dateNtime[0][2] + "일 "
    dateNtime[1] = dateNtime[1].split(":").slice(0, 2).join(":");
    const slicedDate = dateNtime.slice(0, 2).join(" ");

    // 버튼 클릭
    const handleClick = async (item) => {
        // console.log(item.mate_post_id);
        navigate(`/detail/${item.mate_post_id}`);  
    }

    return (
        <div className="regist-section-func" onClick={() => handleClick(item)}>
            <img className="regist-section-img" 
                src={item.perf_img_url ? item.perf_img_url : noImage}
                alt={item.perf_name}/>

            <div className="regist-section-content">
                <span className="regist-section-category">{item.cat_name}</span>
                <span className="regist-section-state"
                    style={
                        {backgroundColor: item.mate_status === 1 ? "#A1FFA6" : "#E0E0E0",
                        borderColor: item.mate_status === 1 ? "#40A646" : "#656565",
                        color: item.mate_status === 1? "#40A646" : "#656565"
                    }}>{stateMapRev[item.mate_status]}</span>
                <p className="regist-section-title">{item.mate_title}</p>
                
                <p className="regist-section-body1">
                    공연: {item.perf_name}<br/>
                    일시: {slicedDate}
                    <span className="regist-section-accountInfo">
                        <img src={item.mem_img_url ? item.mem_img_url : noProfile}/>
                        <span>{item.mem_nn ? item.mem_nn : item.mem_name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ageMapRev[item.mem_age_range]} {genderMapRev[item.mem_gender]}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;조회 {item.mate_view_cnt}</span>
                    </span>
                    </p>
                    
                <p className="regist-section-body2">
                    장소: {item.perf_loc}<br/>
                    모집 인원: {item.mate_num_of_need} (현재 {item.mate_num_of_confirmed}/{item.mate_num_of_need})</p>
                
                <div className="regist-tag-container">
                    {slicedTag.map((tag, idx) => (
                    <span className="regist-section-tag" key={idx}>{tag}</span>
                    )) }
                </div>
                
            </div>
        </div>
    )
}

function Regist(){
    const { reqId } = useParams();

    // 버튼 클릭 -----------------------------
    const navigate = useNavigate();

    const goToSearchPage = () => {
        navigate("/search");
    }
    
    const goToMyPage = () => {
        navigate("/myPage");
    }

    // API 요청 ------------------------------
    const [data, setData] = useState(null); // 데이터를 담을 state
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태
    
    useEffect(() => {
        fetch(postsUrl)
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

    // 백 req ---------------------------------------
    const [reqData, setReqData] = useState(null);

    const fetchData = async () => {
        try {
            const response = await fetch(requestUrl + "/" + reqId);
            const data = await response.json();
            setReqData(data);
        } catch (err) {
            // console.error(err);
        } finally{
            console.clear();
        }
    };

    useEffect(() => {
        fetchData();
        }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    
    const list = data?.result?.postPreviewDTOList;
    const obj = reqData?.result;

    // ------------------------------------
    let slicedDate = "";

    if (obj){
        const dateNtime = obj.mate_view_date ? obj.mate_view_date.split("T") : [];
        dateNtime[0] = dateNtime[0].split("-").splice(0, 3);
        dateNtime[0] = dateNtime[0][0] + "년 " + dateNtime[0][1] + "월 " + dateNtime[0][2] + "일 "
        dateNtime[1] = dateNtime[1].split(":").slice(0, 2).join(":");
        slicedDate = dateNtime.slice(0, 2).join(" ");
    }

    return (
        
        <div className="regist-page-container">
            <Navigator/>

            { obj && (
                <div className="regist-done">
                    <div className="regist-done-header">
                        <img className="regist-success-icon" src={successIcon}/>
                        <p className="regist-success-text1">메이트 신청이 완료되었습니다!</p>
                        <p className="regist-success-text2">호스트가 신청을 확인하면 알림을 보내드릴게요.</p>
                    </div>

                    <div className="regist-done-body">
                        <p className="regist-done-body-title">신청 정보</p>
                        <img className="regist-done-body-img" 
                            src={obj.perf_img_url ? obj.perf_img_url : noImage}
                            alt={obj.perf_name}/>
                        <p className="rdb-title1">모집글</p>
                        <p className="rdb-title2">{obj.mate_title}</p>
                        
                        <div className="rdb-body1">
                            <p>공연</p>
                            <p className="nn">{obj.perf_name}</p>
                            <p>관람일시</p>
                            <p className="nn">{slicedDate}</p>

                        </div>
                        <div className="rdb-body2">
                            <p>호스트</p>
                            <p className="nn">{obj.mem_nn}</p>
                            <p>장소</p>
                            <p className="nn">{obj.perf_loc}</p>
                        </div>
                        
                        <p className="rdb-message1">신청 메시지</p>
                        <div className="rdb-message2">
                            {obj.req_msg}
                        </div>


                    </div>
                

                <button className="regist-toMyPage" onClick={goToMyPage}>신청 현황 보기</button>

                <button className="regist-toSearchPage" onClick={goToSearchPage}>다른 메이트 찾기</button>
            </div>
            )}

            <div className="regist-line">
                이런 메이트는 어떠세요?
                </div>
            

            <div className="regist-recommend">
                {list
                ?.filter(item => item.mate_status === 1) // 모집 중인
                .slice(0, 2) 
                .map((item) => (
                    <RegistSection key={item.mate_post_id} item={item}/>
                    ))}
            </div>
        </div>
    )
}

export default Regist;
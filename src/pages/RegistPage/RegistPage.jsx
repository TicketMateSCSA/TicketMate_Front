import "./RegistPage.css";

import { useState, useEffect } from "react";

import Navigator from "../../components/Navigator/Navigator";

import successIcon from '../../assets/icons/request-success-icon.png';
import noImage from '../../assets/images/no-image.png';
import noProfile from '../../assets/images/no-profile.png'

const postsUrl = `${import.meta.env.VITE_POSTS_URL}/posts`;

function RegistSection({item}){
    
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

    return (
        <div className="regist-section-func">
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
                    <div className="regist-section-accountInfo">
                    <img src={item.mem_img_url ? item.mem_img_url : noProfile}/>
                    <p>{item.mem_nn ? item.mem_nn : item.mem_name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ageMapRev[item.mem_age_range]} {genderMapRev[item.mem_gender]}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;조회 {item.mate_view_cnt}</p>
                </div>
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    
    const list = data?.result?.postPreviewDTOList;
    // ------------------------------------

    return (
        <div className="regist-page-container">
            <Navigator/>
            <div className="regist-done">

            </div>
            <div className="regist-recommend">
                {list
                ?.filter(item => item.mate_status === 1) // 모집 중인
                .slice(0, 2) // 상위 6개
                .map((item) => (
                    <RegistSection key={item.mate_post_id} item={item}/>
                    ))}
            </div>
        </div>
    )
}

export default Regist;
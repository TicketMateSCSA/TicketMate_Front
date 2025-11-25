import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { data, useNavigate } from "react-router-dom";
import "./HomePage.css";

import Navigator from "../../components/Navigator/Navigator";
import background from '../../assets/images/home-background-image.png';
import noImage from '../../assets/images/no-image.png';
import noProfile from '../../assets/images/no-profile.png';

const postsUrl = `${import.meta.env.VITE_POSTS_URL}/posts`;

const ageMap = {0: '10대', 1: '20대', 2: '30대', 3: '40대', 4: '50대+'}
const genderMap = {0: '무관', 1: '남성', 2: '여성'}

function Section({item}){
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
        <div className="homepage-section" onClick={() => {handleClick(item)}}>
            <img className="section-img" 
                src={item.perf_img_url ? item.perf_img_url : noImage}
                alt={item.perf_name}/>

            <div className="section-content">
                <p className="section-title">{item.mate_title}</p>
                <p className="section-body">
                    공연: {item.perf_name}<br/>
                    일시: {slicedDate}<br/>
                    장소: {item.perf_loc}<br/>
                    모집 인원: {item.mate_num_of_need} (현재 {item.mate_num_of_confirmed}/{item.mate_num_of_need})</p>
                
                <div className="section-accountInfo">
                    <img src={item.mem_img_url ? item.mem_img_url : noProfile}/>
                    <p>{item.mem_nn ? item.mem_nn : item.mem_name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ageMap[item.mem_age_range]} {genderMap[item.mem_gender]}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;조회 {item.mate_view_cnt}</p>
                </div>

                {slicedTag.map((tag, idx) => (
                    <span className="section-tag" key={idx}>{tag}</span>
                    )) }
            </div>
        </div>
    )
}

function HomePage(){
    const navigate = useNavigate();

    const goToHostPage = () => {
        navigate("/host");
    }

    const goToSearchPage = () => {
        navigate("/search");
    }

    // 1. API 요청
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
            console.log(data);
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
    // console.log(list);

    return(
        <div className="home-page-container">
            <Navigator/>
            
            {/* 인사 */}
            <img className="background" src={background} />
            <p className="frontTitle">함께 공연을 즐길 메이트를 찾아보세요!</p>
            <p className="frontBody">마음 맞는 메이트와 함께라면, 더 즐거운 관람을 경험할 수 있을 거예요.</p>
        
            <button className="background-findMate" onClick={goToSearchPage}>메이트 찾기</button>
            <button className="background-postMate" onClick={goToHostPage}>메이트 모집하기</button>
            
            {/* 목록 */}
            <div className="homepage-content">
                {list
                ?.filter(item => item.mate_status === 1) // 모집 중인
                .slice(0, 6) // 상위 6개
                .map((item) => (
                    <Section key={item.mate_post_id} item={item}/>
    
                ))}
                
            </div>
            
        
        </div>
    )
}

export default HomePage ; 
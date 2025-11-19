import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

import Navigator from "../../components/Navigator/Navigator";
import background from '../../assets/images/home-background-image.png';

const postsUrl = "http://10.10.0.104:8888/posts";

function Section(){
    return (
        <div>

        </div>
    )
}

function HomePage(){
    const navigate = useNavigate();

    const goToHostPage = () => {
        navigate("/host");
    }

    const [data, setData] = useState(null); // 데이터를 담을 state
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    useEffect(() => {
    fetch(postsUrl) // API 주소
    .then((response) => {
        if (!response.ok) {
        throw new Error("네트워크 응답 오류");
        }
        return response.json(); // JSON 변환
    })
    .then((jsonData) => {
        setData(jsonData); // state에 저장
        setLoading(false);
    })
    .catch((err) => {
        setError(err);
        setLoading(false);
    });
    }, []); // 빈 배열 = 마운트 시 1번만 실행

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>에러: {error.message}</div>;
    
    return(
        <div className="home-page-container">
            <Navigator/>
            
            {/* 인사 */}
            <img className="background" src={background} />
            <p className="frontTitle">함께 공연을 즐길 메이트를 찾아보세요!</p>
            <p className="frontBody">마음 맞는 메이트와 함께라면, 더 즐거운 관람을 경험할 수 있을 거예요.</p>
        
            <button className="background-findMate">메이트 찾기</button>
            <button className="background-postMate" onClick={goToHostPage}>메이트 모집하기</button>
            
            {/* 목록 */}
            <div>
            {data && data.map((item) => (
                <div key={item.mate_post_id}>
                <h3>{item.mate_title}</h3>
                <p>{item.hashtag}</p>
                </div>
            ))}
            </div>
        
        </div>
    )
}

export default HomePage ; 
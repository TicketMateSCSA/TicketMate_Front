import "./MyPage.css";
import Navigator from "../../components/Navigator/Navigator";

import { useState, useEffect, act } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import noProfile from '../../assets/images/no-profile.png';

const myPostURL = `${import.meta.env.VITE_POSTS_URL}/requests/recieved`;
const myGetURL = `${import.meta.env.VITE_POSTS_URL}/requests/applicants`;
const myRegistURL = `${import.meta.env.VITE_POSTS_URL}/requests/sent`;

const ageMap = {1: '전체', 2: '10대', 4: '20대', 8: '30대', 16: '40대', 32: '50대+'};
const genderMap = {0: '무관', 1: '남성', 2: '여성'};

const stateMapRev = {0: "전체", 1: "모집중", 2: "모집완료"};
const dbStateMapRev = {0: "대기중", 1: "승인됨", 2: "거절됨"}

function MyPageSectionMyPost({item}){
    const navigate = useNavigate();

    const dateNtime = item.mate_view_date ? item.mate_view_date.split("T") : [];
    dateNtime[0] = dateNtime[0].split("-").splice(0, 3);
    dateNtime[0] = dateNtime[0][0] + "년 " + dateNtime[0][1] + "월 " + dateNtime[0][2] + "일 "
    dateNtime[1] = dateNtime[1].split(":").slice(0, 2).join(":");
    const slicedDate = dateNtime.slice(0, 2).join(" ");

    const handleDelete = async (mate_post_id) => {
        if (!window.confirm("정말 삭제할까요?")) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_POSTS_URL}/post/${mate_post_id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorText = await response.text();
                alert(`삭제 실패: ${errorText}`);
                return;
            }

            alert("삭제되었습니다!");
            window.location.reload();
            

        } catch (err) {
            console.error(err);
            alert("서버 오류로 삭제하지 못했습니다.");
        }
    };

    // 버튼 클릭
    const handleClick = async (item) => {
        navigate(`/detail/${item.mate_post_id}`);  
    }

    return (
        
        <div className="myPageMyPost-section-func" >
            <img className="myPageMyPost-section-img" 
                src={item.perf_img_url ? item.perf_img_url : noImage}
                alt={item.perf_name}/>

            <div className="myPageMyPost-section-content">
                <div className="post-header">
                <span className="myPageMyPost-section-category">{item.cat_name}</span> <span className="myPageMyPost-section-state"
                    style={
                        {backgroundColor: item.mate_status === 1 ? "#A1FFA6" : "#E0E0E0",
                        borderColor: item.mate_status === 1 ? "#40A646" : "#656565",
                        color: item.mate_status === 1? "#40A646" : "#656565"
                    }}>
                    {stateMapRev[item.mate_status]}
                </span>

                <span onClick={() => handleClick(item)} className="toDetailBtn">상세</span>
                <span onClick={() => handleDelete(item.mate_post_id)}className="toDeleteBtn" style={{textAlign: "right"}}>삭제하기</span>
                </div>
                <p className="myPageMyPost-section-title">{item.mate_title}</p>
                
                <table className="mpmp-table">
                    <tbody>
                        <tr className="myPageMyPost-section-body1"><td style={{ width: "53%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}} >공연: {item.perf_name}</td><td style={{width: "47%"}}>장소: {item.perf_loc}</td></tr>
                        
                        <tr className="myPageMyPost-section-body1"><td style={{width: "53%"}}>일시: {slicedDate}</td><td style={{width: "47%"}}>모집 인원: {item.mate_num_of_need} (현재 {item.mate_num_of_confirmed}/{item.mate_num_of_need})</td></tr>
                    </tbody>
                </table>
                    
                
            </div>
        </div>
    )
}

function MyPageSectionGet({item}){
    const handleOK = async () => {
        if (!window.confirm("정말 승인할까요?")) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_POSTS_URL}/requests/${item.req_id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    req_id: item.req_id,
                    req_stat: 1
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                alert(`승인 실패: ${errorText}`);
                return;
            }

            alert("승인되었습니다!");
            window.location.reload();
            

        } catch (err) {
            console.error(err);
            alert("서버 오류로 승인하지 못했습니다.");
        }
    }

    const handleNO = async () => {
        if (!window.confirm("정말 거절할까요?")) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_POSTS_URL}/requests/${item.req_id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    req_id: item.req_id,
                    req_stat: 2
                }),
            });
            
            
            if (!response.ok) {
                const errorText = await response.text();
                alert(`거절 실패: ${errorText}`);
                return;
            }

            alert("거절되었습니다!");
            window.location.reload();
            

        } catch (err) {
            console.error(err);
            alert("서버 오류로 거절하지 못했습니다.");
        }
    }

    return (
        <div className="myPageMyPost-section-func" >
            <div>
            <div className="title-wrapper">
            <p className="sftitle">{item.mate_title}</p>
            {item.req_stat == 0 && (
                <div>
                    <span className="sfOK" onClick={handleOK}>승인하기</span>
                    <span className="sfNO" onClick={handleNO}>거절하기</span>
                </div>
            )}

            {item.req_stat == 1 && (
                <div>
                    <span className="sfOKState">승인완료</span>
                </div>
            )}

            {item.req_stat == 2 && (
                <div>
                    <span className="sfNOState">거절완료</span>
                </div>
            )}
            </div>
            <p className="sfaccount">
            <span style={{fontWeight:"bold"}}>닉네임</span>&nbsp;&nbsp;&nbsp;&nbsp;{item.mem_nn? item.mem_nn : item.mem_name}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{fontWeight:"bold"}}>성별</span>&nbsp;&nbsp;&nbsp;&nbsp;{item.mem_gender? genderMap[item.mem_gender]: "-"}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{fontWeight:"bold"}}>연령</span>&nbsp;&nbsp;&nbsp;&nbsp;{item.mem_age? item.mem_age: "- "}세
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{fontWeight:"bold"}}>메이트 온도</span>&nbsp;&nbsp;&nbsp;&nbsp;{item.mem_score}°</p>
            <p className="sfmsg">신청 메시지</p>
            <div className="sfmsgreal">{item.req_msg}</div>
                
            </div>

            
            
        </div>
    )
}

function MyPageSectionRegist({item}){
    const navigate = useNavigate();

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
        
        <div className="myPageMyPost-section-func" >
            <img className="myPageMyPost-section-img" 
                src={item.perf_img_url ? item.perf_img_url : noImage}
                alt={item.perf_name}/>

            <div className="myPageMyPost-section-content">
                <div className="post-header">
                <span className="myPageMyPost-section-category">{item.cat_name}</span> <span className="myPageMyPost-section-state"
                    style={
                        {backgroundColor: item.mate_status === 1 ? "#A1FFA6" : "#E0E0E0",
                        borderColor: item.mate_status === 1 ? "#40A646" : "#656565",
                        color: item.mate_status === 1? "#40A646" : "#656565"
                    }}>
                    {stateMapRev[item.mate_status]}
                </span>

                <span onClick={() => handleClick(item)} className="toDetailBtn">상세</span>
                <span className="db-state" style={
                        {backgroundColor: "white",
                        borderColor: item.req_stat === 1 ? "#40A646" : item.req_stat === 0? "#656565" : "red",
                        color: item.req_stat === 1? "#40A646" : item.req_stat === 0? "#656565 " : "red"
                    }}>
                    {dbStateMapRev[item.req_stat]}
                </span>
                </div>
                <p className="myPageMyPost-section-title">{item.mate_title}</p>
                
                <table className="mpmp-table">
                    <tbody>
                        <tr className="myPageMyPost-section-body1"><td style={{ width: "53%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}} >공연: {item.perf_name}</td><td style={{width: "47%"}}>장소: {item.perf_loc}</td></tr>
                        <tr className="myPageMyPost-section-body1"><td style={{width: "53%"}}>일시: {slicedDate}</td><td style={{width: "47%"}}>모집 인원: {item.mate_num_of_need} (현재 {item.mate_num_of_confirmed}/{item.mate_num_of_need})</td></tr>
                    </tbody>
                </table>
                    
                
            </div>
        </div>
    )

}

function MyPageMyPosts({myPost}){
    // console.log(myPost);
    return (
        <div>
            {myPost?.length > 0 && myPost.map((item, idx) => (
                
                <MyPageSectionMyPost key={`mpmp${idx}`} item={item} />
            ))}
            {myPost?.length == 0 && (
                <p style={{textAlign:"center"}}>내가 모집한 메이트가 없습니다.</p>
            )}
        </div>
    )
}

function MyPageGet({myGet}){
    return (
        <div>
            {myGet?.length > 0 && myGet.map((item, idx) => (
                <MyPageSectionGet key={`mg${idx}`} item={item} />
            ))}
            {myGet?.length == 0 && (
                <p style={{textAlign:"center"}}>내가 받은 신청이 없습니다.</p>
            )}
        </div>
    )
}

function MyPageRegist({myRegist}){
    return (
        <div>
            {myRegist?.length > 0 && myRegist.map((item, idx) => (
                
                <MyPageSectionRegist key={`mpr${idx}`} item={item} />
            ))}
            {myRegist?.length == 0 && (
                <p style={{textAlign:"center"}}>내가 신청한 메이트가 없습니다.</p>
            )}
        </div>
    )
}

function MyPage(){
    const [myPostList, setMyPost] = useState([]);
    const [myGetList, setMyGet] = useState([]);
    const [myRegistList, setMyRegist] = useState([]);

    const { isAuthenticated, userProfile, logout } = useAuth();
    const [content, setContent] = useState(null);
    const [activeIdx, setActiveIdx] = useState(0);
    
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null); 
    
    // 1. 내가 모집한 메이트 불러오기
    useEffect(() => {
        fetch(myPostURL)
            .then((response) => {
                if (!response.ok) {
                    // throw new Error('Network response was not ok');
                    setContent(<p style={{textAlign:"center"}}>내가 모집한 메이트가 없습니다.</p>)
                    return null;
                }
                // console.log(response);
                return response.json();
            })
            .then((data) => {
                const fetchedPosts = data?.result || [];
            setMyPost(fetchedPosts);
            setLoading(false);

            // 항상 첫 렌더에서 0번 탭 내용만 보여야 함
            if (activeIdx === 0) {
                if (fetchedPosts.length > 0) {
                    setContent(<MyPageMyPosts myPost={fetchedPosts} />);
                } else {
                    setContent(<p style={{ textAlign: "center" }}>내가 모집한 메이트가 없습니다.</p>);
                }
            }

            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);


    // 2. 내가 받은 신청 불러오기
    useEffect(() => {
        fetch(myGetURL)
            .then((response) => {
                if (!response.ok) {
                    // setContent(<p style={{textAlign:"center"}}>내가 받은 신청이 없습니다.</p>)
                    return null;
                }
                // console.log(response);
                return response.json();
            })
            .then((data) => {
                const fetchedPosts = data?.result || [];
                setMyGet(fetchedPosts);
                setLoading(false);
            
            if (activeIdx == 1){
                if (fetchedPosts.length > 0) {
                 setContent(<MyPageGet  myPost={fetchedPosts}/>);
                } else {
                //  setContent(<p style={{textAlign:"center"}}>내가 받은 신청이 없습니다.</p>);
            }}

            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);


    // 3. 내가 신청한 메이트 불러오기
    useEffect(() => {
        fetch(myRegistURL)
            .then((response) => {
                if (!response.ok) {
                    // setContent(<p style={{textAlign:"center"}}>내가 신청한 메이트가 없습니다.</p>)
                    return null;
                }
                // console.log(response);
                return response.json();
            })
            .then((data) => {
                const fetchedPosts = data?.result || [];
                setMyRegist(fetchedPosts);
                setLoading(false);
            
            
            if (activeIdx == 2){
                if (fetchedPosts.length > 0) {
                    setContent(<MyPageRegist  myPost={fetchedPosts}/>);
                } else {
                    //  setContent(<p style={{textAlign:"center"}}>내가 신청한 메이트가 없습니다.</p>);
                }}

            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);
    

    const handleClick = (idx) => {
        setActiveIdx(idx);
        switch (idx) {
        case 0:
            setContent(<MyPageMyPosts  myPost={myPostList}/>);
            break;
        case 1:
            setContent(<MyPageGet myGet={myGetList}/>);
            break;
        case 2:
            setContent(<MyPageRegist myRegist={myRegistList}/>);
            break;
        default:
            setContent(<p style={{textAlign: "center"}}>로딩 중 ...</p>);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    if (!isAuthenticated) {
        return (
            <div className="my-page-container">
                <h1>로그인이 필요합니다.</h1>
            </div>
        );
    }

    let bgc;

    if (userProfile?.mem_score < 10){
        bgc = "#0fae3f";
    }else if(userProfile?.mem_score < 20){
        bgc = "#05ea4a";
    }else if(userProfile?.mem_score < 30){
        bgc = "#40ff00";
    }else if(userProfile?.mem_score < 40){
        bgc = "#fbff00";
    }else if(userProfile?.mem_score < 50){
        bgc = "#ffd900";
    }else if(userProfile?.mem_score < 60){
        bgc = "#ffa600";
    }else if(userProfile?.mem_score < 70){
        bgc = "#ff8800";
    }else if(userProfile?.mem_score < 80){
        bgc = "#ff3c00";
    }else if(userProfile?.mem_score < 90){
        bgc = "#ff1100";
    }else{
        bgc = "#d40f0f";
    }

    const textLen = [myPostList.length, myGetList.length, myRegistList.length]; 
    return(
        <div className="my-page-container">
            <Navigator />

            {/* 1. 헤더 */}
            <div className='header'>
                <p className="head">마이페이지</p>
                <p className="body">회원 정보를 관리하세요.</p>

           </div>

           {/* 2. 양식 */}
           <div className='mypageForm'>
                <div className="mypage-left">
                    <div className='mp-left-box'>
                        <img src={userProfile?.mem_img_url? userProfile.mem_img_url: noProfile}/>
                        <p className="mp-left-box-name">{userProfile?.mem_nn? userProfile.mem_nn : userProfile?.mem_name}</p>
                        <p className="mp-left-box-email">{userProfile?.mem_email}</p>
                
                        <div className="mp-left-mate-temp">
                            <p>메이트 온도 <span style={{fontWeight:"500"}}>{userProfile?.mem_score}°</span></p>
                            <div className="tempBack"></div>
                            <div className="temp"
                                style={{backgroundColor: bgc, width: `${userProfile?.mem_score}%`}}></div>
                        </div>

                        <table>
                            <tbody>
                                <tr><td>연령대</td><td style={{textAlign:"right"}}>{ageMap[userProfile?.mem_age_range]}</td></tr>
                                <tr><td>성별</td><td style={{textAlign:"right"}}>{genderMap[userProfile?.mem_gender]}</td></tr>
                                <tr><td>메이트 횟수</td><td style={{textAlign:"right"}}>{userProfile?.mem_num_of_mates}회</td></tr>
                            </tbody>
                        </table>

                        <button>프로필 수정</button>
                    </div>

                    <table className="left-menu">
                        <tbody>
                            <tr><td style={{color: "white", backgroundColor: "#5409DA", cursor:"default"}}>메뉴</td></tr>
                            <tr><td className={activeIdx === 0 ? "active" : ""} onClick={() => handleClick(0)}>내가 모집한 메이트</td></tr>
                            <tr><td className={activeIdx === 1 ? "active" : ""} onClick={() => handleClick(1)}>내가 받은 신청</td></tr>
                            <tr><td className={activeIdx === 2 ? "active" : ""} onClick={() => handleClick(2)}>내가 신청한 메이트</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="mypage-right">
                    <table>
                        <tbody>
                            <tr>{["내가 모집한 메이트", "내가 받은 신청", "내가 신청한 메이트"].map(
                                (text, idx) => (
                                <td
                                    key={idx}
                                    className={activeIdx === idx ? "mr-boxno active" : "mr-boxno"}
                                    onClick={() => handleClick(idx)}>
                                    <p>{textLen[idx]}</p>
                                    {text}
                                </td>
                                )
                            )}</tr>
                            <tr><td  colSpan={3}>
                                <div className="mr-box" >{content}
                                    </div></td></tr>
                        </tbody>
                    </table>
                </div>
           </div>

        </div>
    )
}

export default MyPage;

import {useState, useEffect} from "react";

import "./DetailPage.css";
import Navigator from "../../components/Navigator/Navigator";
import noImage from '../../assets/images/no-image.png';

const matePostId = 3;
const postURL = `${import.meta.env.VITE_POSTS_URL}/post`;

function Detail(){
    const [dataObj, setDataObj] = useState(null);

    // 1. 백에 요청하기
    const fetchData = async () => {
    try {
        const response = await fetch(`${postURL}/${matePostId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const obj = data?.result?.postDetailDTO || {};
        setDataObj(obj);
    } catch (err) {
        console.error(err);
    }
    };

    useEffect(() => {
    fetchData();
    }, [matePostId]);


    return (
        <div className='detail-page-container'>
            <Navigator/>

            {/* 1. 헤더 */}
            <div className='header'>
                <p className="head">메이트 찾기</p>
                <p className="body">함께 공연을 즐길 메이트를 찾아보세요!</p>
            </div>

            {/* 2. 양식 */}
            <div className='form'>
                <div className='detail-left'>
                    {/* <img src={dataObj.perf_img_url? dataObj.perf_img_url: noImage}/> */}

                </div>

                <div className='detail-right'>

                </div>
            </div>




        </div>
    )
}

export default Detail;
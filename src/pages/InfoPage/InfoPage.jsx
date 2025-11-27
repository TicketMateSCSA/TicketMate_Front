import './InfoPage.css';
import noImage from '../../assets/images/no-image.png';
import Navigator from '../../components/Navigator/Navigator';
import {useEffect, useState} from 'react';

const perfURL = `${import.meta.env.VITE_POSTS_URL}/performances`;

function TransTime({startDate}){
    let dateNtime = "";
    let slicedDate = "(계속)";

    if (startDate){
        dateNtime = startDate.split("T");
        dateNtime[0] = dateNtime[0].split("-").slice(0, 3);
        dateNtime[0] = dateNtime[0][0] + "년 " + dateNtime[0][1] + "월 " + dateNtime[0][2] + "일 "
        slicedDate = dateNtime.slice(0, 1).join(" ");
    }

    return slicedDate;
}

function Section({selectedShow}){
    return (
        <div className="info-section">
            <img className="info-showImage" 
                src={selectedShow?.perf_img_url ? selectedShow.perf_img_url : noImage}
                alt={selectedShow?.perf_name}/>

            <ul className="info-showInfo">
                <li><span className='bold'>공연:</span>&nbsp;&nbsp;&nbsp;{selectedShow?.perf_name}</li>
                <li><span className='bold'>장소:</span>&nbsp;&nbsp;&nbsp;{selectedShow?.perf_loc}</li>
                <li><span className='bold'>기간:</span>&nbsp;&nbsp;&nbsp;<TransTime startDate={selectedShow?.perf_sat}/> ~ <TransTime startDate={selectedShow?.perf_eat}/></li>
                <li><span className='bold'>연령:</span>&nbsp;&nbsp;&nbsp;{selectedShow?.perf_lim_age}세 제한</li>
                <li><span className='bold'>장르:</span>&nbsp;&nbsp;&nbsp;{selectedShow?.cat_name}</li>
            </ul>
        </div>
    )
}

function Info(){
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(perfURL)
        .then((response) => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
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

    return (
        <div className='info-page-container'>
            <Navigator/>

            {/* 1. 헤더 */}
            <div className='header'>
                <p className="head">공연 정보</p>
                <p className="body">어떤 공연이든 열려있어요.</p>
            </div>

            {/* 2. 양식 */}
            <div className='form infoform'>
                {list?.map((item) => (
                    <Section key={item.perf_id} selectedShow={item}/>
    
                ))}

            </div>

        </div>
    )
}

export default Info;
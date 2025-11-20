import './HostPage.css';
import Navigator from "../../components/Navigator/Navigator";


function GetMatePage(){
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
                    <input className="searchShow" type='text' placeholder='공연 검색 또는 선택'></input>
                    {/* input 결과에 따라 이미지 바꾸기 */}
                    {/* <img className="showImage" src='./img'/> */}
                    
                    <div className="showImage">img로 교체 예정</div>

                    {/* input 결과에 따라 정보 변경 예정*/}
                    <ul className="showInfo">
                        <li>공연:</li>
                        <li>장소:</li>
                        <li>기간:</li>
                        <li>연령 제한:</li>
                        <li>장르:</li>
                    </ul>
                </div>

                {/* 2-2. 글 관련 */}
                
                <div className='post'>
                    <p className="title">제목<span className="star">*</span></p>
                    <input className="writeTitle" type='text' placeholder='함께 공연 보실 분 구합니다!'/>
                    
                    <p className="date">관람 날짜<span className="star">*</span></p>
                    <input className="chooseDate" type='date'/>
                    
                    <p className="time">관람 시간<span className="star">*</span></p>
                    <input className="chooseTime" type="time"/>

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

export default GetMatePage ; 
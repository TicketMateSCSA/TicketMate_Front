import './HostPage.css';
import Navigator from "../../components/Navigator/Navigator";


function GetMatePage(){
    return(
        <div className="host-page-container">
            <Navigator/>
        

            {/* 1. 헤더 */}
            <div class='header'>
                <p class="head">메이트 모집하기</p>
                <p class="body">함께 공연을 즐길 메이트를 모집해볼까요?</p>

                <button class="save">임시저장</button>
                <button class="post">등록하기</button>
            </div>
            
            {/* 2. 양식 */}
            <div class='form'>
                {/* 2-1. 공연 관련 */}
                <div class='show'>
                    <p class="chooseShow">공연 선택<span class="star">*</span></p>
                    <input class="searchShow" type='text' placeholder='공연 검색 또는 선택'></input>
                    {/* input 결과에 따라 이미지 바꾸기 */}
                    {/* <img class="showImage" src='./img'/> */}
                    
                    <div class="showImage">img로 교체 예정</div>

                    {/* input 결과에 따라 정보 변경 예정*/}
                    <ul class="showInfo">
                        <li>공연:</li>
                        <li>장소:</li>
                        <li>기간:</li>
                        <li>연령 제한:</li>
                        <li>장르:</li>
                    </ul>
                </div>

                {/* 2-2. 글 관련 */}
                
                <div class='post'>
                    <p class="title">제목<span class="star">*</span></p>
                    <input class="writeTitle" type='text' placeholder='함께 공연 보실 분 구합니다!'/>
                    
                    <p class="date">관람 날짜<span class="star">*</span></p>
                    <input class="chooseDate" type='date'/>
                    
                    <p class="time">관람 시간<span class="star">*</span></p>
                    <input class="chooseTime" type="time"/>

                    <p class="peopleNum">모집 인원<span class="star">*</span></p>
                    <input class="choosePeopleNum" type='number' min={1} placeholder='인원 수'></input>
                
                    <p class="like">선호 조건</p>

                    <p class="age">연령대</p>
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

                    
                    <p class="gender">성별</p>
                        <div className="btn-group2">
                            <input type="radio" id="btn7" name="select2" defaultChecked/>
                            <label htmlFor="btn7">무관</label>

                            <input type="radio" id="btn8" name="select2" />
                            <label htmlFor="btn8">남성</label>

                            <input type="radio" id="btn9" name="select2" />
                            <label htmlFor="btn9">여성</label>
                        </div>
                
                    <p class="meetLocTime">만남 장소/시간<span class="star">*</span></p>
                    <input class="writeMeetLT" type="text" placeholder='공연장 입구에서, 공연 시작 30분 전에!'/>

                    <p class="message">상세 내용</p>
                    <textarea class="writeMessage" rows="10" placeholder="메이트에게 전하고 싶은 내용을 작성해주세요.
매칭된 메이트와 연락할 수단(오픈채팅, 연락처)이 필요하다면, 이곳에 작성해도 좋아요."/>

                    <p class="tag">태그</p>
                    <input class="writeTag" placeholder='#태그1 #태그2 #태그3'/>

                    
                </div>

            <p class="warning1"><span class="star">*</span> 표시된 항목은 필수 입력 사항입니다.</p>
            <p class="warning2">허위 정보나 부적절한 내용은 삭제될 수 있습니다.</p>
                
            </div>

            
        </div>
    )
}

export default GetMatePage ; 
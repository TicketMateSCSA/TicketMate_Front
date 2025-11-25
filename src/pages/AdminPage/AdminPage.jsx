import "./AdminPage.css";

function AdminPage(){
    return (
        <div className='admin-page-container'>
            <header class="admin-header">
                <div class="profile-box">
                    <div class="profile-img"></div>
                    <div class="profile-info">
                        <div class="profile-name">관리자</div>
                        <div class="profile-email">admin@test.com</div>
                        <div class="profile-role">인사팀 주임</div>
                    </div>
                </div>

                <div class="status-box">
                    <div class="status-item">전체 회원: <span>1234</span></div>
                    <div class="status-item">신규 가입: <span>12</span></div>
                    <div class="status-item">전체 게시글: <span>2341</span></div>
                    <div class="status-item warning">미처리 신고: <span>31</span></div>
                </div>
            </header>

            <main>
                <section class="section-box">
                    <div class="section-title">게시글 관리</div>

                    <div class="tab-menu">
                        <button class="tab active">전체</button>
                        <button class="tab">신고글</button>
                        <button class="tab">삭제글</button>

                        <div class="search-box">
                            <input type="text" placeholder="검색어 입력"/>
                            <button class="btn-search">검색</button>
                        </div>
                    </div>

                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>분류</th>
                                <th>제목</th>
                                <th>작성자</th>
                                <th>신고수</th>
                                <th>작성일</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>156</td>
                                <td>뮤지컬</td>
                                <td>레미제라블 같이 보실 분?</td>
                                <td>미니멈123</td>
                                <td>-</td>
                                <td>2025.11.12</td>
                                <td class="btn-group">
                                    <button class="btn blue">상세</button>
                                    <button class="btn red">삭제</button>
                                </td>
                            </tr>

                            <tr>
                                <td>157</td>
                                <td>콘서트</td>
                                <td>김동률 콘서트 가실 분 구해요!!</td>
                                <td>김동률</td>
                                <td>6</td>
                                <td>2025.11.13</td>
                                <td class="btn-group">
                                    <button class="btn blue">상세</button>
                                    <button class="btn red">삭제</button>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </section>

                <section class="section-box">
                    <div class="section-title">회원 관리</div>

                    <div class="tab-menu">
                        <button class="tab active">전체</button>
                        <button class="tab">블랙리스트</button>

                        <div class="search-box">
                            <input type="text" placeholder="닉네임 또는 이메일 입력"/>
                            <button class="btn-search">검색</button>
                        </div>
                    </div>

                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>닉네임</th>
                                <th>이메일</th>
                                <th>신고수</th>
                                <th>블랙 여부</th>
                                <th>사유</th>
                                <th>등록일</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>201</td>
                                <td>윤용한</td>
                                <td>dbswjd@abc.com</td>
                                <td>-</td>
                                <td>X</td>
                                <td>-</td>
                                <td>2025.11.10</td>
                                <td class="btn-group">
                                    <button class="btn blue">상세</button>
                                    <button class="btn red">추가</button>
                                </td>
                            </tr>

                            <tr>
                                <td>202</td>
                                <td>최득섭</td>
                                <td>chithdcmf@abc.com</td>
                                <td>9</td>
                                <td>O</td>
                                <td>욕설 및 비방</td>
                                <td>2025.11.13</td>
                                <td class="btn-group">
                                    <button class="btn blue">상세</button>
                                    <button class="btn red">해제</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </main>
    </div>
    )
}

export default AdminPage;
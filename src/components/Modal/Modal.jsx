import "./Modal.css";
import { useState } from "react";

const reportPostURL = `${import.meta.env.VITE_POSTS_URL}/report/user`;

export const Modal = ({ userId, openModal, setOpenModal }) => { // props를 전달받는다.
  const [reportCont, setReportCont] = useState(null);

  const handleReport = async () => {
    if (!reportCont) alert("신고 사유를 작성해주세요.");
    else{
      if (!window.confirm("정말 신고할까요?")) return;

      try {
        const response = await fetch(reportPostURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                m_rep_mem_id2: userId,
                m_rep_cont: reportCont
            }),
        });

        const data = await response.json(); // 실제 결과를 여기서 한 번만 꺼냄

        if (!response.ok || data.code === "COMMON401") {
            // 인증 필요 등 에러 처리
            alert(data.message);
            window.location.reload();
            return;
        }

        // 성공 처리
        alert("신고 완료되었습니다.");
        window.location.reload();

    } catch (err) {
        console.error(err);
        alert("서버 오류로 신고하지 못했습니다.");
    }
    }
}

  return (
    <div className="Overlay">
      <div className="cart-container">
        
        <span className="product-name">회원 신고 사유<span className="star">*</span></span>
        <textarea className="product-reason" 
          placeholder="회원 신고 사유를 작성해주세요."
          onChange={(e) => {setReportCont(e.target.value)}}/>
        <button
          className="cancle"
          type="button"
          onClick={() => {
            setOpenModal(false); // 클릭 이벤트로 모달창 닫히게 하기
          }}
        >
          취소
        </button>
        {!openModal ? setOpenModal(true) : null}
        <button className="add-cart" type="button" onClick={handleReport}>
          신고하기
        </button>
      </div>
    </div>
  );
};
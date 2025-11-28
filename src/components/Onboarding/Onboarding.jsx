import { useState } from "react";
import "./Onboarding.css";

const slides = [
  {
    title: <>🎉Welcome to Ticket Mate.🎉</>,
    desc: <>상단의 파란색 바에 주목해주세요!<br/>왼쪽부터, 버튼들에 대해 설명해드릴게요.</>
  },
  {
    title: <>👾홈👾</>,
    desc: <>메인 페이지예요. <br/>예쁘죠?</>
  },
  {
    title: <>😁메이트 찾기😁</>,
    desc: <>익명의 메이트가 당신과 공연을 보러가고 싶대요!<br/>마음에 드는 공연과 메이트를 찾아보세요.<br/><span className="smallsmall">P.S. 상단 파란색 바 위의 검색창으로도 검색할 수 있다는 사실!</span></>
  },
  {
    title: <>❤‍🔥메이트 모집하기❤‍🔥</>,
    desc: <>당신이 호스트가 되어 메이트를 모집할 수 있어요!<br/>원하는 공연을 선택해서 시작해보세요.</>
  },
  {
    title: <>🎫공연 정보🎫</>,
    desc: <>당신의 취향을 저격할 공연들을 훑어보세요.<br/>&nbsp;</>
  },
  {
    title: <>🍀로그인🍀</>,
    desc: <>메이트 신청하기, 메이트 모집하기 기능을 이용하려면 로그인이 필요해요.<br/>로그인 후에는 마이페이지에도 접근 가능해요.</>
  },
  {
    title: <>🩵 회원가입🩵</>,
    desc: <>회원가입부터! TickMate. 시작해볼까요?<br/> </>
  }

];

export default function OnBoarding({ onClose }) {
  const [step, setStep] = useState(0);

  const next = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  // step이 0이면 진한 반투명, 아니면 투명 배경
  const overlayClass = step === 0 ? "onboard-overlay" : "onboard-overlay transparent";

  return (
        <div className={overlayClass}>
            <div className="onboard-content">
                <h1>{slides[step].title}</h1>
                <p>{slides[step].desc}</p>

                <div className="onboard-indicators">
                {slides.map((_, i) => (
                    <span key={i} className={`dot ${i === step ? "active" : ""}`} />
                ))}
                </div>

                <button className="onboard-btn" onClick={next}>
                {step === slides.length - 1 ? "시작하기" : "다음"}
                </button>
            </div>
        </div>
    
  );
}

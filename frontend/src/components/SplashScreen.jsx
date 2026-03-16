import { useState, useRef, useEffect, useCallback } from 'react';

const PULL_THRESHOLD = 60;  // 이 거리(px) 이상 당기면 점등
const STRING_LENGTH = 90;   // 줄 길이 (px)

export default function SplashScreen({ onFinish }) {
  const [phase, setPhase] = useState('idle'); // idle | lighting | done

  // 애니메이션 상태값들
  const [pullY, setPullY] = useState(0);          // 줄이 당겨진 거리
  const [lampSwing, setLampSwing] = useState(0);  // 램프 기울기 각도
  const [lightRadius, setLightRadius] = useState(0); // 빛 원 크기
  const [lightOpacity, setLightOpacity] = useState(0);
  const [darkOpacity, setDarkOpacity] = useState(1);  // 어둠 오버레이
  const [textOpacity, setTextOpacity] = useState(0);  // 슬로건 텍스트

  const triggered = useRef(false);  // 점등이 이미 시작됐는지
  const isDragging = useRef(false); // 지금 줄을 드래그 중인지
  const startClientY = useRef(0);   // 드래그 시작 Y 좌표
  const animRef = useRef(null);     // requestAnimationFrame ID

  // 화면 크기 기준 램프 위치
  const lampX = window.innerWidth / 2;
  const lampY = window.innerHeight * 0.22;

  // -----------------------------------------------
  // 점등 애니메이션 시작
  // -----------------------------------------------
  const startLightAnimation = useCallback(() => {
    triggered.current = true;
    setPhase('lighting');
    setPullY(0); // 줄 원위치

    // 램프 흔들림 (순서대로 실행)
    const swings = [
      { val: 8,  delay: 0   },
      { val: -8, delay: 150 },
      { val: 5,  delay: 350 },
      { val: -3, delay: 500 },
      { val: 0,  delay: 650 },
    ];
    swings.forEach(({ val, delay }) => {
      setTimeout(() => setLampSwing(val), delay);
    });

    // 빛 퍼짐 애니메이션 (requestAnimationFrame으로 부드럽게)
    const startTime = performance.now();
    const duration = 2200; // 빛이 퍼지는 시간 (ms)

    setLightOpacity(1); // 빛 즉시 등장

    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // easeOut: 처음엔 빠르게, 나중엔 서서히
      const eased = 1 - Math.pow(1 - progress, 2);

      setLightRadius(eased * window.innerHeight * 1.2);
      setDarkOpacity(Math.max(0, 1 - progress * 1.15));

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        // 빛이 다 퍼지면 → 텍스트 페이드인
        setTimeout(() => {
          setTextOpacity(1);
          // 텍스트 등장 후 → 1.5초 뒤 메인 앱으로
          setTimeout(() => {
            setPhase('done');
            onFinish && onFinish();
          }, 1500);
        }, 300);
      }
    };

    animRef.current = requestAnimationFrame(animate);
  }, [onFinish]);

  // -----------------------------------------------
  // 드래그 시작 (마우스/터치)
  // -----------------------------------------------
  const handleDragStart = useCallback((e) => {
    if (triggered.current) return;

    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;

    // 줄 영역 근처인지 확인
    const stringTopY = lampY + 70;
    const stringBotY = lampY + 70 + STRING_LENGTH + 30;

    if (
      Math.abs(clientX - lampX) < 40 &&
      clientY >= stringTopY - 20 &&
      clientY <= stringBotY + 20
    ) {
      isDragging.current = true;
      startClientY.current = clientY;
    }
  }, [lampX, lampY]);

  // -----------------------------------------------
  // 드래그 중 (마우스/터치)
  // -----------------------------------------------
  const handleDragMove = useCallback((e) => {
    if (!isDragging.current || triggered.current) return;

    const clientY = e.clientY ?? e.touches?.[0]?.clientY;
    const dy = Math.max(0, Math.min(clientY - startClientY.current, 120));
    setPullY(dy);

    // 임계값 이상 당기면 점등!
    if (dy >= PULL_THRESHOLD) {
      isDragging.current = false;
      startLightAnimation();
    }
  }, [startLightAnimation]);

  // -----------------------------------------------
  // 드래그 끝 (손/마우스를 뗐을 때)
  // -----------------------------------------------
  const handleDragEnd = useCallback(() => {
    if (isDragging.current && !triggered.current) {
      isDragging.current = false;
      setPullY(0); // 줄 원위치
    }
  }, []);

  // 전역 마우스/터치 이벤트 등록
  useEffect(() => {
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchmove', handleDragMove, { passive: true });
    window.addEventListener('touchend', handleDragEnd);
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [handleDragMove, handleDragEnd]);

  const lightSize = lightRadius * 2;

  return (
    <div
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: '#0a0a0f',
        overflow: 'hidden',
        userSelect: 'none',
        cursor: isDragging.current ? 'grabbing' : 'default',
      }}
    >

      {/* ── 빛 원형 퍼짐 ── */}
      <div style={{
        position: 'absolute',
        width: lightSize,
        height: lightSize,
        borderRadius: '50%',
        backgroundColor: '#fff8e1',
        opacity: lightOpacity * 0.22,
        top: lampY + 30,
        left: lampX,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        transition: 'opacity 0.4s',
      }} />

      {/* ── 어둠 오버레이 ── */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundColor: '#0a0a0f',
        opacity: darkOpacity,
        pointerEvents: 'none',
        transition: 'opacity 0.1s',
      }} />

      {/* ── 램프 전체 (흔들림 기준점: 상단 중앙) ── */}
      <div style={{
        position: 'absolute',
        left: lampX,
        top: 0,
        transform: `translateX(-50%) rotate(${lampSwing}deg)`,
        transformOrigin: 'top center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: lampSwing !== 0 ? 'transform 0.15s ease' : 'transform 0.2s ease',
      }}>

        {/* 천장 연결 선 */}
        <div style={{
          width: 2,
          height: lampY - 10,
          backgroundColor: '#888',
        }} />

        {/* 램프 위쪽 작은 부분 */}
        <div style={{
          width: 20, height: 10,
          backgroundColor: '#b8860b',
          borderRadius: '4px 4px 0 0',
        }} />

        {/* 램프 갓 (사다리꼴 모양) */}
        <div style={{
          width: 60, height: 50,
          backgroundColor: '#d4a017',
          borderRadius: '4px 4px 30px 30px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: phase !== 'idle' ? '0 0 30px 10px rgba(255,240,150,0.3)' : 'none',
          transition: 'box-shadow 0.4s',
        }}>
          {/* 전구 발광 효과 */}
          {phase !== 'idle' && (
            <div style={{
              position: 'absolute',
              width: 80, height: 80, borderRadius: '50%',
              backgroundColor: '#fffde7',
              opacity: lightOpacity,
              transition: 'opacity 0.4s',
            }} />
          )}
          {/* 전구 */}
          <div style={{
            position: 'relative', zIndex: 1,
            width: 18, height: 24,
            borderRadius: '9px',
            backgroundColor: '#fffbcc',
            border: '1px solid #e0c040',
          }} />
        </div>

        {/* 줄 (드래그로 아래로 당겨짐) */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          transform: `translateY(${pullY}px)`,
          transition: isDragging.current ? 'none' : 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          cursor: 'grab',
        }}>
          <div style={{ width: 2, height: STRING_LENGTH, backgroundColor: '#aaa' }} />
          {/* 매듭 */}
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ccc', marginTop: -2 }} />
        </div>
      </div>

      {/* ── 안내 텍스트 (idle 단계) ── */}
      {phase === 'idle' && (
        <div style={{
          position: 'absolute',
          bottom: '25%', left: 0, right: 0,
          textAlign: 'center',
          color: 'rgba(255,255,255,0.3)',
          fontSize: '14px', letterSpacing: '2px',
          animation: 'pulse 2s ease-in-out infinite',
        }}>
          줄을 당겨보세요
        </div>
      )}

      {/* ── 슬로건 텍스트 (점등 완료 후) ── */}
      <div style={{
        position: 'absolute',
        bottom: '28%', left: 0, right: 0,
        textAlign: 'center',
        color: '#fff8e1',
        fontSize: '24px', fontWeight: '300',
        lineHeight: '1.7', letterSpacing: '1.5px',
        opacity: textOpacity,
        transition: 'opacity 0.8s ease',
        pointerEvents: 'none',
      }}>
        산책 끝에서 만난<br />순간들을 남겨보세요
      </div>

      {/* pulse 애니메이션 CSS */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

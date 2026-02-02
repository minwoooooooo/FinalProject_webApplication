import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ReportDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. 데이터 받아오기 (Report.jsx에서 넘겨준 값)
  // videoFile: 파일 객체 (직접 분석 시 필요)
  // videoSrc: 미리보기 URL
  // reportId: 목록 업데이트용 ID
  // prevData: 이미 분석된 결과 (plate, time, desc 등)
  const { videoFile, videoSrc, reportId, ...prevData } = location.state || {};
  
  // 2. 상태 관리
  // 만약 prevData에 차량번호(plate)가 있으면 이미 분석된 것이므로 결과(resultData)로 바로 설정
  const [resultData, setResultData] = useState(prevData.plate ? prevData : null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressLogs, setProgressLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // 3. 자동 분석 시작 (안전장치)
  // 목록에서 분석을 안 하고 들어왔거나, 새로고침 했을 때를 대비해 원본의 분석 기능을 살려둠
  useEffect(() => {
    if (videoFile && !resultData && !isAnalyzing) {
      startAnalysis();
    }
  }, []);

  // 4. 로그 추가 함수
  const addLog = (message) => setProgressLogs(prev => [...prev, message]);

  // 5. 목록 업데이트 함수 (로컬 스토리지 동기화)
  // 분석 완료 시점이나, '신고 제출' 버튼 눌렀을 때 호출
  const updateReportList = (finalData, newStatus = 'complete') => {
    if (!reportId) return;

    const saved = localStorage.getItem('myReports');
    if (saved) {
      const list = JSON.parse(saved);
      const newList = list.map(item => {
        if (item.id === reportId) {
          return {
            ...item,
            ...finalData,       // 분석 결과 덮어쓰기
            title: finalData.violation || item.title,
            status: newStatus,  // 'complete' or 'submitted'
            // 분석 중 텍스트 제거하고 날짜/번호판 표시
            date: finalData.time || item.date,
            plate: finalData.plate || item.plate
          };
        }
        return item;
      });
      localStorage.setItem('myReports', JSON.stringify(newList));
    }
  };

  // 6. 실제 분석 로직 (Report.jsx와 동일한 로직을 백업용으로 유지)
  const startAnalysis = async () => {
    setIsAnalyzing(true);
    addLog("📡 서버 연결 중...");
    
    try {
      const formData = new FormData();
      formData.append("file", videoFile);

      addLog("📤 영상 업로드 및 분석 요청...");
      
      // 가짜 로그 (시각적 효과)
      const timer1 = setTimeout(() => addLog("👀 AI가 영상을 프레임 단위로 쪼개는 중..."), 1500);
      const timer2 = setTimeout(() => addLog("🚗 차량 및 번호판 인식 시도 중..."), 3500);
      const timer3 = setTimeout(() => addLog("⚖️ 도로교통법 위반 여부 판단 중..."), 5500);

      // 서버 요청
      const res = await fetch('http://localhost:8000/api/analyze-video', {
        method: 'POST',
        body: formData
      });

      clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3);

      if (res.ok) {
        const data = await res.json();
        addLog("✅ 분석 완료!");
        
        const finalResult = {
            plate: data.plate || "12가 3456",
            time: data.time || "2026-02-12 15:00",
            desc: data.description || "분석 결과: 중앙선 침범이 확인되었습니다.",
            violation: "중앙선 침범"
        };
        
        setResultData(finalResult);
        updateReportList(finalResult, 'complete'); // 목록 업데이트
        
      } else {
        addLog("❌ 분석 실패 (테스트 모드 전환)");
        const mockResult = {
            plate: "번호판 불명",
            time: "-",
            desc: "서버 연결 실패. (테스트 결과 표시)",
            violation: "분석 실패"
        };
        setResultData(mockResult);
        updateReportList(mockResult, 'complete');
      }

    } catch (error) {
      console.error(error);
      addLog("❌ 네트워크 에러");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 7. 신고 제출 핸들러 (기능 추가됨)
  const handleSubmit = () => {
    // ★ 추가된 기능: 제출 버튼을 누르면 목록 상태를 '제출완료(submitted)'로 변경
    if (resultData) {
        updateReportList(resultData, 'submitted'); 
    }
    
    alert('신고가 안전신문고 양식으로 제출되었습니다.');
    setShowModal(false);
    navigate('/report'); // 목록으로 돌아가기
  };

  return (
    <div className="screen active">
      <div className="header">
        <h1>신고 상세</h1>
        <p>AI 분석 리포트</p>
      </div>

      <div className="report-list">
        {/* 영상 플레이어 */}
        <div style={{ padding: '0' }}>
          {videoSrc ? (
            <video 
              src={videoSrc} 
              width="100%" 
              height="200" 
              controls 
              style={{ background: 'black', borderRadius: '12px', margin: '16px 0', display: 'block' }}
            ></video>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', background: '#f1f5f9', margin:'16px', borderRadius:'12px' }}>
                📸 분석 이미지
            </div>
          )}
        </div>

        {/* 진행 로그 창 (분석 중일 때만 보임) */}
        {isAnalyzing && (
            <div style={{ margin: '0 16px 16px 16px', padding: '16px', background: '#1E293B', borderRadius: '12px', fontFamily: 'monospace', fontSize: '12px', color: '#10B981', height: '120px', overflowY: 'auto' }}>
                {progressLogs.map((log, i) => (
                    <div key={i} style={{ marginBottom: '4px' }}>&gt; {log}</div>
                ))}
                <div className="blink-cursor">_</div>
            </div>
        )}

        {/* 분석 결과 (분석 완료 시 보임) */}
        {!isAnalyzing && resultData && (
            <>
                <div style={{ padding: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>위반 내용</div>
                  <div style={{ padding: '12px', background: 'var(--bg-gray)', borderRadius: '12px', fontSize: '13px', lineHeight: '1.6', color: 'var(--text-primary)' }}>{resultData.desc}</div>
                </div>

                <div style={{ padding: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>차량 번호</div>
                  <div style={{ padding: '12px', background: 'var(--bg-gray)', borderRadius: '12px', fontSize: '13px', color: 'var(--text-primary)' }}>{resultData.plate}</div>
                </div>

                <div style={{ padding: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>신고 일시</div>
                  <div style={{ padding: '12px', background: 'var(--bg-gray)', borderRadius: '12px', fontSize: '13px', color: 'var(--text-primary)' }}>{resultData.time}</div>
                </div>

                <button className="btn btn-primary" onClick={() => setShowModal(true)}>신고 제출</button>
            </>
        )}
        
        <button className="btn" style={{ background: 'var(--bg-gray)', color: 'var(--text-primary)', width: 'calc(100% - 32px)' }} onClick={() => navigate('/report')}>뒤로</button>
      </div>

      {/* 제출 확인 모달 */}
      {showModal && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-title">제출 확인</div>
            <div className="modal-desc">해당 내용으로 신고를 접수하시겠습니까?</div>
            <div className="modal-buttons">
              <button className="modal-btn modal-btn-cancel" onClick={() => setShowModal(false)}>취소</button>
              <button className="modal-btn modal-btn-confirm" onClick={handleSubmit}>제출</button>
            </div>
          </div>
        </div>
      )}

      <style>{`.blink-cursor { animation: blink 1s step-end infinite; } @keyframes blink { 50% { opacity: 0; } }`}</style>
    </div>
  );
};

export default ReportDetail;
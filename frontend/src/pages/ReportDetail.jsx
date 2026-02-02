import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ReportDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { videoFile, videoSrc, reportId, ...prevData } = location.state || {};
  
  const [resultData, setResultData] = useState(prevData.plate ? prevData : null);
  const [detailContent, setDetailContent] = useState(''); // 상세 내용 (초안)
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressLogs, setProgressLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const addLog = useCallback((message) => {
    setProgressLogs(prev => [...prev, message]);
  }, []);

  // 목록 업데이트
  const updateReportList = useCallback((finalData, newStatus = 'complete') => {
    if (!reportId) return;

    const saved = localStorage.getItem('myReports');
    if (saved) {
      const list = JSON.parse(saved);
      const newList = list.map(item => {
        if (item.id === reportId) {
          return {
            ...item,
            ...finalData,
            title: finalData.violation || item.title,
            status: newStatus,
            date: finalData.time || item.date,
            plate: finalData.plate || item.plate,
            detailContent: finalData.detailContent || item.detailContent
          };
        }
        return item;
      });
      localStorage.setItem('myReports', JSON.stringify(newList));
    }
  }, [reportId]);

  const startAnalysis = useCallback(async () => {
    if (!videoFile) return;

    setIsAnalyzing(true);
    addLog("📡 서버 연결 중...");
    
    try {
      const formData = new FormData();
      formData.append("file", videoFile);

      addLog("📤 영상 업로드 및 분석 요청...");
      
      const timer1 = setTimeout(() => addLog("👀 AI가 영상을 프레임 단위로 쪼개는 중..."), 1500);
      const timer2 = setTimeout(() => addLog("🚗 차량 및 번호판 인식 시도 중..."), 3500);
      const timer3 = setTimeout(() => addLog("⚖️ 도로교통법 위반 여부 판단 중..."), 5500);
      const timer4 = setTimeout(() => addLog("📝 LLM이 신고 초안을 작성하는 중..."), 7000);

      const res = await fetch('http://localhost:8000/api/analyze-video', {
        method: 'POST',
        body: formData
      });

      clearTimeout(timer1); 
      clearTimeout(timer2); 
      clearTimeout(timer3);
      clearTimeout(timer4);

      if (res.ok) {
        const data = await res.json();
        addLog("✅ 분석 완료!");
        
        console.log("📦 서버 응답 데이터:", aiGeneratedDraft); // 디버깅용
        setDetailContent(aiGeneratedDraft);
        
        // ★ 핵심: 백엔드에서 받은 ai_report를 상세 내용으로 사용
        const aiGeneratedDraft = data.ai_report || `[AI 자동 생성 초안]

위반 행위: ${data.result || '위반 감지'}
차량 번호: ${data.plate || '식별불가'}
발생 일시: ${data.time || new Date().toLocaleString()}

상세 내용:
해당 차량이 ${data.result || '교통법규 위반'} 행위를 하는 것을 목격하였습니다. 
영상 증거를 첨부하오니 확인 부탁드립니다.

※ 위 내용은 AI가 자동으로 작성한 초안입니다. 수정 후 제출해주세요.`;

        const finalResult = {
            plate: data.plate || "식별불가",
            time: data.time || new Date().toLocaleString(), 
            desc: data.result || "위반 사항이 감지되지 않았습니다.",
            violation: data.result ? data.result.split('(')[0].trim() : "위반 감지",
            detailContent: aiGeneratedDraft
        };
        
        setResultData(finalResult);
        setDetailContent(aiGeneratedDraft);
        updateReportList(finalResult, 'complete');
        
      } else {
        addLog("❌ 분석 실패");
        const mockResult = {
            plate: "식별불가",
            time: new Date().toLocaleString(),
            desc: "서버 연결 실패. (네트워크 오류)",
            violation: "분석 실패",
            detailContent: "서버 연결 실패로 인해 초안을 생성할 수 없습니다."
        };
        setResultData(mockResult);
        setDetailContent(mockResult.detailContent);
        updateReportList(mockResult, 'complete');
      }

    } catch (error) {
      console.error(error);
      addLog("❌ 네트워크 에러");
      
      // 에러 발생 시에도 빈 초안 제공
      const errorResult = {
          plate: "식별불가",
          time: new Date().toLocaleString(),
          desc: "네트워크 오류",
          violation: "분석 실패",
          detailContent: "네트워크 오류로 인해 초안을 생성할 수 없습니다. 수동으로 작성해주세요."
      };
      setResultData(errorResult);
      setDetailContent(errorResult.detailContent);
      
    } finally {
      setIsAnalyzing(false);
    }
  }, [videoFile, addLog, updateReportList]);

  // 자동 실행
  useEffect(() => {
    if (videoFile && !resultData && !isAnalyzing) {
      startAnalysis();
    }
  }, [videoFile, resultData, isAnalyzing, startAnalysis]);

  // 기존 데이터가 있으면 상세 내용 로드
  useEffect(() => {
    if (prevData.detailContent) {
      setDetailContent(prevData.detailContent);
    }
  }, [prevData.detailContent]);

  const handleSubmit = () => {
    if (resultData) {
        const updatedData = {
          ...resultData,
          detailContent: detailContent
        };
        updateReportList(updatedData, 'submitted'); 
    }
    alert('신고가 안전신문고 양식으로 제출되었습니다.');
    setShowModal(false);
    navigate('/report');
  };

  return (
    <div className="screen active">
      <div className="header">
        <h1>📄 신고 상세</h1>
        <p>AI 분석 리포트</p>
      </div>

      <div className="report-list">
        <div style={{ padding: '0' }}>
          {videoSrc ? (
            <video 
              src={videoSrc} 
              width="100%" 
              height="220" 
              controls 
              style={{ 
                background: 'var(--bg-dark)', 
                borderRadius: 'var(--radius-lg)', 
                margin: '20px', 
                width: 'calc(100% - 40px)',
                display: 'block',
                boxShadow: 'var(--shadow-md)'
              }}
            ></video>
          ) : (
            <div style={{ 
              padding: '40px', 
              textAlign: 'center', 
              background: 'var(--bg-tertiary)', 
              margin:'20px', 
              borderRadius:'var(--radius-lg)',
              border: '2px dashed var(--border-medium)'
            }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>📸</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  분석 영상
                </div>
            </div>
          )}
        </div>

        {isAnalyzing && (
            <div style={{ 
              margin: '0 20px 20px 20px', 
              padding: '20px', 
              background: 'var(--bg-dark)', 
              borderRadius: 'var(--radius-lg)', 
              fontFamily: 'monospace', 
              fontSize: '13px', 
              color: 'var(--success-green)', 
              height: '160px', 
              overflowY: 'auto',
              boxShadow: 'var(--shadow-md)'
            }}>
                {progressLogs.map((log, i) => (
                    <div key={i} style={{ marginBottom: '6px', lineHeight: '1.6' }}>&gt; {log}</div>
                ))}
                <div className="blink-cursor">_</div>
            </div>
        )}

        {!isAnalyzing && resultData && (
            <>
                <div style={{ padding: '20px' }}>
                  <div style={{ 
                    fontSize: '13px', 
                    fontWeight: '600', 
                    color: 'var(--text-secondary)', 
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>위반 내용</div>
                  <div style={{ 
                    padding: '16px', 
                    background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)', 
                    borderRadius: 'var(--radius-lg)', 
                    fontSize: '14px', 
                    lineHeight: '1.8', 
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-light)',
                    fontWeight: '500'
                  }}>{resultData.desc}</div>
                </div>

                <div style={{ padding: '0 20px 20px 20px' }}>
                  <div style={{ 
                    fontSize: '13px', 
                    fontWeight: '600', 
                    color: 'var(--text-secondary)', 
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>차량 번호</div>
                  <div style={{ 
                    padding: '16px', 
                    background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)', 
                    borderRadius: 'var(--radius-lg)', 
                    fontSize: '18px', 
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-light)',
                    fontWeight: '700',
                    textAlign: 'center',
                    letterSpacing: '2px'
                  }}>{resultData.plate}</div>
                </div>

                <div style={{ padding: '0 20px 20px 20px' }}>
                  <div style={{ 
                    fontSize: '13px', 
                    fontWeight: '600', 
                    color: 'var(--text-secondary)', 
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>신고 일시</div>
                  <div style={{ 
                    padding: '16px', 
                    background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)', 
                    borderRadius: 'var(--radius-lg)', 
                    fontSize: '14px', 
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-light)',
                    fontWeight: '600'
                  }}>
                    {resultData.time}
                  </div>
                </div>

                {/* 상세 내용 (초안 작성) - 수정 가능 */}
                <div style={{ padding: '0 20px 20px 20px' }}>
                  <div style={{ 
                    fontSize: '13px', 
                    fontWeight: '600', 
                    color: 'var(--text-secondary)', 
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>상세 내용 (초안)</span>
                    <span style={{ 
                      fontSize: '10px', 
                      background: 'var(--warning-light)', 
                      color: 'var(--warning-orange)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: '700'
                    }}>수정 가능</span>
                  </div>
                  <textarea
                    value={detailContent}
                    onChange={(e) => setDetailContent(e.target.value)}
                    style={{ 
                      width: '100%',
                      minHeight: '200px',
                      padding: '16px', 
                      background: 'var(--bg-primary)', 
                      borderRadius: 'var(--radius-lg)', 
                      fontSize: '13px', 
                      lineHeight: '1.8', 
                      color: 'var(--text-primary)',
                      border: '2px solid var(--border-light)',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary-blue)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                    placeholder="상세 내용을 입력하세요..."
                  />
                  <div style={{ 
                    fontSize: '11px', 
                    color: 'var(--text-tertiary)', 
                    marginTop: '8px',
                    fontStyle: 'italic'
                  }}>
                    💡 Tip: AI가 생성한 초안을 자유롭게 수정하여 더 정확한 신고서를 작성할 수 있습니다.
                  </div>
                </div>

                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                  신고 제출하기
                </button>
            </>
        )}
        
        <button 
          className="btn" 
          style={{ 
            background: 'var(--bg-tertiary)', 
            color: 'var(--text-primary)', 
            width: 'calc(100% - 40px)',
            border: '1px solid var(--border-light)'
          }} 
          onClick={() => navigate('/report')}
        >
          목록으로 돌아가기
        </button>
      </div>

      {showModal && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-title">✅ 제출 확인</div>
            <div className="modal-desc">
              해당 내용으로 신고를 접수하시겠습니까?<br/>
              제출 후에는 수정이 불가능합니다.
            </div>
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

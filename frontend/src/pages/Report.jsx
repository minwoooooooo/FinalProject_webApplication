import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Report = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  
  // 초기 상태 로드
  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem('myReports');
    const parsed = saved ? JSON.parse(saved) : [
      {
        id: 1,
        title: '신호 위반',
        date: '2026-02-12 14:32',
        plate: '12가 3456',
        status: 'complete',
        desc: '적색 신호에 교차로 진입함.'
      }
    ];

    return parsed.map(item => {
        if (item.status === 'processing') {
            return {
                ...item,
                status: 'error',
                progressMsg: '분석 중단됨 (재시도 필요)',
                title: '분석 취소됨'
            };
        }
        return item;
    });
  });

  // 상태 변경 시 로컬 스토리지 저장
  useEffect(() => {
    localStorage.setItem('myReports', JSON.stringify(reports));
  }, [reports]);

  // 삭제 기능
  const deleteReport = (e, id) => {
    e.stopPropagation();
    if (window.confirm('이 신고 내역을 삭제하시겠습니까?')) {
      setReports(prev => prev.filter(item => item.id !== id));
    }
  };

  // 아이템 상태 업데이트 헬퍼
  const updateItemStatus = (id, newStatus, message, finalData = null) => {
    setReports(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: newStatus,
          progressMsg: message,
          ...finalData
        };
      }
      return item;
    }));
  };

  const processVideoAnalysis = async (id, file) => {
    updateItemStatus(id, 'processing', 'AI가 영상을 정밀 분석 중입니다...');

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch('http://localhost:8000/api/analyze-video', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        
        // ★ 디버깅: 서버 응답 확인
        console.log("📦 Report.jsx - 서버 응답 전체:", data);
        console.log("📝 ai_report 필드:", data.ai_report);
        
        const violationTitle = data.result ? data.result.split('(')[0].trim() : '위반 감지';

        setReports(prev => prev.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    status: 'complete',
                    title: violationTitle,
                    plate: data.plate || '식별불가',
                    date: data.time,
                    time: data.time,
                    desc: data.result,
                    detailContent: data.ai_report || '초안 생성 실패', // ★ 핵심: ai_report 저장!
                    videoSrc: URL.createObjectURL(file)
                };
            }
            return item;
        }));
        
      } else {
        throw new Error("서버 에러 응답");
      }

    } catch (error) {
      console.error("분석 실패:", error);
      updateItemStatus(id, 'error', '서버 연결 실패');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newId = Date.now();
    
    const newReport = {
      id: newId,
      title: '영상 분석 중...',
      date: new Date().toLocaleString(),
      plate: '-',
      status: 'processing', 
      progressMsg: '서버 연결 대기 중...',
      videoSrc: null
    };

    setReports([newReport, ...reports]); 
    processVideoAnalysis(newId, file);
    
    e.target.value = ''; 
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="screen active">
      <div className="header">
        <h1>📋 신고 관리</h1>
        <p>내 신고 목록 및 AI 자동 분석</p>
      </div>

      {/* 업로드 영역 */}
      <div 
        style={{ 
            padding: '32px 24px', 
            background: 'linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 100%)',
            borderRadius: 'var(--radius-xl)', 
            margin: '20px', 
            border: '2px dashed var(--primary-blue)', 
            cursor: 'pointer', 
            textAlign: 'center',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: 'var(--shadow-sm)'
        }} 
        onClick={handleUploadClick}
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = 'var(--primary-dark)';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderColor = 'var(--primary-blue)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📸</div>
        <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
            신고 자동 작성
        </div>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            영상을 업로드하면 AI가 자동으로<br/>위반 내용을 분석하고 신고서를 작성합니다.
        </div>
      </div>

      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="video/*" onChange={handleFileChange} />

      <div className="report-list">
        {reports.map((report) => (
          <div 
            key={report.id} 
            className="report-item" 
            onClick={() => report.status === 'complete' && navigate('/report/detail', {state: report})}
            style={{ 
                opacity: report.status === 'processing' ? 0.95 : 1,
                border: report.status === 'processing' ? '2px solid var(--primary-blue)' : '1px solid var(--border-light)',
                background: report.status === 'processing' ? 'linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 100%)' : 'var(--bg-primary)',
                cursor: report.status === 'complete' ? 'pointer' : 'default',
            }}
          >
              <div className="report-thumbnail" style={{ 
                  background: report.status === 'processing' 
                    ? 'var(--bg-primary)' 
                    : report.status === 'error' 
                    ? 'linear-gradient(135deg, #FEE2E2 0%, #FCA5A5 100%)'
                    : 'var(--primary-gradient)',
              }}>
                {report.status === 'processing' ? (
                    <div className="spinner"></div>
                ) : report.status === 'error' ? (
                    '⚠️'
                ) : (
                    '📸'
                )}
              </div>

              <div className="report-info" style={{ flex: 1 }}>
                  <div className="report-title" style={{ 
                      color: report.status === 'processing' ? 'var(--primary-blue)' : 'var(--text-primary)',
                  }}>
                      {report.title}
                  </div>
                  
                  {report.status === 'processing' ? (
                    <div style={{ fontSize: '12px', color: 'var(--primary-blue)', fontWeight: '500' }}>
                        {report.progressMsg}
                    </div>
                  ) : report.status === 'error' ? (
                    <div style={{ fontSize: '12px', color: 'var(--danger-red)', fontWeight: '500' }}>
                        {report.progressMsg}
                    </div>
                  ) : (
                    <div className="report-meta">
                        {report.date} | {report.plate}
                    </div>
                  )}
              </div>

              {/* 우측 상태 영역 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <div 
                    onClick={(e) => deleteReport(e, report.id)}
                    style={{ 
                        cursor: 'pointer', 
                        color: 'var(--text-tertiary)', 
                        fontSize: '16px',
                        padding: '4px',
                        transition: 'color 0.2s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = 'var(--danger-red)'}
                    onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                    title="삭제"
                  >
                    ✖
                  </div>

                  {report.status === 'complete' && (
                    <span className="report-status status-complete">완료</span>
                  )}
                  {report.status === 'submitted' && (
                    <span className="report-status" style={{ 
                      background: 'var(--info-light)', 
                      color: 'var(--info-blue)' 
                    }}>제출됨</span>
                  )}
                  {report.status === 'error' && (
                    <span className="report-status status-rejected">오류</span>
                  )}
              </div>
          </div>
        ))}
      </div>

      <style>{`
        .spinner {
            width: 28px;
            height: 28px;
            border: 3px solid var(--border-light);
            border-top: 3px solid var(--primary-blue);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        @keyframes spin { 
            0% { transform: rotate(0deg); } 
            100% { transform: rotate(360deg); } 
        }
      `}</style>
    </div>
  );
};

export default Report;

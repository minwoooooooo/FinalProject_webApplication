import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Report = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  
  // 1. 초기 상태 로드 (새로고침 시 무한 스피너 방지 로직 유지)
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

  // ★ 삭제 기능 함수 추가
  const deleteReport = (e, id) => {
    e.stopPropagation(); // 카드 클릭(상세이동) 이벤트가 발생하지 않게 막음
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
        const violationTitle = data.result ? data.result.split('(')[0].trim() : '위반 감지';

        setReports(prev => prev.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    status: 'complete',
                    title: violationTitle,
                    plate: data.plate || '식별불가',
                    date: data.time, // 목록용 날짜
                    time: data.time, // 상세페이지용 날짜
                    desc: data.result,
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
        <h1>신고 관리</h1>
        <p>내 신고 목록</p>
      </div>

      <div 
        style={{ 
            padding: '24px', 
            background: '#F8FAFC', 
            borderRadius: '16px', 
            margin: '16px', 
            border: '2px dashed #CBD5E1', 
            cursor: 'pointer', 
            textAlign: 'center',
            transition: 'all 0.2s ease'
        }} 
        onClick={handleUploadClick}
        onMouseOver={(e) => e.currentTarget.style.borderColor = '#3B82F6'}
        onMouseOut={(e) => e.currentTarget.style.borderColor = '#CBD5E1'}
      >
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>📸</div>
        <div style={{ fontSize: '16px', fontWeight: '700', color: '#1E293B', marginBottom: '4px' }}>
            신고 자동 작성
        </div>
        <div style={{ fontSize: '13px', color: '#64748B' }}>
            영상을 업로드하면 AI가 분석하여 신고서를 작성합니다.
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
                opacity: report.status === 'processing' ? 0.9 : 1,
                border: report.status === 'processing' ? '2px solid #3B82F6' : '1px solid #E2E8F0',
                background: report.status === 'processing' ? '#EFF6FF' : 'white',
                transition: 'all 0.3s ease',
                cursor: report.status === 'complete' ? 'pointer' : 'default',
                padding: '16px',
                margin: '0 16px 12px 16px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}
          >
              <div className="report-thumbnail" style={{ 
                  width: '48px', height: '48px', 
                  borderRadius: '8px', 
                  background: report.status === 'processing' ? 'white' : '#F1F5F9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '24px'
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
                      fontWeight: 'bold', 
                      fontSize: '15px',
                      color: report.status === 'processing' ? '#2563EB' : '#1E293B',
                      marginBottom: '4px'
                  }}>
                      {report.title}
                  </div>
                  
                  {report.status === 'processing' ? (
                    <div style={{ fontSize: '12px', color: '#3B82F6', fontWeight: '500' }}>
                        {report.progressMsg}
                    </div>
                  ) : report.status === 'error' ? (
                    <div style={{ fontSize: '12px', color: '#EF4444' }}>
                        {report.progressMsg}
                    </div>
                  ) : (
                    <div className="report-meta" style={{ fontSize: '12px', color: '#64748B' }}>
                        {report.date} | {report.plate}
                    </div>
                  )}
              </div>

              {/* 우측 상태 뱃지 및 삭제 버튼 영역 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  {/* ★ 삭제 버튼 */}
                  <div 
                    onClick={(e) => deleteReport(e, report.id)}
                    style={{ 
                        cursor: 'pointer', 
                        color: '#94A3B8', 
                        fontSize: '14px',
                        padding: '4px'
                    }}
                    title="삭제"
                  >
                    ✖
                  </div>

                  {report.status === 'complete' && (
                    <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '12px', background: '#DCFCE7', color: '#166534', fontWeight: '600' }}>
                        완료
                    </span>
                  )}
                  {report.status === 'submitted' && (
                    <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '12px', background: '#DBEAFE', color: '#1E40AF', fontWeight: '600' }}>
                        제출됨
                    </span>
                  )}
                  {report.status === 'error' && (
                    <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '12px', background: '#FEF2F2', color: '#DC2626', fontWeight: '600' }}>
                        오류
                    </span>
                  )}
              </div>
          </div>
        ))}
      </div>

      <style>{`
        .spinner {
            width: 24px;
            height: 24px;
            border: 3px solid #E2E8F0;
            border-top: 3px solid #3B82F6;
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
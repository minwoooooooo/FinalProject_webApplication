import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useReport } from '../contexts/ReportContext';

const Report = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  
  // 1. Context에서 데이터와 함수 가져오기
  const { user } = useAuth();
  const { reports, uploadVideo, removeReport } = useReport();
  
  // 2. 내 기기(Raspberry Pi) 관련 상태
  const [myDevice, setMyDevice] = useState(null);
  const [saveToDevice, setSaveToDevice] = useState(false);

  // 3. 내 기기 정보 조회 (Java 서버)
  useEffect(() => {
    if (!user || !user.history_id) return;
    
    const fetchMyDevice = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/device/${user.history_id}`);
        if (res.ok) {
          const devices = await res.json();
          // 기기가 존재하면 첫 번째 기기를 내 기기로 설정하고, 저장 옵션 켜기
          if (devices && devices.length > 0) {
            setMyDevice(devices[0]);
            setSaveToDevice(true); 
          }
        }
      } catch (err) { 
        console.error("기기 정보 조회 실패:", err); 
      }
    };
    fetchMyDevice();
  }, [user]);

  // 4. 파일 선택 시 업로드 처리 (Context 함수 사용)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Context의 uploadVideo 호출 (기기 저장 여부와 기기 정보 함께 전달)
    uploadVideo(file, saveToDevice, myDevice);
    
    // 입력 초기화 (같은 파일 다시 선택 가능하게)
    e.target.value = ''; 
  };

  // 5. 삭제 처리 (Context 함수 사용)
  const handleDelete = async (e, id) => {
    e.stopPropagation(); // 클릭 이벤트 전파 방지 (상세 페이지 이동 막기)
    
    if (window.confirm('정말 삭제하시겠습니까? (서버의 파일도 함께 삭제됩니다)')) {
      await removeReport(id);
    }
  };

  // 6. 업로드 버튼 클릭 트리거
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="screen active">
      <div className="header">
        <h1>신고 관리</h1>
        <p>{user ? `${user.nickname}님의 신고 이력` : '로딩 중...'}</p>
      </div>

      {/* 업로드 영역 */}
      <div 
        onClick={handleUploadClick}
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

      {/* 기기 저장 옵션 (기기가 있을 때만 표시) */}
      {myDevice && (
        <div style={{ padding: '0 16px', marginBottom: '16px', display:'flex', justifyContent:'center' }}>
            <label style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', color:'#4B5563', cursor:'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={saveToDevice} 
                  onChange={(e) => setSaveToDevice(e.target.checked)} 
                />
                <span>내 기기 <b>[{myDevice.serialNo}]</b> 에도 영상 저장하기</span>
            </label>
        </div>
      )}

      {/* 숨겨진 파일 입력 */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="video/*" 
        onChange={handleFileChange} 
      />

      {/* 리스트 영역 */}
      <div className="report-list" style={{ paddingBottom: '80px' }}>
        {reports.length === 0 && (
          <div style={{textAlign:'center', marginTop:'40px', color:'#94A3B8', fontSize:'14px'}}>
            저장된 신고 내역이 없습니다.
          </div>
        )}

        {reports.map((report) => (
          <div 
            key={report.id} 
            className="report-item" 
            // 처리 완료된 상태에서만 상세 페이지 이동
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
              {/* 썸네일/아이콘 영역 */}
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
                    '📂'
                )}
              </div>

              {/* 텍스트 정보 영역 */}
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

              {/* 상태 뱃지 및 삭제 버튼 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  {/* 삭제 버튼 (처리 중이 아닐 때만 노출) */}
                  {report.status !== 'processing' && (
                    <div 
                      onClick={(e) => handleDelete(e, report.id)}
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
                  )}

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
              </div>
          </div>
        ))}
      </div>

      {/* 스피너 애니메이션 스타일 */}
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
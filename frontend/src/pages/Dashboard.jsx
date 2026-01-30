import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동 훅 추가

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate(); // 버튼 클릭 시 이동을 위해 사용

  // 3초마다 자바 서버에서 로그 가져오기 (Polling)
  useEffect(() => {
    const interval = setInterval(async () => {
        try {
            const res = await fetch('/api/logs'); 
            const data = await res.json();
            setLogs(data);
        } catch (e) { console.error(e); }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="screen active">
      <div className="header">
        <h1>🚗 Road Guardian</h1>
        <p>도로교통법 전문 AI 챗봇</p>
      </div>

      <div className="dashboard-grid">
         {/* 1. 실시간 감지 (서버 데이터 연동) */}
         <div className="stat-card">
            <div className="stat-value">{logs.length}</div>
            <div className="stat-label">신고 접수</div>
         </div>

         {/* 2. 완료 (원본 복구) */}
         <div className="stat-card">
            <div className="stat-value">8</div>
            <div className="stat-label">완료</div>
         </div>

         {/* 3. 진행중 (원본 복구) */}
         <div className="stat-card">
            <div className="stat-value">2</div>
            <div className="stat-label">진행중</div>
         </div>

         {/* 4. 안전 점수 (원본 복구) */}
         <div className="stat-card">
            <div className="stat-value">85.5</div>
            <div className="stat-label">안전 점수</div>
         </div>
      </div>

      {/* 5. 법률 상담 시작 버튼 (원본 복구) */}
      <div style={{ padding: '0 16px', marginTop: '8px' }}>
          <button className="btn btn-primary" onClick={() => navigate('/chatbot')}>
              💬 법률 상담 시작
          </button>
      </div>
    </div>
  );
};

export default Dashboard;
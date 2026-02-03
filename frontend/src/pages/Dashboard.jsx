import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
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
=======
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // ★ 유저 정보 가져오기

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // 로그인한 유저 정보

  // 상태 관리: 통계 수치
  const [stats, setStats] = useState({
    total: 0,      // 신고 접수 (총 개수)
    completed: 0,  // 완료 (제출됨)
    ongoing: 0,    // 진행중 (작성 중)
    score: 0       // 안전 점수
  });

  useEffect(() => {
    // 1. 유저 정보가 없으면 로드하지 않음
    if (!user || !user.history_id) return;

    const fetchMyStats = async () => {
      try {
        // ★ 자바 서버(8080)에서 내 내역 가져오기
        const res = await fetch(`http://localhost:8080/api/my-reports?userId=${user.history_id}`);
        if (res.ok) {
          const reports = await res.json();
          
          // 2. 통계 계산 로직
          const totalCount = reports.length;
          
          // isSubmitted가 true인 것만 '완료'로 간주
          const completedCount = reports.filter(r => r.isSubmitted).length;
          const ongoingCount = totalCount - completedCount;

          // ★ 안전 점수: 완료 건수 × 10점
          const safetyScore = completedCount * 10;

          setStats({
            total: totalCount,
            completed: completedCount,
            ongoing: ongoingCount,
            score: safetyScore
          });
        }
      } catch (e) {
        console.error("대시보드 데이터 로드 실패:", e);
      }
    };

    fetchMyStats();
    // 3초마다 갱신 (선택사항, 필요 없으면 제거 가능)
    const interval = setInterval(fetchMyStats, 3000);
    return () => clearInterval(interval);

  }, [user]); // user 정보가 로드되면 실행
>>>>>>> upstream/master

  return (
    <div className="screen active">
      <div className="header">
        <h1>🚗 Road Guardian</h1>
        <p>도로교통법 전문 AI 챗봇</p>
      </div>

      <div className="dashboard-grid">
<<<<<<< HEAD
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
=======
         {/* 1. 신고 접수 (총 개수) */}
         <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">신고 접수</div>
         </div>

         {/* 2. 완료 (실제 제출된 건수) */}
         <div className="stat-card">
            <div className="stat-value" style={{ color: '#10B981' }}>{stats.completed}</div>
            <div className="stat-label">완료</div>
         </div>

         {/* 3. 진행중 (아직 제출 안 된 건수) */}
         <div className="stat-card">
            <div className="stat-value" style={{ color: '#3B82F6' }}>{stats.ongoing}</div>
            <div className="stat-label">진행중</div>
         </div>

         {/* 4. 안전 점수 (완료 * 10점) */}
         <div className="stat-card">
            <div className="stat-value" style={{ color: '#8B5CF6' }}>{stats.score}</div>
>>>>>>> upstream/master
            <div className="stat-label">안전 점수</div>
         </div>
      </div>

<<<<<<< HEAD
      {/* 5. 법률 상담 시작 버튼 (원본 복구) */}
=======
      {/* 5. 유저 환영 문구 추가 (선택) */}
      <div style={{ padding: '0 16px', marginBottom: '16px', fontSize: '14px', color: '#64748B', textAlign: 'center' }}>
         {user ? `${user.userName || user.nickname}님의 활동 현황입니다.` : '로그인 정보를 불러오는 중...'}
      </div>

      {/* 6. 법률 상담 버튼 */}
>>>>>>> upstream/master
      <div style={{ padding: '0 16px', marginTop: '8px' }}>
          <button className="btn btn-primary" onClick={() => navigate('/chatbot')}>
              💬 법률 상담 시작
          </button>
      </div>
    </div>
  );
};

export default Dashboard;
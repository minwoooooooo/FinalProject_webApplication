import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

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

  // 현재 날짜와 인사말
  const getCurrentDate = () => {
    const now = new Date();
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = days[now.getDay()];
    const month = now.getMonth() + 1;
    const date = now.getDate();
    return `${month}월 ${date}일 ${dayName}요일`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '좋은 아침입니다';
    if (hour < 18) return '좋은 오후입니다';
    return '좋은 저녁입니다';
  };

  return (
    <div className="screen active">
      <div className="header">
        <h1>{getGreeting()} 👋</h1>
        <p>{getCurrentDate()}</p>
      </div>

      {/* 통계 요약 (한 줄) */}
      <div style={{ 
        padding: '20px', 
        background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
        margin: '20px',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-around', 
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: 'var(--primary-blue)',
              marginBottom: '4px'
            }}>
              {logs.length}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
              신고 접수
            </div>
          </div>
          
          <div style={{ 
            width: '1px', 
            height: '40px', 
            background: 'var(--border-medium)' 
          }}></div>
          
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: 'var(--success-green)',
              marginBottom: '4px'
            }}>
              8
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
              처리 완료
            </div>
          </div>
          
          <div style={{ 
            width: '1px', 
            height: '40px', 
            background: 'var(--border-medium)' 
          }}></div>
          
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: 'var(--warning-orange)',
              marginBottom: '4px'
            }}>
              2
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
              진행 중
            </div>
          </div>
        </div>
      </div>

      {/* 메인 메뉴 */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ 
          fontSize: '16px', 
          fontWeight: '700', 
          color: 'var(--text-primary)', 
          marginBottom: '16px',
          marginLeft: '4px'
        }}>
          빠른 메뉴
        </div>

        {/* 신고 작성 버튼 */}
        <div 
          className="menu-card" 
          onClick={() => navigate('/report')}
          style={{
            background: 'linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 100%)',
            borderColor: 'var(--primary-blue)',
            marginBottom: '16px'
          }}
        >
          <div className="menu-icon blue" style={{ fontSize: '28px' }}>
            📝
          </div>
          <div className="menu-content">
            <div className="menu-title" style={{ fontSize: '16px' }}>신고 작성</div>
            <div className="menu-desc">AI가 자동으로 신고서를 작성합니다</div>
          </div>
          <div className="menu-arrow">›</div>
        </div>

        {/* 법률 상담 버튼 */}
        <div 
          className="menu-card" 
          onClick={() => navigate('/chatbot')}
          style={{
            background: 'linear-gradient(135deg, #D1FAE5 0%, #ECFDF5 100%)',
            borderColor: 'var(--success-green)',
            marginBottom: '16px'
          }}
        >
          <div className="menu-icon green" style={{ fontSize: '28px' }}>
            💬
          </div>
          <div className="menu-content">
            <div className="menu-title" style={{ fontSize: '16px' }}>법률 상담</div>
            <div className="menu-desc">도로교통법 전문 AI 챗봇과 대화</div>
          </div>
          <div className="menu-arrow">›</div>
        </div>

        {/* 신고 상세 기록 버튼 */}
        <div 
          className="menu-card" 
          onClick={() => navigate('/about')}
          style={{
            background: 'linear-gradient(135deg, #FEE2E2 0%, #FEF2F2 100%)',
            borderColor: 'var(--danger-red)',
            marginBottom: '16px'
          }}
        >
          <div className="menu-icon red" style={{ fontSize: '28px' }}>
            📋
          </div>
          <div className="menu-content">
            <div className="menu-title" style={{ fontSize: '16px' }}>신고 상세 기록</div>
            <div className="menu-desc">안전신문고 연동 신고 이력 조회</div>
          </div>
          <div className="menu-arrow">›</div>
        </div>

        {/* 마이페이지 버튼 */}
        <div 
          className="menu-card" 
          onClick={() => navigate('/support')}
          style={{
            background: 'linear-gradient(135deg, #FEF3C7 0%, #FEF9C3 100%)',
            borderColor: 'var(--warning-orange)',
            marginBottom: '16px'
          }}
        >
          <div className="menu-icon orange" style={{ fontSize: '28px' }}>
            👤
          </div>
          <div className="menu-content">
            <div className="menu-title" style={{ fontSize: '16px' }}>마이페이지</div>
            <div className="menu-desc">프로필 및 설정 관리</div>
          </div>
          <div className="menu-arrow">›</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

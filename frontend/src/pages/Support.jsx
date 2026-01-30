import React from 'react';

// ★ 수정: App.jsx에서 보낸 user 정보를 받음
const Support = ({ user }) => {
  
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/auth/logout', {
        method: 'POST',
        credentials: 'include' 
      });
      alert("안전하게 로그아웃 되었습니다.");
      window.location.href = "/";
    } catch (error) {
      console.error("로그아웃 에러:", error);
      window.location.href = "/";
    }
  };

  const openFAQ = () => {
    alert("자주 묻는 질문 팝업 준비 중입니다.");
  };

  return (
    <div className="screen active">
      <div className="header">
        <h1>💬 고객센터</h1>
        <p>지원 및 문의</p>
      </div>

      <div style={{ padding: '16px' }}>
        
        {/* ★ 추가된 부분: 로그인 환영 박스 */ }
        {user && (
            <div className="analytics-card" style={{ background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)', border: '1px solid #FED7AA', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* 프로필 이미지 */}
                    {user.profile_image ? (
                        <img 
                            src={user.profile_image} 
                            alt="프로필" 
                            style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} 
                        />
                    ) : (
                        <div style={{ fontSize: '40px' }}>👤</div>
                    )}
                    
                    {/* 닉네임과 ID 표시 */}
                    <div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#9A3412' }}>
                            {user.nickname}님, 환영합니다!
                        </div>
                        <div style={{ fontSize: '12px', color: '#C2410C', marginTop: '4px' }}>
                            카카오 ID: {user.id}
                        </div>
                        {user.email && (
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                {user.email}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* 지원 정보 카드 */}
        <div className="analytics-card" style={{ background: 'linear-gradient(135deg, var(--primary-light) 0%, #F0F9FF 100%)' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px' }}>
            📞 지원 정보
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            <strong>이메일:</strong> support@roadguardian.com<br />
            <strong>전화:</strong> 1234-5678<br />
            <strong>운영시간:</strong> 평일 09:00-18:00
          </div>
        </div>

        {/* FAQ 메뉴 */}
        <div className="menu-card" onClick={openFAQ}>
          <div className="menu-icon green">❓</div>
          <div className="menu-content">
            <div className="menu-title">FAQ</div>
            <div className="menu-desc">자주 묻는 질문</div>
          </div>
          <div className="menu-arrow">›</div>
        </div>
        
        <button className="btn btn-primary" onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default Support;
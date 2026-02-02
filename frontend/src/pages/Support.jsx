import React from 'react';

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
        <h1>💬 마이페이지</h1>
        <p>내 정보 및 설정</p>
      </div>

      <div style={{ padding: '20px' }}>
        
        {/* 로그인 환영 박스 */}
        {user && (
            <div className="analytics-card" style={{ 
              background: 'linear-gradient(135deg, #FEF3C7 0%, #FEF9C3 100%)', 
              border: '1px solid var(--warning-light)', 
              marginBottom: '20px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* 프로필 이미지 */}
                    {user.profile_image ? (
                        <img 
                            src={user.profile_image} 
                            alt="프로필" 
                            style={{ 
                              width: '56px', 
                              height: '56px', 
                              borderRadius: '50%', 
                              border: '3px solid white', 
                              boxShadow: 'var(--shadow-md)'
                            }} 
                        />
                    ) : (
                        <div style={{ 
                          fontSize: '56px',
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                        }}>👤</div>
                    )}
                    
                    {/* 닉네임과 ID 표시 */}
                    <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontSize: '18px', 
                          fontWeight: '700', 
                          color: '#92400E',
                          marginBottom: '4px'
                        }}>
                            {user.nickname}님
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: '#B45309',
                          fontWeight: '500'
                        }}>
                            환영합니다! 👋
                        </div>
                        {user.email && (
                            <div style={{ 
                              fontSize: '11px', 
                              color: 'var(--text-secondary)',
                              marginTop: '4px'
                            }}>
                                {user.email}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* 지원 정보 카드 */}
        <div className="analytics-card" style={{ 
          background: 'linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 100%)',
          marginBottom: '16px'
        }}>
          <div style={{ 
            fontSize: '16px', 
            fontWeight: '700', 
            color: 'var(--text-primary)', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '24px' }}>📞</span>
            지원 정보
          </div>
          <div style={{ 
            fontSize: '14px', 
            color: 'var(--text-secondary)', 
            lineHeight: '2'
          }}>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>이메일:</span>{' '}
              <span style={{ fontWeight: '500' }}>support@roadguardian.com</span>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>전화:</span>{' '}
              <span style={{ fontWeight: '500' }}>1234-5678</span>
            </div>
            <div>
              <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>운영시간:</span>{' '}
              <span style={{ fontWeight: '500' }}>평일 09:00-18:00</span>
            </div>
          </div>
        </div>

        {/* FAQ 메뉴 */}
        <div className="menu-card" onClick={openFAQ}>
          <div className="menu-icon green">❓</div>
          <div className="menu-content">
            <div className="menu-title">자주 묻는 질문</div>
            <div className="menu-desc">FAQ 및 도움말</div>
          </div>
          <div className="menu-arrow">›</div>
        </div>
        
        {/* 로그아웃 버튼 */}
        <button 
          className="btn" 
          onClick={handleLogout}
          style={{
            background: 'var(--bg-tertiary)',
            color: 'var(--danger-red)',
            border: '1px solid var(--border-light)',
            width: 'calc(100% - 40px)',
            fontWeight: '600'
          }}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default Support;

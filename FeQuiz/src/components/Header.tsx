import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const location = useLocation()
  const isLoggedIn = !!localStorage.getItem('token')

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/'
  }

  const isLoginPage = location.pathname === '/login'
  const isRegisterPage = location.pathname === '/'

  return (
    <header>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 className="brand-logo" style={{ color: '#3b5bdb', fontSize: '18px', fontWeight: 700, margin: 0 }}>QuizMaster Pro</h4>
        <div style={{ display: 'flex', gap: '12px' }}>
          {isLoggedIn ? (
            <button 
              onClick={handleLogout}
              style={{ color: '#3b5bdb', fontSize: '13px', fontWeight: 600, textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Đăng xuất
            </button>
          ) : (
            <>
              <Link 
                to="/" 
                style={{ 
                  color: isRegisterPage ? '#ffffff' : '#3b5bdb',
                  fontSize: '13px', 
                  fontWeight: 600, 
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  backgroundColor: isRegisterPage ? '#3b5bdb' : 'transparent',
                  transition: 'all 0.3s ease'
                }}
              >
                Đăng ký
              </Link>
              <Link 
                to="/login" 
                style={{ 
                  color: isLoginPage ? '#ffffff' : '#3b5bdb',
                  fontSize: '13px', 
                  fontWeight: 600, 
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  backgroundColor: isLoginPage ? '#3b5bdb' : 'transparent',
                  transition: 'all 0.3s ease'
                }}
              >
                Đăng nhập
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

import React, { useState } from 'react';
import { Outlet, Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

// --- BỘ ICON SVG TỐI GIẢN CHO STAFF ---
const Icons = {
  Attendance: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Task: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Performance: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  Facility: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  )
};

const StaffLayout = () => {
  const { user, logout } = useAuth();
  const { updatePassword } = useData();
  const [showChangePass, setShowChangePass] = useState(false);
  const [passForm, setPassForm] = useState({ newPass: '', confirmPass: '' });
  const location = useLocation();

  if (!user || user.role !== 'staff') return <Navigate to="/" />;

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passForm.newPass !== passForm.confirmPass) return alert("Mật khẩu xác nhận không khớp!");
    if (passForm.newPass.length < 3) return alert("Mật khẩu quá ngắn!");
    
    updatePassword(user.id, passForm.newPass);
    alert("Đổi mật khẩu thành công!");
    setShowChangePass(false);
    setPassForm({ newPass: '', confirmPass: '' });
  };

  const linkStyle = (path) => {
    const isActive = location.pathname === path;
    return {
      textDecoration: 'none',
      color: isActive ? '#003366' : '#666',
      fontWeight: isActive ? 'bold' : '500',
      padding: '12px 15px',
      borderBottom: isActive ? '3px solid #003366' : '3px solid transparent',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      gap: '8px' // Khoảng cách giữa icon và text
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f5f7fa' }}>
      {/* HEADER ĐỒNG BỘ HOÀN TOÀN VỚI ADMIN */}
      <header style={{ 
        background: '#003366', 
        color: 'white', 
        padding: '10px 20px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        height: '65px', // Chiều cao cố định đồng bộ
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img 
              src="/BA LOGO.png" 
              alt="Be Able VN Logo" 
              style={{ 
                height: '45px', // Đồng bộ chiều cao logo
                width: 'auto', 
                objectFit: 'contain', 
                backgroundColor: 'white', 
                borderRadius: '8px', 
                padding: '4px' // Đồng bộ padding
              }} 
            />
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>Be Able VN - Nhân sự</h3>
        </div>
        
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span 
            onClick={() => setShowChangePass(!showChangePass)}
            style={{ cursor: 'pointer', fontWeight: '500', userSelect: 'none' }}
          >
            Xin chào, <strong>{user.name}</strong> ▾
          </span>
          
          <button 
            onClick={logout} 
            style={{ 
              padding: '6px 15px', 
              cursor: 'pointer', 
              border: '1px solid white', 
              borderRadius: '4px', 
              background: 'transparent', 
              color: 'white', 
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}
          >
            Đăng xuất
          </button>

          {/* Popup Đổi mật khẩu */}
          {showChangePass && (
            <div style={{ position: 'absolute', top: '140%', right: 0, background: 'white', color: 'black', padding: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.15)', borderRadius: '8px', zIndex: 1000, width: '280px', border: '1px solid #ddd' }}>
              <h4 style={{ margin: '0 0 15px 0', borderBottom: '1px solid #eee', paddingBottom: '10px', color: '#003366' }}>Đổi mật khẩu</h4>
              <form onSubmit={handleChangePassword}>
                <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem'}}>Mật khẩu mới:</label>
                <input type="password" value={passForm.newPass} onChange={e => setPassForm({...passForm, newPass: e.target.value})} style={{ width: '100%', marginBottom: '15px', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} required />
                
                <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem'}}>Xác nhận mật khẩu:</label>
                <input type="password" value={passForm.confirmPass} onChange={e => setPassForm({...passForm, confirmPass: e.target.value})} style={{ width: '100%', marginBottom: '20px', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} required />
                
                <button type="submit" style={{ width: '100%', background: '#003366', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Lưu thay đổi</button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* NAVIGATION BAR - Tối giản, có Icon xanh dương */}
      <nav style={{ background: '#fff', padding: '0 20px', borderBottom: '1px solid #ddd', display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <Link to="/staff/attendance" style={linkStyle('/staff/attendance')}>
          <Icons.Attendance /> Điểm danh
        </Link>
        <Link to="/staff/my-tasks" style={linkStyle('/staff/my-tasks')}>
          <Icons.Task /> Công việc
        </Link>
        <Link to="/staff/performance" style={linkStyle('/staff/performance')}>
          <Icons.Performance /> Performance
        </Link>
        <Link to="/staff/facility-check" style={linkStyle('/staff/facility-check')}>
          <Icons.Facility /> Kiểm tra CSVC
        </Link>
      </nav>

      <main style={{ padding: '30px', flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default StaffLayout;
import React from 'react';
import { Outlet, Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// --- BỘ ICON SVG TỐI GIẢN (MINIMALIST ICONS) ---
const Icons = {
  Staff: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#003366" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  Task: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#003366" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  Report: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#003366" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
};

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user || user.role !== 'admin') return <Navigate to="/" />;

  // Hàm style chung cho Link Sidebar
  const sidebarLinkStyle = (path) => ({
    textDecoration: 'none',
    color: location.pathname === path ? '#003366' : '#666',
    fontWeight: location.pathname === path ? 'bold' : '500',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px',
    borderRadius: '6px',
    background: location.pathname === path ? '#e6f7ff' : 'transparent',
    transition: 'all 0.2s'
  });

  return (
    <div>
      {/* HEADER ĐỒNG BỘ */}
      <header style={{ 
        background: '#003366', 
        color: 'white', 
        padding: '10px 20px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        height: '65px', // Cố định chiều cao header
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img 
            src="/BA LOGO.png" 
            alt="Be Able VN Logo" 
            style={{ 
              height: '45px', // Chiều cao logo chuẩn
              width: 'auto',
              objectFit: 'contain', 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              padding: '4px' // Padding chuẩn
            }} 
          />
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>Be Able VN - Admin</h3>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontWeight: '500' }}>Xin chào, <strong>{user.name}</strong></span>
          <button 
            onClick={logout}
            style={{ 
              padding: '6px 15px', 
              cursor: 'pointer', 
              borderRadius: '4px', 
              border: '1px solid white', 
              background: 'transparent',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}
          >
            Đăng xuất
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 65px)' }}>
        <aside style={{ width: '240px', background: '#fff', padding: '20px', borderRight: '1px solid #eee' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/admin/staff-manager" style={sidebarLinkStyle('/admin/staff-manager')}>
                <Icons.Staff /> Quản lý Nhân sự
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/admin/task-manager" style={sidebarLinkStyle('/admin/task-manager')}>
                <Icons.Task /> Giao đầu việc
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/admin/reports" style={sidebarLinkStyle('/admin/reports')}>
                <Icons.Report /> Báo cáo tổng hợp
              </Link>
            </li>
          </ul>
        </aside>
        <main style={{ flex: 1, padding: '25px', backgroundColor: '#f5f7fa' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
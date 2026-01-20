import React from 'react';
import { Outlet, Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Icons SVG đơn giản
const Icons = {
  Staff: () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  Task: () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
  Discipline: () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
  Report: () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
};

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Redirect nếu không phải là một trong các loại Admin
  if (!user || !['chief', 'reg', 'op'].includes(user.role)) return <Navigate to="/" />;

  const sidebarLinkStyle = (path) => ({
    textDecoration: 'none',
    color: location.pathname === path ? '#003366' : '#666',
    fontWeight: location.pathname === path ? 'bold' : '500',
    display: 'flex', alignItems: 'center', gap: '12px', padding: '10px',
    borderRadius: '6px',
    background: location.pathname === path ? '#e6f7ff' : 'transparent',
    transition: 'all 0.2s'
  });

  return (
    <div>
      <header style={{ background: '#003366', color: 'white', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '65px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src="/BA LOGO.png" alt="Logo" style={{ height: '45px', backgroundColor: 'white', borderRadius: '8px', padding: '4px' }} />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Be Able VN Admin</h3>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Role: {user.role.toUpperCase()} ADMIN</span>
          </div>
        </div>
        <button onClick={logout} style={{ padding: '6px 15px', border: '1px solid white', background: 'transparent', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>Đăng xuất</button>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 65px)' }}>
        <aside style={{ width: '240px', background: '#fff', padding: '20px', borderRight: '1px solid #eee' }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/admin/staff-manager" style={sidebarLinkStyle('/admin/staff-manager')}>
                <Icons.Staff /> Quản lý Nhân sự
              </Link>
            </li>
            
            {/* Chỉ OP và CHIEF thấy giao việc */}
            {(user.role === 'op' || user.role === 'chief') && (
                <li style={{ marginBottom: '8px' }}>
                <Link to="/admin/task-manager" style={sidebarLinkStyle('/admin/task-manager')}>
                    <Icons.Task /> Điều phối & Giao việc
                </Link>
                </li>
            )}

            {/* Chỉ REG và CHIEF thấy kỷ luật */}
            {(user.role === 'reg' || user.role === 'chief') && (
                <li style={{ marginBottom: '8px' }}>
                <Link to="/admin/discipline-manager" style={sidebarLinkStyle('/admin/discipline-manager')}>
                    <Icons.Discipline /> Quy chế & Duyệt
                </Link>
                </li>
            )}

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
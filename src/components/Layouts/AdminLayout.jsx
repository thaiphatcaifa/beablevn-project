import React from 'react';
import { Outlet, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  if (!user || user.role !== 'admin') return <Navigate to="/" />;

  return (
    <div>
      <header style={{ background: '#003366', color: 'white', padding: '10px 20px', display: 'flex', justifyContent: 'space-between' }}>
        <h3>Be Able VN - Admin</h3>
        <div>
          <span style={{ marginRight: '10px' }}>Xin chào, {user.name}</span>
          <button onClick={logout}>Đăng xuất</button>
        </div>
      </header>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <aside style={{ width: '200px', background: '#f4f4f4', padding: '20px' }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{marginBottom: '10px'}}><Link to="/admin/staff-manager">Quản lý Nhân sự</Link></li>
            <li style={{marginBottom: '10px'}}><Link to="/admin/task-manager">Giao đầu việc</Link></li>
            <li style={{marginBottom: '10px'}}><Link to="/admin/reports">Báo cáo tổng hợp</Link></li>
          </ul>
        </aside>
        <main style={{ flex: 1, padding: '20px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
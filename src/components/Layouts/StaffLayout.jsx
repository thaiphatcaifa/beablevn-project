import React from 'react';
import { Outlet, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const StaffLayout = () => {
  const { user, logout } = useAuth();
  if (!user || user.role !== 'staff') return <Navigate to="/" />;

  return (
    <div>
      <header style={{ background: '#FF9900', color: 'white', padding: '10px 20px', display: 'flex', justifyContent: 'space-between' }}>
        <h3>Be Able VN - Nhân sự</h3>
        <div>
          <span style={{ marginRight: '10px' }}>{user.name}</span>
          <button onClick={logout}>Đăng xuất</button>
        </div>
      </header>
      <nav style={{ background: '#eee', padding: '10px 20px' }}>
        <Link to="/staff/attendance" style={{ marginRight: '20px' }}>Điểm danh</Link>
        <Link to="/staff/my-tasks" style={{ marginRight: '20px' }}>Công việc</Link>
        <Link to="/staff/facility-check">Kiểm tra CSVC</Link>
      </nav>
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default StaffLayout;
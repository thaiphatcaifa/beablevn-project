import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const LoginForm = () => {
  const [form, setForm] = useState({ user: '', pass: '' });
  const { login } = useAuth();
  const { staffList } = useData();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Tìm user trong danh sách staffList
    const account = staffList.find(s => s.username === form.user && s.password === form.pass);

    if (account) {
        if (account.status === 'suspended') {
            alert('Tài khoản đã bị đình chỉ. Liên hệ Chief Administrator.');
            return;
        }

        login(account);

        // Điều hướng dựa trên role
        if (['chief', 'reg', 'op'].includes(account.role)) {
            navigate('/admin/staff-manager');
        } else {
            navigate('/staff/attendance');
        }
    } else {
        alert('Sai tên đăng nhập hoặc mật khẩu!');
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center', maxWidth: '400px', margin: '50px auto', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
      <h2 style={{color: '#003366'}}>Đăng nhập Hệ thống</h2>
      <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
        <input placeholder="Username" onChange={e => setForm({...form, user: e.target.value})} style={{padding: '10px'}}/>
        <input type="password" placeholder="Password" onChange={e => setForm({...form, pass: e.target.value})} style={{padding: '10px'}}/>
        <button type="submit" style={{padding: '10px', background: '#003366', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold'}}>ĐĂNG NHẬP</button>
      </form>
    </div>
  );
};

export default LoginForm;
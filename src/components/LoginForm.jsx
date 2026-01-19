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
    if (form.user === 'admin' && form.pass === 'admin') {
      login({ name: 'Admin', role: 'admin' });
      navigate('/admin/staff-manager');
    } else {
      const staff = staffList.find(s => s.username === form.user && s.password === form.pass);
      if (staff) {
        login(staff);
        navigate('/staff/attendance');
      } else alert('Sai tài khoản!');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Đăng nhập Be Able VN</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Username" onChange={e => setForm({...form, user: e.target.value})} /><br/>
        <input type="password" placeholder="Password" onChange={e => setForm({...form, pass: e.target.value})} /><br/>
        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
};

export default LoginForm;
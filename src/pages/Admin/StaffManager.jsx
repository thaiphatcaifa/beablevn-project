import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

const StaffManager = () => {
  const { staffList, addStaff } = useData();
  const [formData, setFormData] = useState({ name: '', username: '', password: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    addStaff({ ...formData, role: 'staff' });
    setFormData({ name: '', username: '', password: '' });
    alert("Đã tạo tài khoản thành công");
  };

  return (
    <div>
      <h2>Quản lý Tài khoản Nhân sự</h2>
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Form tạo mới */}
        <form onSubmit={handleAdd} style={{ padding: '15px', background: '#f9f9f9', height: 'fit-content' }}>
          <h4>Thêm nhân sự mới</h4>
          <input placeholder="Họ tên" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={{display: 'block', marginBottom: '5px'}}/>
          <input placeholder="Tên đăng nhập" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required style={{display: 'block', marginBottom: '5px'}}/>
          <input placeholder="Mật khẩu" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required style={{display: 'block', marginBottom: '5px'}}/>
          <button type="submit">Tạo tài khoản</button>
        </form>

        {/* Danh sách */}
        <div style={{ flex: 1 }}>
          <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ tên</th>
                <th>Username</th>
                <th>Password</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map(staff => (
                <tr key={staff.id}>
                  <td>{staff.id}</td>
                  <td>{staff.name}</td>
                  <td>{staff.username}</td>
                  <td>{staff.password}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffManager;
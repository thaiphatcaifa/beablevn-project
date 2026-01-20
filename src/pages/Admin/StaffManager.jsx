import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

const StaffManager = () => {
  const { user } = useAuth(); // Lấy thông tin người đang login
  const { staffList, addStaff, deleteStaff, updatePassword, updateStaffInfo } = useData();
  const [formData, setFormData] = useState({ name: '', username: '', password: '' });
  
  // State quản lý việc bổ nhiệm
  const [appointMode, setAppointMode] = useState(null); // ID của user đang được bổ nhiệm

  const isChief = user?.role === 'chief';

  const handleAdd = (e) => {
    e.preventDefault();
    if (!isChief) return alert("Chỉ Chief Administrator mới được tạo tài khoản!");
    if (!formData.name || !formData.username || !formData.password) return;
    addStaff({ ...formData, role: 'staff' });
    setFormData({ name: '', username: '', password: '' });
    alert("Đã tạo tài khoản thành công");
  };

  const handleDelete = (id) => {
    if (!isChief) return alert("Chỉ Chief Administrator mới được xóa tài khoản!");
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân sự này?")) deleteStaff(id);
  };

  const handleResetPassword = (id) => {
    if (!isChief) return alert("Chỉ Chief Administrator mới được đổi mật khẩu!");
    const newPass = prompt("Nhập mật khẩu mới:", "123456");
    if (newPass) updatePassword(id, newPass);
  };

  const toggleSuspend = (staff) => {
    if (!isChief) return alert("Chỉ Chief Administrator mới được đình chỉ tài khoản!");
    const newStatus = staff.status === 'suspended' ? 'active' : 'suspended';
    const action = newStatus === 'active' ? 'Mở lại' : 'Đình chỉ';
    if(window.confirm(`Bạn muốn ${action} nhân sự này?`)) {
        updateStaffInfo(staff.id, { status: newStatus });
    }
  };

  const handleAppoint = (id, newRole) => {
    if (!isChief) return alert("Chỉ Chief Administrator mới được bổ nhiệm!");
    updateStaffInfo(id, { role: newRole });
    setAppointMode(null);
    alert("Đã bổ nhiệm thành công!");
  };

  const roleName = (r) => {
    if(r === 'chief') return 'Chief Admin';
    if(r === 'reg') return 'Regulatory Admin';
    if(r === 'op') return 'Operational Admin';
    return 'Staff';
  };

  return (
    <div>
      <h2 style={{color: '#003366'}}>Quản lý & Bổ nhiệm Nhân sự</h2>
      
      {/* Chỉ Chief mới thấy Form thêm nhân sự */}
      {isChief && (
        <form onSubmit={handleAdd} style={{ marginBottom: '20px', padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h4 style={{marginTop: 0, color: '#003366'}}>+ Thêm nhân sự mới</h4>
          <div style={{display: 'flex', gap: '10px'}}>
            <input placeholder="Họ tên" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={{padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}/>
            <input placeholder="Username" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required style={{padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}/>
            <input placeholder="Password" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required style={{padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}/>
            <button type="submit" style={{background: '#28a745', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer'}}>Tạo mới</button>
          </div>
        </form>
      )}

      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f5f7fa', color: '#666', borderBottom: '2px solid #eee' }}>
            <tr>
              <th style={{ padding: '12px' }}>Thông tin</th>
              <th style={{ padding: '12px' }}>Vai trò hiện tại</th>
              <th style={{ padding: '12px' }}>Trạng thái</th>
              <th style={{ padding: '12px' }}>Thao tác quản trị</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map(staff => (
              <tr key={staff.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>
                    <strong>{staff.name}</strong> <br/> <small style={{color: '#888'}}>@{staff.username}</small>
                </td>
                <td style={{ padding: '12px', color: '#003366', fontWeight: 'bold' }}>
                    {roleName(staff.role)}
                </td>
                <td style={{ padding: '12px' }}>
                    {staff.status === 'suspended' ? 
                        <span style={{color: 'red', fontWeight: 'bold'}}>Đã đình chỉ</span> : 
                        <span style={{color: 'green'}}>Hoạt động</span>}
                </td>
                <td style={{ padding: '12px' }}>
                  {isChief ? (
                    <div style={{display: 'flex', gap: '5px', flexWrap: 'wrap'}}>
                      {appointMode === staff.id ? (
                        <>
                          <select onChange={(e) => handleAppoint(staff.id, e.target.value)} defaultValue="" style={{padding: '5px'}}>
                            <option value="" disabled>Chọn cấp độ...</option>
                            <option value="staff">Staff (Nhân viên)</option>
                            <option value="op">Operational Admin</option>
                            <option value="reg">Regulatory Admin</option>
                          </select>
                          <button onClick={() => setAppointMode(null)} style={{background: '#999', color: 'white', border: 'none', borderRadius: '4px'}}>Hủy</button>
                        </>
                      ) : (
                        <button 
                            onClick={() => setAppointMode(staff.id)}
                            style={{background: '#003366', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', boxShadow: '0 2px 0 #002244'}}
                        >
                            🎖️ Bổ nhiệm
                        </button>
                      )}
                      
                      <button onClick={() => toggleSuspend(staff)} style={{background: staff.status === 'suspended'?'#28a745':'#d32f2f', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}>
                        {staff.status === 'suspended' ? 'Mở lại' : 'Đình chỉ'}
                      </button>
                      <button onClick={() => handleResetPassword(staff.id)} style={{background: '#ffc107', color: 'black', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}>MK</button>
                      <button onClick={() => handleDelete(staff.id)} style={{background: '#666', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}>Xóa</button>
                    </div>
                  ) : (
                    <span style={{color: '#999', fontStyle: 'italic'}}>Chỉ xem</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffManager;
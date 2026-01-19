import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const FacilityCheck = () => {
  const { user } = useAuth();
  const { addFacilityLog } = useData();
  const [checkType, setCheckType] = useState('Đầu giờ'); // Đầu giờ hoặc Cuối giờ

  const items = ['Máy lạnh', 'Đèn chiếu sáng', 'Máy chiếu', 'Vệ sinh phòng', 'Bàn ghế'];
  
  // State lưu trạng thái từng món: { 'Máy lạnh': 'Tốt', ... }
  const [statusMap, setStatusMap] = useState({});

  const handleStatusChange = (item, status) => {
    setStatusMap(prev => ({ ...prev, [item]: status }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lưu log cho từng món
    items.forEach(item => {
      addFacilityLog({
        staffName: user.name,
        type: checkType,
        item: item,
        status: statusMap[item] || 'Chưa kiểm tra',
        time: new Date()
      });
    });
    alert(`Đã gửi báo cáo kiểm tra ${checkType}!`);
    setStatusMap({});
  };

  return (
    <div>
      <h2>Kiểm tra Cơ sở vật chất</h2>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ marginRight: '10px' }}><strong>Thời điểm:</strong></label>
        <select value={checkType} onChange={e => setCheckType(e.target.value)}>
          <option value="Đầu giờ">Đầu giờ</option>
          <option value="Cuối giờ">Cuối giờ</option>
        </select>
      </div>

      <form onSubmit={handleSubmit}>
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', marginBottom: '20px', background: 'white' }}>
          <thead>
            <tr>
              <th>Hạng mục</th>
              <th>Tình trạng</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item}>
                <td>{item}</td>
                <td>
                  <label style={{ marginRight: '15px' }}>
                    <input 
                      type="radio" 
                      name={item} 
                      value="Tốt" 
                      onChange={() => handleStatusChange(item, 'Tốt')} 
                      required
                    /> Tốt
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name={item} 
                      value="Hỏng" 
                      onChange={() => handleStatusChange(item, 'Hỏng')} 
                    /> Hỏng/Bẩn
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="submit">Gửi báo cáo</button>
      </form>
    </div>
  );
};

export default FacilityCheck;
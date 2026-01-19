import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { formatDate } from '../../utils/helpers';

const Attendance = () => {
  const { user } = useAuth();
  const { addAttendance, attendanceLogs } = useData();

  const handleCheck = (type) => {
    addAttendance({
      staffName: user.name,
      staffId: user.id,
      type: type,
      time: new Date()
    });
    alert(`Bạn đã ${type} thành công!`);
  };

  // Lọc lịch sử của riêng user này
  const myHistory = attendanceLogs.filter(l => l.staffId === user.id);

  return (
    <div>
      <h2>Điểm danh Nhân sự</h2>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <button 
          onClick={() => handleCheck('Check-in')} 
          style={{ padding: '15px 30px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          CHECK-IN (Đầu giờ)
        </button>
        <button 
          onClick={() => handleCheck('Check-out')}
          style={{ padding: '15px 30px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          CHECK-OUT (Cuối giờ)
        </button>
      </div>

      <h3>Lịch sử của bạn</h3>
      <ul>
        {myHistory.map((h, i) => (
          <li key={i}>{h.type} --- {formatDate(h.time)}</li>
        ))}
      </ul>
    </div>
  );
};

export default Attendance;
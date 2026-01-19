import React from 'react';
import { useData } from '../../context/DataContext';
import { formatDate } from '../../utils/helpers'; // Đảm bảo bạn đã import đúng helper này nếu sử dụng

const Reports = () => {
  const { attendanceLogs, facilityLogs, tasks, staffList } = useData();

  return (
    <div>
      <h2>Báo cáo tổng hợp</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Cột 1: Lịch sử Điểm danh */}
        <div>
          <h3>Lịch sử Điểm danh</h3>
          <ul style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px' }}>
            {attendanceLogs.length === 0 && <p>Chưa có dữ liệu</p>}
            {attendanceLogs.map((log, index) => (
              <li key={index} style={{ marginBottom: '5px', borderBottom: '1px solid #eee' }}>
                <strong>{log.staffName}</strong>: {log.type} lúc {formatDate(log.time)}
              </li>
            ))}
          </ul>
        </div>

        {/* Cột 2: Báo cáo CSVC */}
        <div>
          <h3>Báo cáo CSVC (Bất thường)</h3>
          <ul style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px' }}>
            {facilityLogs.filter(l => l.status === 'Hỏng').length === 0 && <p>Hệ thống CSVC ổn định</p>}
            {facilityLogs.filter(l => l.status === 'Hỏng').map((log, index) => (
              <li key={index} style={{ color: 'red', marginBottom: '5px' }}>
                <strong>{log.item}</strong> bị hỏng. Báo cáo bởi {log.staffName} ({log.type} - {formatDate(log.time)})
              </li>
            ))}
          </ul>
        </div>
        
        {/* Phần mới: Báo cáo tiến độ & Giải trình */}
        <div style={{ gridColumn: 'span 2', marginTop: '20px' }}>
          <h3>Báo cáo tiến độ công việc & Giải trình</h3>
          <table border="1" style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
            <thead style={{ background: '#f5f5f5' }}>
              <tr>
                <th>Nhân sự</th>
                <th>Công việc</th>
                <th>Tiến độ</th>
                {/* ĐÃ SỬA LỖI TẠI DÒNG DƯỚI ĐÂY: thay < bằng &lt; */}
                <th>Lý do giải trình (nếu &lt; 90%)</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => {
                const staff = staffList.find(s => s.id === task.assigneeId);
                return (
                  <tr key={task.id}>
                    <td style={{ padding: '10px' }}>{staff?.name}</td>
                    <td style={{ padding: '10px' }}>{task.title}</td>
                    <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: task.progress < 90 ? 'red' : 'green' }}>
                      {task.progress}%
                    </td>
                    <td style={{ padding: '10px', color: '#555', fontStyle: 'italic' }}>
                      {task.progress < 90 ? (task.reason || 'Chưa có giải trình') : 'N/A'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
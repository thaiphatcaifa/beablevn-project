import React from 'react';
import { useData } from '../../context/DataContext';
import { formatDate } from '../../utils/helpers';

const Reports = () => {
  const { attendanceLogs, facilityLogs, staffList } = useData();

  return (
    <div>
      <h2>Báo cáo tổng hợp</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
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
      </div>
    </div>
  );
};

export default Reports;
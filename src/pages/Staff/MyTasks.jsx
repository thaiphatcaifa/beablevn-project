import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const MyTasks = () => {
  const { user } = useAuth();
  const { tasks, updateTaskProgress } = useData();
  // State lưu lý do nhập tạm thời để không ghi đè ngay lập tức vào context khi đang gõ
  const [tempReasons, setTempReasons] = useState({});

  const myTasks = tasks.filter(t => t.assigneeId === user.id);

  const handleConfirmUpdate = (taskId, currentProgress) => {
    const reason = tempReasons[taskId] || '';
    
    // Logic kiểm tra: Nếu dưới 90% mà không có lý do giải thích
    if (currentProgress < 90 && !reason.trim()) {
      alert("Thông báo: Bạn bắt buộc phải nhập lý do giải thích khi mức độ hoàn thành dưới 90%!");
      return;
    }

    updateTaskProgress(taskId, currentProgress, reason);
    alert("Cập nhật tiến độ thành công!");
  };

  return (
    <div>
      <h2>Công việc của tôi</h2>
      {myTasks.length === 0 ? <p>Hiện chưa có công việc được giao.</p> : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {myTasks.map(task => (
            <div key={task.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', background: 'white' }}>
              <h4>{task.title}</h4>
              <label>Mức độ hoàn thành: <strong>{task.progress}%</strong></label>
              <br />
              <input 
                type="range" 
                min="0" max="100" 
                value={task.progress} 
                onChange={(e) => updateTaskProgress(task.id, parseInt(e.target.value), task.reason)}
                style={{ width: '100%', marginTop: '10px' }}
              />

              {/* Hiển thị ô nhập lý do nếu tiến độ dưới 90% */}
              {task.progress < 90 && (
                <div style={{ marginTop: '15px' }}>
                  <p style={{ color: 'red', fontSize: '0.9rem', marginBottom: '5px' }}>
                    * Tiến độ dưới 90% cần có lý do giải thích
                  </p>
                  <textarea
                    placeholder="Nhập lý do tại đây..."
                    value={tempReasons[task.id] !== undefined ? tempReasons[task.id] : task.reason}
                    onChange={(e) => setTempReasons({ ...tempReasons, [task.id]: e.target.value })}
                    style={{ width: '100%', height: '60px', padding: '8px', borderRadius: '4px', border: '1px solid #ff4d4f' }}
                  />
                </div>
              )}

              <button 
                onClick={() => handleConfirmUpdate(task.id, task.progress)}
                style={{ 
                  marginTop: '15px', 
                  padding: '8px 20px', 
                  background: '#1890ff', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}
              >
                Xác nhận cập nhật
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTasks;
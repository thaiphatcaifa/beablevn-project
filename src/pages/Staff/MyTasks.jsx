import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const MyTasks = () => {
  const { user } = useAuth();
  const { tasks, updateTaskProgress } = useData();

  // Lọc task của user hiện tại
  const myTasks = tasks.filter(t => t.assigneeId === user.id);

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
                onChange={(e) => updateTaskProgress(task.id, parseInt(e.target.value))}
                style={{ width: '100%', marginTop: '10px' }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTasks;
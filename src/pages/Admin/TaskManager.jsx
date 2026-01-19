import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

const TaskManager = () => {
  const { staffList, tasks, addTask } = useData();
  const [taskTitle, setTaskTitle] = useState('');
  const [assigneeId, setAssigneeId] = useState('');

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!assigneeId) return alert("Vui lòng chọn nhân sự!");
    addTask({ title: taskTitle, assigneeId: parseInt(assigneeId) });
    setTaskTitle('');
    alert("Đã giao việc thành công");
  };

  return (
    <div>
      <h2>Giao đầu việc</h2>
      <form onSubmit={handleCreateTask} style={{ marginBottom: '30px', padding: '20px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input 
            placeholder="Tên đầu việc" 
            value={taskTitle} 
            onChange={e => setTaskTitle(e.target.value)} 
            required 
            style={{ width: '300px', padding: '8px' }}
          />
          <select 
            value={assigneeId} 
            onChange={e => setAssigneeId(e.target.value)} 
            required 
            style={{ padding: '8px' }}
          >
            <option value="">-- Chọn nhân sự --</option>
            {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <button 
            type="submit" 
            style={{ 
              background: '#003366', 
              color: 'white', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '5px', 
              fontWeight: 'bold', 
              cursor: 'pointer' 
            }}
          >
            KHỞI TẠO CÔNG VIỆC
          </button>
        </div>
      </form>

      <h3>Danh sách công việc đang thực hiện</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map(t => {
          const staff = staffList.find(s => s.id === t.assigneeId);
          return (
            <li key={t.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
              <strong>{t.title}</strong> - Giao cho: {staff?.name} - Tiến độ: {t.progress}%
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TaskManager;
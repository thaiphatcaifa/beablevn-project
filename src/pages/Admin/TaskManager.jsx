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
      <form onSubmit={handleCreateTask} style={{ marginBottom: '20px' }}>
        <input 
          placeholder="Tên đầu việc" 
          value={taskTitle} 
          onChange={e => setTaskTitle(e.target.value)} 
          required 
          style={{ width: '300px', marginRight: '10px' }}
        />
        <select value={assigneeId} onChange={e => setAssigneeId(e.target.value)} required>
          <option value="">-- Chọn nhân sự --</option>
          {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <button type="submit" style={{ marginLeft: '10px' }}>Giao việc</button>
      </form>

      <h3>Danh sách công việc đang thực hiện</h3>
      <ul>
        {tasks.map(t => {
          const staff = staffList.find(s => s.id === t.assigneeId);
          return (
            <li key={t.id}>
              <strong>{t.title}</strong> - Giao cho: {staff?.name} - Tiến độ: {t.progress}%
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TaskManager;
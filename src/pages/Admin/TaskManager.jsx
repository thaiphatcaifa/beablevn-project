import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

const TaskManager = () => {
  const { user } = useAuth();
  const { staffList, tasks, addTask, updateTask, disciplineTypes, addProposal } = useData();
  
  // States cho form giao việc
  const [taskTitle, setTaskTitle] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [dates, setDates] = useState({ startDate: '', deadline: '' });
  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  
  // States cho tính năng lặp lại (Recurrence)
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState('daily'); // daily, weekly, monthly
  const [fixedTime, setFixedTime] = useState(''); // Khung giờ cố định

  // States cho Cover/Chuyển việc
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [newAssigneeId, setNewAssigneeId] = useState('');

  // Chỉ Operational Admin và Chief mới được giao việc
  const canAssign = user?.role === 'op' || user?.role === 'chief';

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!assigneeId) return alert("Vui lòng chọn nhân sự!");
    if (!dates.startDate || !dates.deadline) return alert("Vui lòng chọn đầy đủ ngày tháng!");
    if (!selectedDiscipline) return alert("Vui lòng chọn hình thức kỷ luật!");

    addTask({ 
      title: taskTitle, 
      assigneeId: parseInt(assigneeId),
      startDate: dates.startDate,
      deadline: dates.deadline,
      discipline: selectedDiscipline,
      // Dữ liệu lặp lại
      isRecurring: isRecurring,
      recurrenceType: isRecurring ? recurrenceType : null,
      fixedTime: isRecurring ? fixedTime : null,
      assignerId: user.id // Lưu người giao việc
    });

    // Reset form
    setTaskTitle('');
    setDates({ startDate: '', deadline: '' });
    setSelectedDiscipline('');
    setAssigneeId('');
    setIsRecurring(false);
    setFixedTime('');
    alert("Đã giao việc thành công");
  };

  const saveCover = (taskId) => {
    if (!newAssigneeId) return alert("Chọn người nhận việc!");
    updateTask(taskId, { assigneeId: parseInt(newAssigneeId) });
    setEditingTaskId(null);
    alert("Đã chuyển người (Cover) thành công!");
  };

  // Tính năng đề xuất kỷ luật (dành cho Op Admin với task đã xong nhưng tệ hoặc task trễ)
  const handleProposeDiscipline = (task) => {
    const reason = prompt("Nhập lý do đề xuất kỷ luật bổ sung:");
    if(reason) {
        addProposal({
            taskId: task.id,
            staffId: task.assigneeId,
            proposerId: user.id,
            reason: reason,
            suggestedDiscipline: task.discipline,
            date: new Date().toISOString()
        });
        alert("Đã gửi đề xuất lên Regulatory Administrator!");
    }
  };

  if (!canAssign) return <h3 style={{color: 'red'}}>Bạn không có quyền truy cập chức năng này (Chỉ Operational/Chief Admin).</h3>;

  return (
    <div>
      <h2 style={{color: '#003366'}}>Điều phối công việc (Operational)</h2>
      
      <form onSubmit={handleCreateTask} style={{ marginBottom: '30px', padding: '20px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* Tên việc & Người nhận */}
          <div style={{ display: 'flex', gap: '15px' }}>
            <input placeholder="Tên đầu việc..." value={taskTitle} onChange={e => setTaskTitle(e.target.value)} required style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}/>
            <select value={assigneeId} onChange={e => setAssigneeId(e.target.value)} required style={{ padding: '10px', width: '250px', border: '1px solid #ccc', borderRadius: '4px' }}>
              <option value="">-- Chọn nhân sự --</option>
              {staffList.filter(s => s.role === 'staff').map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          {/* Ngày tháng */}
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
                <label style={{fontWeight: 'bold'}}>Ngày bắt đầu:</label>
                <input type="date" value={dates.startDate} onChange={e => setDates({...dates, startDate: e.target.value})} required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div style={{ flex: 1 }}>
                <label style={{fontWeight: 'bold'}}>Deadline:</label>
                <input type="date" value={dates.deadline} onChange={e => setDates({...dates, deadline: e.target.value})} required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
          </div>

          {/* Cấu hình lặp lại */}
          <div style={{ padding: '10px', background: '#e6f7ff', borderRadius: '4px', border: '1px dashed #1890ff' }}>
            <label style={{fontWeight: 'bold', display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                <input type="checkbox" checked={isRecurring} onChange={e => setIsRecurring(e.target.checked)} style={{marginRight: '10px', width: '18px', height: '18px'}} />
                Công việc lặp lại (Recurring)
            </label>
            {isRecurring && (
                <div style={{marginTop: '10px', display: 'flex', gap: '15px', alignItems: 'center'}}>
                    <select value={recurrenceType} onChange={e => setRecurrenceType(e.target.value)} style={{padding: '5px'}}>
                        <option value="daily">Hàng ngày</option>
                        <option value="weekly">Hàng tuần</option>
                        <option value="monthly">Hàng tháng</option>
                    </select>
                    <input type="text" placeholder="Khung giờ cố định (VD: 8:00 - 10:00)" value={fixedTime} onChange={e => setFixedTime(e.target.value)} style={{flex: 1, padding: '5px'}} />
                </div>
            )}
          </div>

          {/* Chọn hình thức kỷ luật từ danh sách của Reg Admin */}
          <div>
             <label style={{ display: 'block', marginBottom: '5px', color: '#d32f2f', fontWeight: 'bold' }}>⚠️ Áp dụng khung kỷ luật:</label>
             <select 
                value={selectedDiscipline} 
                onChange={e => setSelectedDiscipline(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', border: '1px solid #d32f2f', borderRadius: '4px', color: '#d32f2f', fontWeight: 'bold' }}
             >
                <option value="">-- Chọn hình thức xử lý vi phạm --</option>
                {disciplineTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                ))}
             </select>
          </div>

          <button type="submit" style={{ background: '#003366', color: 'white', border: 'none', padding: '12px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
            GIAO VIỆC
          </button>
        </div>
      </form>

      {/* Danh sách Tasks */}
      <h3>Danh sách công việc & Điều phối</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map(t => {
          const staff = staffList.find(s => s.id === t.assigneeId);
          const isEditing = editingTaskId === t.id;
          return (
            <li key={t.id} style={{ padding: '15px', border: '1px solid #eee', background: 'white', marginBottom: '10px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                   <div style={{fontWeight: 'bold', fontSize: '1.1rem', color: '#003366'}}>
                        {t.title} 
                        {t.isRecurring && <span style={{fontSize: '0.8rem', background: '#1890ff', color: 'white', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px'}}>↻ {t.recurrenceType}</span>}
                   </div>
                   <div style={{ fontSize: '0.9rem', color: '#555', marginTop: '5px' }}>
                      {t.fixedTime && <span>🕒 {t.fixedTime} | </span>}
                      📅 {t.startDate} ➝ {t.deadline}
                   </div>
                   <div style={{ color: '#d32f2f', fontSize: '0.9rem', marginTop: '5px' }}>❌ {t.discipline}</div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                   {/* Khu vực chuyển người (Cover) */}
                   <div style={{ marginBottom: '10px' }}>
                      {isEditing ? (
                        <div style={{display: 'flex', gap: '5px'}}>
                           <select value={newAssigneeId} onChange={e => setNewAssigneeId(e.target.value)}>
                             <option value="">Chọn người thay...</option>
                             {staffList.filter(s => s.role === 'staff').map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                           </select>
                           <button onClick={() => saveCover(t.id)}>OK</button>
                           <button onClick={() => setEditingTaskId(null)}>Hủy</button>
                        </div>
                      ) : (
                        <div>
                            <strong>{staff?.name}</strong> <br/>
                            <button onClick={() => setEditingTaskId(t.id)} style={{fontSize: '0.8rem', cursor: 'pointer', marginTop: '5px'}}>🔄 Chuyển/Cover</button>
                        </div>
                      )}
                   </div>
                   
                   {/* Nút đề xuất kỷ luật bổ sung */}
                   <button onClick={() => handleProposeDiscipline(t)} style={{background: '#d32f2f', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem'}}>
                     ⚖️ Đề xuất xử lý
                   </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TaskManager;
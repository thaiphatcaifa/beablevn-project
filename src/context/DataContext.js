import React, { createContext, useState, useContext, useEffect } from 'react';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const getInitialData = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  // 1. Dữ liệu Staff (Mặc định thêm các Admin mẫu để test)
  const [staffList, setStaffList] = useState(() => getInitialData('staffList', [
    { id: 1, username: 'chief', password: '123', name: 'Sếp Tổng', role: 'chief', status: 'active' },
    { id: 2, username: 'reg', password: '123', name: 'Trưởng Ban Kỷ Luật', role: 'reg', status: 'active' },
    { id: 3, username: 'op', password: '123', name: 'Trưởng Vận Hành', role: 'op', status: 'active' },
    { id: 4, username: 'nv1', password: '123', name: 'Nguyễn Văn A', role: 'staff', status: 'active' },
  ]));

  // 2. Danh sách hình thức kỷ luật (Do Reg quản lý)
  const [disciplineTypes, setDisciplineTypes] = useState(() => getInitialData('disciplineTypes', [
    'Trừ 10% KPI', 'Cảnh cáo toàn công ty', 'Trừ 1 ngày lương', 'Sa thải'
  ]));

  // 3. Danh sách đề xuất kỷ luật (Op đề xuất -> Reg duyệt)
  const [proposals, setProposals] = useState(() => getInitialData('proposals', []));

  // 4. Dữ liệu Tasks
  const [tasks, setTasks] = useState(() => getInitialData('tasks', []));
  const [attendanceLogs, setAttendanceLogs] = useState(() => getInitialData('attendanceLogs', []));
  const [facilityLogs, setFacilityLogs] = useState(() => getInitialData('facilityLogs', []));

  // --- PERSISTENCE ---
  useEffect(() => { localStorage.setItem('staffList', JSON.stringify(staffList)); }, [staffList]);
  useEffect(() => { localStorage.setItem('tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('disciplineTypes', JSON.stringify(disciplineTypes)); }, [disciplineTypes]);
  useEffect(() => { localStorage.setItem('proposals', JSON.stringify(proposals)); }, [proposals]);

  // --- ACTIONS ---

  // STAFF ACTIONS
  const addStaff = (s) => setStaffList([...staffList, { ...s, id: Date.now(), status: 'active' }]);
  const deleteStaff = (id) => setStaffList(staffList.filter(staff => staff.id !== id));
  const updatePassword = (id, newPass) => setStaffList(staffList.map(s => s.id === id ? { ...s, password: newPass } : s));
  
  // Hàm cập nhật trạng thái (Đình chỉ/Mở lại) HOẶC Bổ nhiệm Role
  const updateStaffInfo = (id, updates) => {
    setStaffList(staffList.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  // DISCIPLINE ACTIONS
  const addDisciplineType = (type) => setDisciplineTypes([...disciplineTypes, type]);
  const removeDisciplineType = (type) => setDisciplineTypes(disciplineTypes.filter(t => t !== type));
  
  const addProposal = (prop) => setProposals([...proposals, { ...prop, id: Date.now(), status: 'Pending' }]);
  const updateProposalStatus = (id, status) => {
    setProposals(proposals.map(p => p.id === id ? { ...p, status: status } : p));
  };

  // TASK ACTIONS
  const addTask = (t) => setTasks([...tasks, { 
    ...t, id: Date.now(), progress: 0, reason: '', completedDate: null 
  }]);
  
  const updateTask = (taskId, newDat) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, ...newDat } : t));
  };

  const updateTaskProgress = (id, p, reason = '') => {
    const now = new Date().toISOString().split('T')[0];
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, progress: p, reason: reason, completedDate: p === 100 ? now : null } : t
    ));
  };

  const addAttendance = (log) => setAttendanceLogs([...attendanceLogs, log]);
  const addFacilityLog = (log) => setFacilityLogs([...facilityLogs, log]);

  return (
    <DataContext.Provider value={{ 
      staffList, addStaff, deleteStaff, updatePassword, updateStaffInfo,
      disciplineTypes, addDisciplineType, removeDisciplineType,
      proposals, addProposal, updateProposalStatus,
      tasks, addTask, updateTask, updateTaskProgress, 
      attendanceLogs, addAttendance, facilityLogs, addFacilityLog 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
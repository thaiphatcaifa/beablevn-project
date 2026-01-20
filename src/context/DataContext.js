import React, { createContext, useState, useContext, useEffect } from 'react';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  // Hàm helper cho các dữ liệu chưa chuyển sang DB (như tasks, settings...)
  const getInitialData = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  // --- 1. Dữ liệu Staff (Chuyển sang dùng JSON Server) ---
  const [staffList, setStaffList] = useState([]);
  const API_URL = 'http://localhost:5000/staff';

  // Load danh sách nhân sự từ file db.json khi app chạy
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setStaffList(data))
      .catch(err => console.error("Không kết nối được với JSON Server:", err));
  }, []);

  // --- 2. Các dữ liệu khác (Vẫn giữ LocalStorage tạm thời) ---
  const [disciplineTypes, setDisciplineTypes] = useState(() => getInitialData('disciplineTypes', ['Trừ 10% KPI', 'Cảnh cáo', 'Sa thải']));
  const [proposals, setProposals] = useState(() => getInitialData('proposals', []));
  const [tasks, setTasks] = useState(() => getInitialData('tasks', []));
  const [attendanceLogs, setAttendanceLogs] = useState(() => getInitialData('attendanceLogs', []));
  const [facilityLogs, setFacilityLogs] = useState(() => getInitialData('facilityLogs', []));

  // --- PERSISTENCE (Cho các dữ liệu LocalStorage) ---
  useEffect(() => { localStorage.setItem('tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('disciplineTypes', JSON.stringify(disciplineTypes)); }, [disciplineTypes]);
  useEffect(() => { localStorage.setItem('proposals', JSON.stringify(proposals)); }, [proposals]);

  // --- ACTIONS (Cập nhật để gọi API) ---

  // STAFF ACTIONS (Đã update Fetch)
  const addStaff = (s) => {
    const newStaff = { ...s, id: Date.now(), status: 'active' };
    
    // Cập nhật UI ngay
    setStaffList([...staffList, newStaff]);
    
    // Lưu xuống file db.json
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStaff)
    });
  };

  const deleteStaff = (id) => {
    // Cập nhật UI
    setStaffList(staffList.filter(staff => staff.id !== id));
    
    // Xóa trong file db.json
    fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  };

  const updatePassword = (id, newPass) => {
    updateStaffInfo(id, { password: newPass });
  };
  
  // Hàm cập nhật thông tin chung (dùng cho cả Edit, Appoint, Suspend)
  const updateStaffInfo = (id, updates) => {
    // Cập nhật UI
    setStaffList(staffList.map(s => s.id === id ? { ...s, ...updates } : s));
    
    // Cập nhật file db.json (PATCH)
    fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
  };

  // --- CÁC ACTION KHÁC (Giữ nguyên logic cũ) ---
  const addDisciplineType = (type) => setDisciplineTypes([...disciplineTypes, type]);
  const removeDisciplineType = (type) => setDisciplineTypes(disciplineTypes.filter(t => t !== type));
  
  const addProposal = (prop) => setProposals([...proposals, { ...prop, id: Date.now(), status: 'Pending' }]);
  const updateProposalStatus = (id, status) => {
    setProposals(proposals.map(p => p.id === id ? { ...p, status: status } : p));
  };

  const addTask = (t) => setTasks([...tasks, { ...t, id: Date.now(), progress: 0, reason: '', completedDate: null }]);
  const updateTask = (taskId, newDat) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, ...newDat } : t));
  };
  const updateTaskProgress = (id, p, reason = '') => {
    const now = new Date().toISOString().split('T')[0];
    setTasks(tasks.map(t => t.id === id ? { ...t, progress: p, reason: reason, completedDate: p === 100 ? now : null } : t));
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
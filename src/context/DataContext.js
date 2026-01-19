import React, { createContext, useState, useContext } from 'react';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [staffList, setStaffList] = useState([
    { id: 1, username: 'nv1', password: '123', name: 'Nguyễn Văn A', role: 'staff' }
  ]);
  const [tasks, setTasks] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [facilityLogs, setFacilityLogs] = useState([]);

  const addStaff = (s) => setStaffList([...staffList, { ...s, id: Date.now() }]);
  
  const deleteStaff = (id) => {
    setStaffList(staffList.filter(staff => staff.id !== id));
  };

  const addTask = (t) => setTasks([...tasks, { ...t, id: Date.now(), progress: 0, reason: '' }]);

  // Cập nhật: Thêm tham số reason để lưu lý do giải thích
  const updateTaskProgress = (id, p, reason = '') => 
    setTasks(tasks.map(t => t.id === id ? { ...t, progress: p, reason: reason } : t));

  const addAttendance = (log) => setAttendanceLogs([...attendanceLogs, log]);
  const addFacilityLog = (log) => setFacilityLogs([...facilityLogs, log]);

  return (
    <DataContext.Provider value={{ 
      staffList, addStaff, deleteStaff, tasks, addTask, 
      updateTaskProgress, attendanceLogs, addAttendance, facilityLogs, addFacilityLog 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
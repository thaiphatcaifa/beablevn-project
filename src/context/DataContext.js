import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../firebase'; 
import { ref, onValue, set, update, remove } from "firebase/database";

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  // --- STATES ---
  const [staffList, setStaffList] = useState([]);
  const [tasks, setTasks] = useState([]);
  // THÊM MỚI: State cho Ca làm việc và Chấm công
  const [shifts, setShifts] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  
  // LocalStorage cho dữ liệu cấu hình
  const getInitialData = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const [disciplineTypes, setDisciplineTypes] = useState(() => getInitialData('disciplineTypes', [
    'Nhắc nhở miệng',
    'Trừ 5% KPI tháng',
    'Cảnh cáo toàn công ty',
    'Đình chỉ công tác'
  ]));

  const [proposals, setProposals] = useState(() => getInitialData('proposals', []));

  // --- FIREBASE LISTENERS ---
  useEffect(() => {
    // 1. STAFF
    const staffRef = ref(db, 'staff');
    const unsubStaff = onValue(staffRef, (snapshot) => {
      const data = snapshot.val();
      const list = data ? Object.keys(data).map(key => ({ 
        ...data[key], 
        id: key, 
        positions: data[key].positions || [] 
      })) : [];
      setStaffList(list);
    });

    // 2. TASKS
    const tasksRef = ref(db, 'tasks');
    const unsubTasks = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      const list = data ? Object.keys(data).map(key => ({ ...data[key], id: key })) : [];
      setTasks(list);
    });

    // 3. SHIFTS (THÊM MỚI: Lắng nghe dữ liệu Ca làm việc)
    const shiftsRef = ref(db, 'shifts');
    const unsubShifts = onValue(shiftsRef, (snapshot) => {
      const data = snapshot.val();
      const list = data ? Object.keys(data).map(key => ({ ...data[key], id: key })) : [];
      setShifts(list);
    });

    // 4. ATTENDANCE (THÊM MỚI: Lắng nghe dữ liệu Chấm công)
    const attRef = ref(db, 'attendance');
    const unsubAtt = onValue(attRef, (snapshot) => {
      const data = snapshot.val();
      const list = data ? Object.keys(data).map(key => ({ ...data[key], id: key })) : [];
      setAttendanceLogs(list);
    });

    return () => { 
      unsubStaff(); 
      unsubTasks();
      unsubShifts();
      unsubAtt();
    };
  }, []);

  // --- SYNC LOCALSTORAGE ---
  useEffect(() => { localStorage.setItem('disciplineTypes', JSON.stringify(disciplineTypes)); }, [disciplineTypes]);
  useEffect(() => { localStorage.setItem('proposals', JSON.stringify(proposals)); }, [proposals]);

  // --- ACTIONS ---

  // Staff
  const addStaff = (s) => {
    const newId = Date.now().toString();
    set(ref(db, 'staff/' + newId), { ...s, id: newId });
  };
  const deleteStaff = (id) => remove(ref(db, 'staff/' + id));
  const updateStaffInfo = (id, updates) => update(ref(db, 'staff/' + id), updates);
  const updatePassword = (id, newPass) => updateStaffInfo(id, { password: newPass });

  // Tasks
  const addTask = (t) => {
    const newId = Date.now().toString();
    set(ref(db, 'tasks/' + newId), { 
      ...t, 
      id: newId, 
      progress: 0, 
      status: 'assigned',
      createdDate: new Date().toISOString()
    });
  };
  const updateTask = (taskId, newData) => update(ref(db, 'tasks/' + taskId), newData);
  const deleteTask = (taskId) => remove(ref(db, 'tasks/' + taskId));

  // Discipline
  const addDisciplineType = (type) => setDisciplineTypes([...disciplineTypes, type]);
  const removeDisciplineType = (type) => setDisciplineTypes(disciplineTypes.filter(t => t !== type));
  const addProposal = (prop) => setProposals([...proposals, { ...prop, id: Date.now(), status: 'Pending' }]);
  const updateProposalStatus = (id, status) => setProposals(proposals.map(p => p.id === id ? { ...p, status: status } : p));
  const deleteProposal = (id) => setProposals(proposals.filter(p => p.id !== id));

  // THÊM MỚI: Attendance Actions
  const addAttendance = (log) => {
    const newId = Date.now().toString();
    set(ref(db, 'attendance/' + newId), { ...log, id: newId });
  };

  return (
    <DataContext.Provider value={{ 
      staffList, addStaff, deleteStaff, updatePassword, updateStaffInfo,
      tasks, addTask, updateTask, deleteTask,
      disciplineTypes, addDisciplineType, removeDisciplineType,
      proposals, addProposal, updateProposalStatus, deleteProposal,
      // QUAN TRỌNG: Phải export các biến này ra
      shifts, attendanceLogs, addAttendance
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
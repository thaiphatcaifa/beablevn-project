import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../firebase'; // Import cấu hình database từ file firebase.js bạn vừa tạo
import { ref, onValue, set, update, remove } from "firebase/database";

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  // --- 1. STATES DỮ LIỆU ---
  const [staffList, setStaffList] = useState([]);
  const [tasks, setTasks] = useState([]);
  
  // Các dữ liệu phụ trợ tạm thời vẫn lưu LocalStorage (có thể đưa lên Firebase tương tự sau này)
  const getInitialData = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  const [disciplineTypes, setDisciplineTypes] = useState(() => getInitialData('disciplineTypes', ['Trừ 10% KPI', 'Cảnh cáo', 'Sa thải']));
  const [proposals, setProposals] = useState(() => getInitialData('proposals', []));
  const [attendanceLogs, setAttendanceLogs] = useState(() => getInitialData('attendanceLogs', []));
  const [facilityLogs, setFacilityLogs] = useState(() => getInitialData('facilityLogs', []));

  // --- 2. LẮNG NGHE DỮ LIỆU REALTIME TỪ FIREBASE ---
  useEffect(() => {
    // Lắng nghe danh sách nhân sự (Staff)
    const staffRef = ref(db, 'staff');
    const unsubStaff = onValue(staffRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Chuyển đổi object từ Firebase thành array để React dễ xử lý
        const list = Object.keys(data).map(key => ({
          ...data[key],
          firebaseKey: key // Lưu lại key để dùng cho update/delete
        }));
        setStaffList(list);
      } else {
        setStaffList([]);
      }
    });

    // Lắng nghe danh sách công việc (Tasks)
    const tasksRef = ref(db, 'tasks');
    const unsubTasks = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({
          ...data[key],
          firebaseKey: key
        }));
        setTasks(list);
      } else {
        setTasks([]);
      }
    });

    return () => {
      unsubStaff();
      unsubTasks();
    };
  }, []);

  // --- 3. ĐỒNG BỘ LOCALSTORAGE CHO DỮ LIỆU PHỤ ---
  useEffect(() => { localStorage.setItem('disciplineTypes', JSON.stringify(disciplineTypes)); }, [disciplineTypes]);
  useEffect(() => { localStorage.setItem('proposals', JSON.stringify(proposals)); }, [proposals]);

  // --- 4. CÁC HÀM THAO TÁC (ACTIONS) VỚI FIREBASE ---

  // STAFF ACTIONS
  const addStaff = (s) => {
    const newId = Date.now();
    const newStaff = { ...s, id: newId, status: 'active' };
    // Lưu vào node 'staff/{id}'
    set(ref(db, 'staff/' + newId), newStaff);
  };

  const deleteStaff = (id) => {
    if (window.confirm("Xác nhận xóa nhân sự này khỏi hệ thống?")) {
      remove(ref(db, 'staff/' + id));
    }
  };

  const updateStaffInfo = (id, updates) => {
    update(ref(db, 'staff/' + id), updates);
  };

  const updatePassword = (id, newPass) => {
    updateStaffInfo(id, { password: newPass });
  };

  // TASK ACTIONS
  const addTask = (t) => {
    const newId = Date.now();
    const newTask = { 
      ...t, 
      id: newId, 
      progress: 0, 
      reason: '', 
      completedDate: null 
    };
    set(ref(db, 'tasks/' + newId), newTask);
  };

  const updateTask = (taskId, newData) => {
    update(ref(db, 'tasks/' + taskId), newData);
  };

  const updateTaskProgress = (id, p, reason = '') => {
    const now = new Date().toISOString().split('T')[0];
    const updates = { 
      progress: p, 
      reason: reason, 
      completedDate: p === 100 ? now : null 
    };
    update(ref(db, 'tasks/' + id), updates);
  };

  // --- 5. CÁC HÀM CHO DỮ LIỆU PHỤ ---
  const addDisciplineType = (type) => setDisciplineTypes([...disciplineTypes, type]);
  const removeDisciplineType = (type) => setDisciplineTypes(disciplineTypes.filter(t => t !== type));
  
  const addProposal = (prop) => setProposals([...proposals, { ...prop, id: Date.now(), status: 'Pending' }]);
  const updateProposalStatus = (id, status) => {
    setProposals(proposals.map(p => p.id === id ? { ...p, status: status } : p));
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
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

const DisciplineManager = () => {
  const { user } = useAuth();
  const { disciplineTypes, addDisciplineType, removeDisciplineType, proposals, updateProposalStatus, staffList, tasks } = useData();
  const [newType, setNewType] = useState('');

  // Chỉ Reg và Chief được vào
  const canAccess = user?.role === 'reg' || user?.role === 'chief';

  const handleAddType = (e) => {
    e.preventDefault();
    if(newType.trim()) {
        addDisciplineType(newType);
        setNewType('');
    }
  };

  if (!canAccess) return <h3 style={{color: 'red'}}>Quyền hạn hạn chế. Vui lòng liên hệ Regulatory Admin.</h3>;

  return (
    <div>
      <h2 style={{color: '#003366'}}>Quản trị Quy chế & Kỷ luật (Regulatory)</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        
        {/* CỘT 1: QUẢN LÝ DANH MỤC */}
        <div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px' }}>
                <h4 style={{marginTop: 0}}>Ban hành Hình thức Kỷ luật mới</h4>
                <form onSubmit={handleAddType} style={{display: 'flex', gap: '10px'}}>
                    <input 
                        placeholder="Nhập tên hình thức (VD: Cảnh cáo cấp 2)..." 
                        value={newType} 
                        onChange={e => setNewType(e.target.value)} 
                        style={{flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                    />
                    <button type="submit" style={{background: '#003366', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer'}}>Ban hành</button>
                </form>

                <h5 style={{marginBottom: '10px'}}>Danh mục hiện hành:</h5>
                <ul style={{paddingLeft: '20px'}}>
                    {disciplineTypes.map((type, idx) => (
                        <li key={idx} style={{marginBottom: '5px'}}>
                            {type} 
                            <span 
                                onClick={() => { if(window.confirm('Xóa hình thức này?')) removeDisciplineType(type) }}
                                style={{color: 'red', cursor: 'pointer', marginLeft: '10px', fontWeight: 'bold'}}
                            >
                                [x]
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        {/* CỘT 2: DUYỆT ĐỀ XUẤT */}
        <div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <h4 style={{marginTop: 0}}>Duyệt Đề xuất từ Operational Admin</h4>
                {proposals.length === 0 ? <p style={{color: '#999'}}>Chưa có đề xuất nào.</p> : (
                    <ul style={{listStyle: 'none', padding: 0}}>
                        {proposals.map(prop => {
                            const staff = staffList.find(s => s.id === prop.staffId);
                            const proposer = staffList.find(s => s.id === prop.proposerId);
                            const task = tasks.find(t => t.id === prop.taskId);

                            return (
                                <li key={prop.id} style={{borderBottom: '1px solid #eee', padding: '10px 0'}}>
                                    <div style={{fontWeight: 'bold', color: '#d32f2f'}}>Đối tượng: {staff?.name}</div>
                                    <div style={{fontSize: '0.9rem'}}>Lỗi/Lý do: {prop.reason}</div>
                                    <div style={{fontSize: '0.9rem', color: '#555'}}>Đề xuất bởi: {proposer?.name} (Op Admin)</div>
                                    <div style={{fontSize: '0.9rem', fontStyle: 'italic'}}>Task liên quan: {task?.title}</div>
                                    
                                    <div style={{marginTop: '10px'}}>
                                        Status: <strong style={{color: prop.status==='Approved'?'green':(prop.status==='Rejected'?'red':'orange')}}>{prop.status}</strong>
                                        {prop.status === 'Pending' && (
                                            <div style={{marginTop: '5px'}}>
                                                <button onClick={() => updateProposalStatus(prop.id, 'Approved')} style={{marginRight: '5px', background: 'green', color: 'white', border: 'none', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer'}}>Duyệt</button>
                                                <button onClick={() => updateProposalStatus(prop.id, 'Rejected')} style={{background: 'red', color: 'white', border: 'none', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer'}}>Từ chối</button>
                                            </div>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default DisciplineManager;
import React, { useState, useEffect, useMemo, useRef } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import QRious from 'qrious';

// --- 내장 SVG 아이콘 컴포넌트 ---
const IconBase = ({ size = 24, className = "", fill = "none", children, ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...rest}>
    {children}
  </svg>
);

const CheckCircle = (p) => <IconBase {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></IconBase>;
const Clock = (p) => <IconBase {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></IconBase>;
const BookOpen = (p) => <IconBase {...p}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></IconBase>;
const Microscope = (p) => <IconBase {...p}><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/></IconBase>;
const Users = (p) => <IconBase {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></IconBase>;
const Star = (p) => <IconBase {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></IconBase>;
const Award = (p) => <IconBase {...p}><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></IconBase>;
const LogOut = (p) => <IconBase {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></IconBase>;
const Check = (p) => <IconBase {...p}><polyline points="20 6 9 17 4 12"/></IconBase>;
const X = (p) => <IconBase {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></IconBase>;
const AlertCircle = (p) => <IconBase {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></IconBase>;
const Edit2 = (p) => <IconBase {...p}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></IconBase>;
const Trash2 = (p) => <IconBase {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2 2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></IconBase>;
const Download = (p) => <IconBase {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></IconBase>;
const Lock = (p) => <IconBase {...p}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></IconBase>;
const UserPlus = (p) => <IconBase {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></IconBase>;
const ShieldAlert = (p) => <IconBase {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></IconBase>;
const UserCheck = (p) => <IconBase {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></IconBase>;
const QrCodeIcon = (p) => <IconBase {...p}><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></IconBase>;
const SortAsc = (p) => <IconBase {...p}><path d="M11 11h9"/><path d="M11 15h6"/><path d="M11 19h3"/><path d="M11 7h10"/><path d="M6 21V3"/><path d="M2 17l4 4 4-4"/></IconBase>;

// --- Firebase 설정 ---
const firebaseConfig = {
  apiKey: "AIzaSyCvslatUqinoFPE03kOJzp4ykBeHZuMuUU",
  authDomain: "myclass-certification.firebaseapp.com",
  projectId: "myclass-certification",
  storageBucket: "myclass-certification.firebasestorage.app",
  messagingSenderId: "999701003048",
  appId: "1:999701003048:web:c2fa44a0a6ac3e6fd42e1d"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();
const appId = 'my-school-class';

const getSubmissionsRef = () => db.collection('artifacts').doc(appId).collection('public').doc('data').collection('class_submissions');
const getUsersRef = () => db.collection('artifacts').doc(appId).collection('public').doc('data').collection('class_users');
const getSubmissionDoc = (id) => getSubmissionsRef().doc(id);
const getUserDoc = (name) => getUsersRef().doc(name);

const CATEGORIES = [
  { id: 1, title: '자기주도학습시간 (월 7시간 이상)', icon: Clock, type: 'monthly_hours' },
  { id: 2, title: '진로산책 프로그램', icon: Users, type: 'activity' },
  { id: 3, title: '독서를 품다', icon: BookOpen, type: 'activity' },
  { id: 4, title: '미래학자양성과정 / 심화연구', icon: Microscope, type: 'activity' },
  { id: 5, title: '과학/공학 교내 또는 프로젝트 봉사', icon: Star, type: 'activity' },
  { id: 6, title: '융합 STEAM 데이 전공 강좌', icon: Award, type: 'activity' },
  { id: 7, title: '과학/공학 관련 동아리 활동', icon: Users, type: 'activity' },
];

function App() {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [loginTab, setLoginTab] = useState('student');
  const [loginStudentNum, setLoginStudentNum] = useState(''); 
  const [loginName, setLoginName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [view, setView] = useState('dashboard');
  const [teacherTab, setTeacherTab] = useState('pending');
  const [filterCategory, setFilterCategory] = useState('all');
  const [listSortOrder, setListSortOrder] = useState('timeDesc'); 
  const [allViewMode, setAllViewMode] = useState('matrix'); 
  
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  const [showQrModal, setShowQrModal] = useState(false); 
  const [qrImageUrl, setQrImageUrl] = useState(''); 
  
  const [uploadText, setUploadText] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadTeacherText, setUploadTeacherText] = useState(''); 
  const [uploadTeacherMessage, setUploadTeacherMessage] = useState(''); 
  const [coTeacherInput, setCoTeacherInput] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formStudentName, setFormStudentName] = useState(''); 
  const [formCategory, setFormCategory] = useState(1);
  const [formDate, setFormDate] = useState(new Date().toISOString().slice(0, 10)); 
  const [formHours, setFormHours] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [submitMessage, setSubmitMessage] = useState({ text: '', type: '' });

  const formatName = (fullName, isTable = true) => {
    if (!fullName) return '';
    const match = String(fullName).trim().match(/^(\d+)\s*(.+)$/);
    if (match && match[1] && match[2]) {
      if (isTable) {
        return (
          <div className="inline-grid grid-cols-2 gap-2 w-36 items-center">
            <span className="text-center text-slate-500 font-normal tracking-widest">{match[1]}</span>
            <span className="text-center text-slate-800 font-bold">{match[2]}</span>
          </div>
        );
      } else {
        return (
          <span className="inline-flex items-center gap-3">
            <span className="text-slate-500 font-normal tracking-widest">{match[1]}</span>
            <span className="text-slate-800 font-bold">{match[2]}</span>
          </span>
        );
      }
    }
    return <span className="font-bold text-slate-800">{fullName}</span>;
  };

  useEffect(() => {
    const initAuth = async () => {
      try { await auth.signInAnonymously(); } catch (error) { console.error(error); }
    };
    initAuth();
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setFirebaseUser(user);
      setIsLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!firebaseUser) return;
    const unsubscribeSub = getSubmissionsRef().onSnapshot((snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => b.timestamp - a.timestamp);
      setSubmissions(data);
    });
    const unsubscribeUsers = getUsersRef().onSnapshot((snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, name: doc.id, ...doc.data() }));
      setAllUsers(data);
    });
    return () => { unsubscribeSub(); unsubscribeUsers(); };
  }, [firebaseUser]);

  useEffect(() => {
    if (showQrModal) {
      setTimeout(() => {
        try {
          const qr = new QRious({ value: window.location.href, size: 250, level: 'H' });
          setQrImageUrl(qr.toDataURL('image/png'));
        } catch(e) { console.error(e); }
      }, 50);
    } else {
      setQrImageUrl('');
    }
  }, [showQrModal]);

  const myMainTeacherName = useMemo(() => {
    if (!currentUser) return null;
    if (currentUser.role === 'student') return currentUser.teacherName;
    if (currentUser.role === 'admin') return null;
    const parentTeacher = allUsers.find(u => u.role === 'teacher' && Array.isArray(u.coTeachers) && u.coTeachers.includes(currentUser.name));
    if (parentTeacher) return parentTeacher.name;
    return currentUser.name;
  }, [currentUser, allUsers]);

  const myCoTeachers = useMemo(() => {
    if (!currentUser || currentUser.role !== 'teacher') return [];
    const me = allUsers.find(u => u.name === currentUser.name);
    return me?.coTeachers || [];
  }, [currentUser, allUsers]);

  const visibleSubmissions = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'admin') return submissions;
    return submissions.filter(s => {
      const sTeacher = s.teacherName || allUsers.find(u => u.name === s.studentName)?.teacherName;
      return sTeacher === myMainTeacherName;
    });
  }, [submissions, allUsers, currentUser, myMainTeacherName]);

  const classRoster = useMemo(() => {
    if (!currentUser) return [];
    let roster = [];
    if (currentUser.role === 'admin') {
      roster = allUsers.filter(u => u.role === 'student');
    } else {
      roster = allUsers.filter(u => u.role === 'student' && u.teacherName === myMainTeacherName);
    }
    return roster.sort((a, b) => a.name.localeCompare(b.name));
  }, [allUsers, currentUser, myMainTeacherName]);

  const teacherRoster = useMemo(() => {
    if (!currentUser || currentUser.role !== 'admin') return [];
    return allUsers.filter(u => u.role === 'teacher').sort((a, b) => a.name.localeCompare(b.name));
  }, [allUsers, currentUser]);

  const classStats = useMemo(() => {
    const stats = {};
    classRoster.forEach(student => {
      stats[student.name] = { name: student.name, categories: { 1: {}, 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] }, totalApprovals: 0 };
    });
    visibleSubmissions.forEach(sub => {
      if (!stats[sub.studentName]) {
        stats[sub.studentName] = { name: sub.studentName, categories: { 1: {}, 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] }, totalApprovals: 0 };
      }
      if (sub.status === 'approved') {
        stats[sub.studentName].totalApprovals++;
        if (sub.category === 1) {
          const subMonth = sub.month || (sub.date ? sub.date.substring(0, 7) : '미상');
          if (!stats[sub.studentName].categories[1][subMonth]) stats[sub.studentName].categories[1][subMonth] = { hours: 0, count: 0 };
          stats[sub.studentName].categories[1][subMonth].hours += Number(sub.hours);
          stats[sub.studentName].categories[1][subMonth].count += 1;
        } else {
          stats[sub.studentName].categories[sub.category].push(sub);
        }
      }
    });
    Object.values(stats).forEach(student => {
      const hasMetMonthlyGoal = Object.values(student.categories[1]).some(data => data.hours >= 7);
      let metCount = hasMetMonthlyGoal ? 1 : 0;
      for (let i = 2; i <= 7; i++) { if (student.categories[i].length > 0) metCount++; }
      student.metCount = metCount;
      student.isCertified = metCount === 7;
    });
    return Object.values(stats).sort((a, b) => b.metCount - a.metCount);
  }, [classRoster, visibleSubmissions]);

  const myStats = useMemo(() => {
    if (!currentUser || currentUser.role !== 'student') return null;
    return classStats.find(s => s.name === currentUser.name) || {
      name: currentUser.name, categories: { 1: {}, 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] }, metCount: 0, isCertified: false
    };
  }, [currentUser, classStats]);

  const sortedSubmissions = useMemo(() => {
    let filtered = filterCategory === 'all' ? visibleSubmissions : visibleSubmissions.filter(s => s.category === Number(filterCategory));
    let sorted = [...filtered];
    if (listSortOrder === 'nameAsc') sorted.sort((a, b) => a.studentName.localeCompare(b.studentName));
    else if (listSortOrder === 'nameDesc') sorted.sort((a, b) => b.studentName.localeCompare(a.studentName));
    else sorted.sort((a, b) => b.timestamp - a.timestamp);
    return sorted;
  }, [visibleSubmissions, filterCategory, listSortOrder]);

  const handleLogin = async (e) => {
    e.preventDefault(); setLoginError('');
    let targetId = '';
    if (loginTab === 'student') {
      const sNum = loginStudentNum.trim(); const sName = loginName.trim();
      if (!sNum || !sName) { setLoginError('학번과 이름을 모두 입력해주세요.'); return; }
      targetId = `${sNum} ${sName}`; 
    } else {
      const tName = loginName.trim();
      if (!tName) { setLoginError('선생님 이름 또는 ID를 입력해주세요.'); return; }
      targetId = tName;
    }
    const pwd = loginPassword.trim();
    if (!pwd || !firebaseUser) return;

    try {
      if (loginTab === 'teacher' && targetId === 'ycjhss' && pwd === 'didwptmd486!') {
        setCurrentUser({ role: 'admin', name: '전체관리자(ycjhss)' }); setView('teacher'); return;
      }
      const userSnap = await getUserDoc(targetId).get();
      if (loginTab === 'teacher') {
        if (userSnap.exists) {
          const uData = userSnap.data();
          if (uData.role !== 'teacher') { setLoginError('학생으로 등록된 이름입니다.'); return; }
          if (!uData.password) {
              await getUserDoc(targetId).update({ password: pwd });
              setCurrentUser({ role: 'teacher', name: targetId }); setView('teacher');
          } else if (uData.password === pwd) {
              setCurrentUser({ role: 'teacher', name: targetId }); setView('teacher');
          } else { setLoginError('비밀번호가 일치하지 않습니다.'); }
        } else { setLoginError('등록되지 않은 교사 계정입니다.'); }
      } else {
        if (!userSnap.exists) { setLoginError('명단에 없는 학번/이름입니다.'); return; }
        const uData = userSnap.data();
        if (uData.role !== 'student') { setLoginError('선생님으로 등록된 계정입니다.'); return; }
        if (!uData.password) {
          await getUserDoc(targetId).update({ password: pwd });
          setCurrentUser({ role: 'student', name: targetId, teacherName: uData.teacherName }); setView('dashboard');
        } else if (uData.password === pwd) {
          setCurrentUser({ role: 'student', name: targetId, teacherName: uData.teacherName }); setView('dashboard');
        } else { setLoginError('비밀번호가 일치하지 않습니다.'); }
      }
    } catch (error) { setLoginError('로그인 중 오류가 발생했습니다.'); }
  };

  const handleLogout = () => { setCurrentUser(null); setLoginStudentNum(''); setLoginName(''); setLoginPassword(''); setLoginError(''); resetForm(); };
  const resetForm = () => { setFormCategory(1); setFormDate(new Date().toISOString().slice(0, 10)); setFormHours(''); setFormDescription(''); setEditingId(null); setSubmitMessage({ text: '', type: '' }); setFormStudentName(''); };

  const handleSubmitActivity = async (e) => {
    e.preventDefault();
    if (!firebaseUser || !currentUser) return;
    if (currentUser.role !== 'student' && !editingId && !formStudentName) { setSubmitMessage({ text: '대상 학생을 선택해주세요.', type: 'error' }); return; }
    setSubmitMessage({ text: editingId ? '수정 중...' : '제출 중...', type: 'loading' });
    try {
      const dataToSave = {
        studentName: currentUser.role === 'student' ? currentUser.name : formStudentName,
        teacherName: myMainTeacherName, category: formCategory,
        date: formCategory === 1 ? formDate : null, month: formCategory === 1 ? formDate.substring(0, 7) : null,
        hours: formCategory === 1 ? Number(formHours) : null, description: formCategory === 1 ? '' : formDescription,
        status: currentUser.role !== 'student' ? 'approved' : 'pending',
      };
      if (editingId) {
        await getSubmissionDoc(editingId).update({ ...dataToSave, updatedAt: Date.now() });
        setSubmitMessage({ text: '성공적으로 수정되었습니다!', type: 'success' });
      } else {
        await getSubmissionsRef().add({ ...dataToSave, timestamp: Date.now() });
        setSubmitMessage({ text: '성공적으로 제출되었습니다!', type: 'success' });
      }
      setTimeout(() => { resetForm(); setView(currentUser.role === 'student' ? 'dashboard' : 'teacher'); }, 1500);
    } catch (error) { setSubmitMessage({ text: '오류가 발생했습니다.', type: 'error' }); }
  };

  const handleEditClick = (sub) => {
    setEditingId(sub.id); setFormCategory(sub.category);
    if (sub.category === 1) { setFormDate(sub.date || (sub.month ? `${sub.month}-01` : new Date().toISOString().slice(0, 10))); setFormHours(sub.hours?.toString() || ''); } 
    else { setFormDescription(sub.description || ''); }
    setView('submit');
  };

  const handleDelete = async (id) => { if (!firebaseUser) return; try { await getSubmissionDoc(id).delete(); } catch (error) {} };
  const handleReview = async (id, status) => { if (!firebaseUser) return; try { await getSubmissionDoc(id).update({ status }); } catch (error) {} };

  const handleUploadRoster = async () => {
    if (!uploadText.trim()) return; setUploadMessage('업로드 중...');
    const lines = uploadText.split('\n').map(n => n.trim()).filter(Boolean);
    let successCount = 0; let failCount = 0;
    try {
      for (const line of lines) {
        const parts = line.split(/[\s\t]+/);
        if (parts.length < 2) { failCount++; continue; }
        const docId = `${parts[0]} ${parts.slice(1).join(' ')}`;
        if (docId === 'ycjhss' || docId === currentUser.name) continue; 
        await getUserDoc(docId).set({ role: 'student', teacherName: myMainTeacherName }, { merge: true });
        successCount++;
      }
      setUploadMessage(`성공적으로 ${successCount}명의 명단을 업데이트했습니다.` + (failCount > 0 ? ` (${failCount}건 오류 건너뜀)` : ''));
      setUploadText(''); setTimeout(() => setUploadMessage(''), 4000);
    } catch (error) { setUploadMessage('오류가 발생했습니다.'); }
  };

  const handleUploadTeacherRoster = async () => {
    if (!uploadTeacherText.trim()) return; setUploadTeacherMessage('업로드 중...');
    const lines = uploadTeacherText.split('\n').map(n => n.trim()).filter(Boolean); let successCount = 0;
    try {
      for (const name of lines) {
        if (name === 'ycjhss') continue; 
        await getUserDoc(name).set({ role: 'teacher' }, { merge: true }); successCount++;
      }
      setUploadTeacherMessage(`성공적으로 ${successCount}명의 교사 명단을 등록했습니다.`);
      setUploadTeacherText(''); setTimeout(() => setUploadTeacherMessage(''), 4000);
    } catch (error) { setUploadTeacherMessage('오류가 발생했습니다.'); }
  };

  const handleAddCoTeacher = async () => {
    if (!coTeacherInput.trim() || !firebaseUser) return;
    try {
      const docRef = getUserDoc(currentUser.name); const docSnap = await docRef.get();
      const currentCoTeachers = docSnap.exists ? (docSnap.data().coTeachers || []) : [];
      if (!currentCoTeachers.includes(coTeacherInput.trim())) {
        await docRef.set({ coTeachers: firebase.firestore.FieldValue.arrayUnion(coTeacherInput.trim()) }, { merge: true });
        setUploadMessage(`부담임 선생님 추가됨.`); setCoTeacherInput('');
      } else { setUploadMessage(`이미 등록됨.`); }
      setTimeout(() => setUploadMessage(''), 3000);
    } catch (error) { setUploadMessage('오류 발생'); }
  };

  const handleRemoveCoTeacher = async (nameToRemove) => {
    try { await getUserDoc(currentUser.name).set({ coTeachers: firebase.firestore.FieldValue.arrayRemove(nameToRemove) }, { merge: true }); setUploadMessage('해제되었습니다.'); setTimeout(() => setUploadMessage(''), 3000); } catch (error) {}
  };

  const handleResetPassword = async (name) => { try { await getUserDoc(name).update({ password: null }); setUploadMessage(`비밀번호 초기화됨.`); setTimeout(() => setUploadMessage(''), 3000); } catch (error) {} };
  const handleDeleteStudent = (name) => { setDeleteTarget({ type: 'student', name }); };
  const handleDeleteUser = (name) => { setDeleteTarget({ type: 'teacher', name }); };

  const executeDelete = async () => {
    if (!deleteTarget) return; const { type, name } = deleteTarget; setDeleteTarget(null);
    try {
      await getUserDoc(name).delete();
      if (type === 'student') {
        const userSubs = submissions.filter(s => s.studentName === name);
        for (const sub of userSubs) await getSubmissionDoc(sub.id).delete();
      }
      setUploadMessage(`삭제되었습니다.`); setTimeout(() => setUploadMessage(''), 3000);
    } catch (error) { setUploadMessage('오류 발생.'); setTimeout(() => setUploadMessage(''), 3000); }
  };

  const exportToCSV = () => {
    let csvContent = "\uFEFF담당교사,학번_이름,항목,세부내용/시간,날짜(월),상태,제출일\n";
    sortedSubmissions.forEach(sub => {
      const catName = CATEGORIES.find(c => c.id === sub.category)?.title || '';
      const details = sub.category === 1 ? `${sub.hours}시간` : `"${(sub.description || '').replace(/"/g, '""')}"`;
      const status = sub.status === 'approved' ? '승인' : sub.status === 'rejected' ? '반려' : '대기';
      const displayDate = sub.category === 1 ? (sub.date || sub.month) : (sub.month || '-');
      csvContent += `"${sub.teacherName || '-'}",${sub.studentName},"${catName}",${details},${displayDate},${status},${new Date(sub.timestamp).toLocaleDateString()}\n`;
    });
    const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })); link.download = "학급활동인증현황.csv"; link.click();
  };

  const handleDownloadQR = () => { if (qrImageUrl) { const link = document.createElement('a'); link.download = 'QR.png'; link.href = qrImageUrl; link.click(); } };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50">로딩 중...</div>;

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex bg-gray-100 border-b border-gray-200">
            <button onClick={() => { setLoginTab('student'); setLoginError(''); }} className={`flex-1 py-4 font-bold text-sm ${loginTab === 'student' ? 'bg-white text-indigo-700 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>🧑‍🎓 학생 로그인</button>
            <button onClick={() => { setLoginTab('teacher'); setLoginError(''); }} className={`flex-1 py-4 font-bold text-sm ${loginTab === 'teacher' ? 'bg-white text-indigo-700 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>👨‍🏫 선생님 (관리자)</button>
          </div>
          <div className="p-8 space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                {loginTab === 'student' ? <Users size={32} /> : <ShieldAlert size={32} />}
              </div>
              <h1 className="text-2xl font-bold text-gray-800">학급 활동 인증 시스템</h1>
              <p className="text-gray-500 mt-2 text-sm leading-relaxed">초기 접속 시 입력한 비밀번호로 고정됩니다.</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              {loginTab === 'student' ? (
                <div className="flex space-x-2">
                  <input type="text" value={loginStudentNum} onChange={(e) => setLoginStudentNum(e.target.value)} placeholder="학번 (예: 1101)" className="w-1/2 px-3 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500" required />
                  <input type="text" value={loginName} onChange={(e) => setLoginName(e.target.value)} placeholder="이름 (예: 홍길동)" className="w-1/2 px-3 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500" required />
                </div>
              ) : (
                <input type="text" value={loginName} onChange={(e) => setLoginName(e.target.value)} placeholder="선생님 이름 / 관리자 ID" className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500" required />
              )}
              <div className="relative">
                <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="비밀번호" className="w-full px-4 py-3 pl-10 rounded-lg border focus:ring-2 focus:ring-indigo-500" required />
                <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
              </div>
              {loginError && <div className="text-red-500 text-sm font-medium flex items-center bg-red-50 p-3 rounded-lg"><AlertCircle size={16} className="mr-2 shrink-0" /> {loginError}</div>}
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg mt-2">접속하기</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-800">
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center space-x-2"><Award className="text-indigo-600" size={24} /><span className="font-bold text-lg hidden sm:block">학급 활동 인증 시스템</span></div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full">
              {currentUser.role === 'admin' ? '👑 전체 관리자' : currentUser.role === 'teacher' ? (currentUser.name === myMainTeacherName ? `👨‍🏫 ${currentUser.name} 선생님` : `👨‍🏫 ${currentUser.name} (${myMainTeacherName}반)`) : `🧑‍🎓 ${currentUser.name}`}
            </span>
            {currentUser.role !== 'student' && (
              <button onClick={() => setShowQrModal(true)} className="text-gray-500 hover:text-indigo-600 p-2"><QrCodeIcon size={20} /></button>
            )}
            <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700 p-2"><LogOut size={18} /></button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {showQrModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center relative">
              <button onClick={() => setShowQrModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
              <h2 className="text-xl font-bold mb-2">접속 QR코드</h2>
              <div className="flex justify-center mb-6 p-4 bg-gray-50 rounded-xl min-h-[250px] items-center">
                {qrImageUrl ? <img src={qrImageUrl} alt="QR" className="w-[250px] h-[250px] rounded-lg" /> : <div>QR코드 생성 중...</div>}
              </div>
            </div>
          </div>
        )}

        {deleteTarget && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center relative">
              <AlertCircle size={40} className="mx-auto text-red-500 mb-4" />
              <h2 className="text-xl font-bold mb-2">삭제 확인</h2>
              <p className="text-sm text-gray-600 mb-6">정말로 <strong>{deleteTarget.name}</strong> 명단을 삭제하시겠습니까?</p>
              <div className="flex space-x-3">
                <button onClick={() => setDeleteTarget(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 font-bold py-2.5 rounded-lg">취소</button>
                <button onClick={executeDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-lg">삭제</button>
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-2 border-b border-gray-200 pb-4 overflow-x-auto">
          {currentUser.role === 'student' && (
            <>
              <button onClick={() => { setView('dashboard'); resetForm(); }} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${view === 'dashboard' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'}`}>내 현황</button>
              <button onClick={() => setView('submit')} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${view === 'submit' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'}`}>{editingId ? '활동 수정' : '활동 제출'}</button>
            </>
          )}
          {currentUser.role !== 'student' && (
            <>
              <button onClick={() => { setView('teacher'); setTeacherTab('pending'); resetForm(); }} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${(view === 'teacher' && teacherTab === 'pending') ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'}`}>승인 대기</button>
              <button onClick={() => { setView('teacher'); setTeacherTab('all'); }} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${(view === 'teacher' && teacherTab === 'all') ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'}`}>전체 조회</button>
              <button onClick={() => { setView('teacher'); setTeacherTab('students'); }} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${(view === 'teacher' && teacherTab === 'students') ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'}`}>{currentUser.role === 'admin' ? '사용자 관리' : '학생 관리'}</button>
            </>
          )}
        </div>

        {view === 'dashboard' && currentUser.role === 'student' && myStats && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex justify-between mb-8"><h2 className="text-2xl font-bold">내 인증 현황</h2><div className="flex items-center bg-indigo-50 px-4 py-3 rounded-xl"><span className="text-indigo-800 font-bold text-xl mr-3">{myStats.metCount} / 7</span></div></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {CATEGORIES.map(cat => {
                  const Icon = cat.icon; let isMet = false; let details = '';
                  if (cat.id === 1) { const m = Object.entries(myStats.categories[1]).filter(([_, data]) => data.hours >= 7); isMet = m.length > 0; details = m.length > 0 ? m.map(([mo, d]) => `${mo}(${d.hours}h)`).join(', ') : '기록 없음'; } 
                  else { isMet = myStats.categories[cat.id].length > 0; if (isMet) details = `${myStats.categories[cat.id].length}회 참여`; }
                  return (
                    <div key={cat.id} className={`flex items-start p-4 rounded-xl border ${isMet ? 'bg-green-50' : 'bg-gray-50'}`}>
                      <div className={`p-2 rounded-lg mr-3 ${isMet ? 'bg-green-100 text-green-600' : 'bg-white text-gray-400'}`}>{isMet ? <CheckCircle size={20} /> : <Icon size={20} />}</div>
                      <div><h3 className="font-semibold text-sm">{cat.title}</h3>{isMet ? <p className="text-xs text-indigo-500">{details}</p> : <p className="text-xs text-red-400">미달성</p>}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-4">학급 상황판</h2>
              <div className="overflow-x-auto"><table className="w-full text-sm min-w-max border-collapse"><thead><tr className="bg-slate-50 border-b"><th className="p-3 text-center align-middle"><div className="inline-grid grid-cols-2 gap-2 w-36"><span className="text-center">학번</span><span className="text-center">이름</span></div></th><th className="p-3 text-center align-middle">진행도</th>{[1,2,3,4,5,6,7].map(n=><th key={n} className="p-3 text-center align-middle">{n}번</th>)}</tr></thead><tbody>
                {classStats.map(student => (
                  <tr key={student.name} className="border-b"><td className="p-3 text-center align-middle">{formatName(student.name)}</td><td className="p-3 text-center font-bold align-middle">{Math.round((student.metCount/7)*100)}%</td>{[1,2,3,4,5,6,7].map(n => <td key={n} className="p-3 text-center align-middle">{(n===1 ? Object.values(student.categories[1]).some(d=>d.hours>=7) : student.categories[n].length>0) ? <CheckCircle size={16} className="text-green-500 mx-auto"/> : '-'}</td>)}</tr>
                ))}
              </tbody></table></div>
            </div>
          </div>
        )}

        {view === 'submit' && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-2xl font-bold mb-6">{editingId ? '활동 수정' : '새 활동 제출'}</h2>
            <form onSubmit={handleSubmitActivity} className="space-y-6">
              {currentUser.role !== 'student' && !editingId && (
                <div><label className="block text-sm font-medium mb-2">학생 선택</label><select className="w-full px-4 py-3 rounded-lg border" value={formStudentName} onChange={(e) => setFormStudentName(e.target.value)} required><option value="">선택</option>{classRoster.map(st => <option key={st.name} value={st.name}>{st.name}</option>)}</select></div>
              )}
              <div><label className="block text-sm font-medium mb-2">항목 선택</label><select className="w-full px-4 py-3 rounded-lg border" value={formCategory} onChange={(e) => setFormCategory(Number(e.target.value))} disabled={editingId !== null}>{CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></div>
              {formCategory === 1 ? (
                <div className="bg-indigo-50 p-5 rounded-xl"><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-2">일자</label><input type="date" required value={formDate} onChange={(e)=>setFormDate(e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium mb-2">시간</label><input type="number" min="1" required value={formHours} onChange={(e)=>setFormHours(e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div></div><p className="text-xs text-indigo-600 mt-3">※ 7시간 이상 시 인증</p></div>
              ) : (
                <div><label className="block text-sm font-medium mb-2">내용 작성</label><textarea required rows="4" value={formDescription} onChange={(e)=>setFormDescription(e.target.value)} className="w-full px-4 py-3 border rounded-lg"></textarea></div>
              )}
              {submitMessage.text && <div className={`p-4 rounded-lg font-medium ${submitMessage.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{submitMessage.text}</div>}
              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg">제출하기</button>
            </form>
          </div>
        )}

        {view === 'teacher' && currentUser.role !== 'student' && (
          <div className="space-y-8">
            {teacherTab === 'pending' && (
              <div className="bg-white rounded-2xl border p-6">
                <h2 className="text-xl font-bold mb-4">대기중</h2>
                {visibleSubmissions.filter(s => s.status === 'pending').map(sub => (
                  <div key={sub.id} className="p-4 bg-yellow-50 border rounded-lg flex justify-between items-center mb-3">
                    <div><p className="font-bold">{formatName(sub.studentName, false)}</p><p className="text-sm">{sub.category === 1 ? `${sub.date} (${sub.hours}h)` : sub.description}</p></div>
                    <div className="space-x-2"><button onClick={()=>handleReview(sub.id, 'approved')} className="px-3 py-1 bg-green-500 text-white rounded">승인</button><button onClick={()=>handleReview(sub.id, 'rejected')} className="px-3 py-1 bg-red-500 text-white rounded">반려</button></div>
                  </div>
                ))}
              </div>
            )}
            {teacherTab === 'all' && (
              <div className="bg-white rounded-2xl border p-6">
                <div className="flex justify-between mb-6"><h2 className="text-xl font-bold">전체 조회</h2><button onClick={exportToCSV} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center">다운로드</button></div>
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-sm border-collapse min-w-max">
                    <thead><tr className="bg-slate-50 border-b"><th className="p-3 text-center align-middle"><div className="inline-grid grid-cols-2 gap-2 w-36"><span className="text-center">학번</span><span className="text-center">이름</span></div></th><th className="p-3 text-center align-middle">진행도</th>{CATEGORIES.map(c => <th key={c.id} className="p-2 text-center align-middle">{c.id}.<br/><span className="font-normal">{c.title}</span></th>)}</tr></thead>
                    <tbody>
                      {classStats.map(student => (
                        <tr key={student.name} className="border-b">
                          <td className="p-3 text-center align-middle">{formatName(student.name)}</td><td className="p-3 text-center font-bold align-middle">{Math.round((student.metCount / 7) * 100)}%</td>
                          <td className="p-3 text-center align-middle">{Object.entries(student.categories[1]).some(([_, d]) => d.hours >= 7) ? <CheckCircle size={18} className="text-green-500 mx-auto"/> : '-'}</td>
                          {[2, 3, 4, 5, 6, 7].map(n => <td key={n} className="p-3 text-center align-middle">{student.categories[n].length > 0 ? <CheckCircle size={18} className="text-green-500 mx-auto"/> : '-'}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {teacherTab === 'students' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center"><UserPlus size={20} className="mr-2"/> 명단 업로드</h2>
                  <textarea value={uploadText} onChange={e=>setUploadText(e.target.value)} className="w-full h-32 p-3 border rounded-lg mb-4"></textarea>
                  <button onClick={handleUploadRoster} className="bg-indigo-600 text-white font-bold px-4 py-2 rounded">업로드</button>
                  {uploadMessage && <p className="mt-2 font-bold text-indigo-600">{uploadMessage}</p>}
                </div>
                <div className="bg-white rounded-2xl border p-6">
                  <h2 className="text-xl font-bold mb-4">학생 비밀번호 관리</h2>
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-sm border-collapse min-w-max">
                      <thead><tr className="bg-gray-100"><th className="p-2 text-center align-middle"><div className="inline-grid grid-cols-2 gap-2 w-36"><span className="text-center">학번</span><span className="text-center">이름</span></div></th><th className="p-2 text-center align-middle">초기화</th><th className="p-2 text-center align-middle">삭제</th></tr></thead>
                      <tbody>
                        {classRoster.map(st => (
                          <tr key={st.id} className="border-b"><td className="p-2 text-center align-middle">{formatName(st.name)}</td><td className="p-2 text-center align-middle"><button onClick={()=>handleResetPassword(st.name)} className="text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded">초기화</button></td><td className="p-2 text-center align-middle"><button onClick={()=>handleDeleteStudent(st.name)} className="text-red-500"><Trash2 size={16}/></button></td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

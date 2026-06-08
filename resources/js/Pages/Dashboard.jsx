import React, { useState, useEffect, useRef } from 'react';
import { Link, router, usePage } from '@inertiajs/react';

export default function Dashboard(props) {
 
    const { auth, flash } = usePage().props;
    const pageStudents = usePage().props.students;
    const loggedInUser = auth ? auth.user : null;

    
    const initialStudents = props.students || pageStudents || {};
    const studentsData = initialStudents.data || [];
    const paginationLinks = initialStudents.links || [];

    const [students, setStudents] = useState(studentsData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

   
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    
    useEffect(() => {
        const freshStudents = props.students || pageStudents || {};
        setStudents(freshStudents.data || []);
    }, [props.students, pageStudents]);

    
    useEffect(() => {
        if (flash && flash.success) {
            showToast(flash.success, 'success');
        }
    }, [flash]);

   
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: 'success' });
        }, 4000);
    };
    
    // Form States
    const [formMode, setFormMode] = useState('add'); 
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', age: '', date_of_birth: '', gender: 'Male', score: '' });

    // Filter States
    const [search, setSearch] = useState('');
    const [genderFilter, setGenderFilter] = useState('All Genders');
    const [ageFilter, setAgeFilter] = useState('');
    const [scoreFilter, setScoreFilter] = useState('');
    const [appliedFilters, setAppliedFilters] = useState({ search: '', gender: 'All Genders', age: '', score: '' });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openAddModal = () => {
        setFormMode('add');
        setFormData({ name: '', email: '', age: '', date_of_birth: '', gender: 'Male', score: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (student) => {
        setFormMode('edit');
        setCurrentId(student.id);
        setFormData({
            name: student.name,
            email: student.email,
            age: student.age,
            date_of_birth: student.date_of_birth || '', 
            gender: (student.gender === 'M' || student.gender === 'Male') ? 'Male' : 'Female',
            score: student.score
        });
        setIsModalOpen(true);
    };

    const openQuickEditModal = (student) => {
        setFormMode('quick-edit');
        setCurrentId(student.id);
        setFormData({
            name: student.name,
            email: student.email,
            age: student.age,
            date_of_birth: student.date_of_birth || '', 
            gender: (student.gender === 'M' || student.gender === 'Male') ? 'Male' : 'Female',
            score: student.score
        });
        setIsModalOpen(true);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        if (formMode === 'add') {
            router.post('/students', formData, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    showToast('Student added successfully!', 'success');
                },
                onError: (errors) => {
                    showToast(Object.values(errors)[0] || 'Something went wrong!', 'error');
                }
            });
        } else {
            router.put(`/students/${currentId}`, formData, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    showToast('Student updated successfully!', 'success');
                },
                onError: (errors) => {
                    showToast(Object.values(errors)[0] || 'Update failed!', 'error');
                }
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this student from database?")) {
            router.delete(`/students/${id}`, {
                onSuccess: () => {
                    showToast('Student deleted successfully!', 'success');
                }
            });
        }
    };

    const handleApplyFilters = () => {
        setAppliedFilters({ search, gender: genderFilter, age: ageFilter, score: scoreFilter });
    };

    const handleResetFilters = () => {
        setSearch('');
        setGenderFilter('All Genders');
        setAgeFilter('');
        setScoreFilter('');
        setAppliedFilters({ search: '', gender: 'All Genders', age: '', score: '' });
    };

  
    const filteredStudents = students.filter(student => {
        if (!student) return false;
        const currentStudentGender = (student.gender === 'M' || student.gender === 'Male') ? 'Male' : 'Female';
        const matchesSearch = !appliedFilters.search ? true : (
            (student.name && student.name.toLowerCase().includes(appliedFilters.search.toLowerCase())) ||
            (student.email && student.email.toLowerCase().includes(appliedFilters.search.toLowerCase()))
        );
        const matchesGender = appliedFilters.gender === 'All Genders' || currentStudentGender === appliedFilters.gender;
        const matchesAge = appliedFilters.age === '' || (student.age && student.age.toString() === appliedFilters.age);
        const matchesScore = appliedFilters.score === '' || (
            student.score && (
                parseFloat(student.score).toFixed(2) === parseFloat(appliedFilters.score).toFixed(2) || 
                student.score.toString() === appliedFilters.score
            )
        );
        return matchesSearch && matchesGender && matchesAge && matchesScore;
    });

    return (
        <div style={styles.container}>
            {/* Custom Toast Notification */}
            {toast.show && (
                <div style={{ ...styles.toast, backgroundColor: toast.type === 'success' ? '#198754' : '#dc3545' }}>
                    {toast.message}
                </div>
            )}

            {/* Top Navbar */}
            <nav style={styles.navbar}>
                <div style={styles.navLinks}>
                    <a href="#" style={{ ...styles.navLink, ...styles.activeNavLink }}>Home</a>
                    <a href="#" style={styles.navLink}>About</a>
                    <a href="#" style={styles.navLink}>Services</a>
                    <a href="#" style={styles.navLink}>Contact</a>
                </div>
                
                {}
                <div style={styles.navUserContainer} ref={dropdownRef}>
                    <button 
                        style={styles.navUserButton} 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        Hi, {loggedInUser ? loggedInUser.name : 'Admin'} <span style={styles.arrow}>▾</span>
                    </button>
                    
                    {isDropdownOpen && (
                        <div style={styles.dropdownMenu}>
                            {/* 👤 My Profile  */}
                            <Link href="/profile" style={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
                                👤 My Profile
                            </Link>
                            
                            <hr style={styles.divider} />
                            
                            {/* 🚪 Logout */}
                            <Link 
                                href="/logout" 
                                method="post" 
                                as="button" 
                                style={styles.dropdownItemBtn}
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                🚪 Logout
                            </Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Content Layout */}
            <div style={styles.mainLayout}>
                <aside style={styles.sidebar}>
                    <h2 style={styles.sidebarTitle}>Sidebar</h2>
                    <ul style={styles.sidebarMenu}>
                        <li style={styles.sidebarItem}>
                            <button style={styles.sidebarBtnActive} onClick={() => setIsModalOpen(false)}>▪ Students List</button>
                        </li>
                        <li style={styles.sidebarItem}>
                            <button style={styles.sidebarBtn} onClick={openAddModal}>▪ Add Student</button>
                        </li>
                    </ul>
                </aside>

                <main style={styles.content}>
                    <h1 style={styles.pageTitle}>Students List</h1>

                    {/* Filter Section */}
                    <div style={styles.filterBox}>
                        <div style={styles.filterRow}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Search</label>
                                <input type="text" placeholder="Search by Name or Email..." style={styles.input} value={search} onChange={(e) => setSearch(e.target.value)} />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Gender</label>
                                <select style={styles.select} value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
                                    <option>All Genders</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Age</label>
                                <input type="text" placeholder="Exact Age" style={styles.input} value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)} />
                            </div>
                        </div>

                        <div style={styles.filterRow}>
                            <div style={{ ...styles.inputGroup, maxWidth: '30%' }}>
                                <label style={styles.label}>Exact Score</label>
                                <input type="text" placeholder="Exact Score" style={styles.input} value={scoreFilter} onChange={(e) => setScoreFilter(e.target.value)} />
                            </div>
                            <div style={styles.btnRow}>
                                <button style={styles.btnReset} onClick={handleResetFilters}>Reset</button>
                                <button style={styles.btnApply} onClick={handleApplyFilters}>Apply Filters</button>
                            </div>
                        </div>
                    </div>

                    <div style={styles.actionRow}>
                        <button style={styles.btnAddStudent} onClick={openAddModal}>Add New Student</button>
                    </div>

                    {/* Data Table */}
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHeaderRow}>
                                    <th style={styles.th}>ID</th>
                                    <th style={styles.th}>Name</th>
                                    <th style={styles.th}>Email</th>
                                    <th style={styles.th}>Age</th>
                                    <th style={styles.th}>Date of Birth</th>
                                    <th style={styles.th}>Gender</th>
                                    <th style={styles.th}>Score</th>
                                    <th style={styles.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((student) => (
                                        <tr style={styles.tableRow} key={student.id}>
                                            <td style={styles.td}>{student.id}</td>
                                            <td style={styles.td}>{student.name}</td>
                                            <td style={styles.td}>{student.email}</td>
                                            <td style={styles.td}>{student.age}</td>
                                            <td style={styles.td}>{student.date_of_birth}</td>
                                            <td style={styles.td}>{(student.gender === 'M' || student.gender === 'Male') ? 'Male' : 'Female'}</td>
                                            <td style={styles.td}>{student.score}</td>
                                            <td style={styles.td}>
                                                <button style={styles.btnEdit} onClick={() => openEditModal(student)}>Edit</button>
                                                <button style={styles.btnQuickEdit} onClick={() => openQuickEditModal(student)}>Quick Edit</button>
                                                <button style={styles.btnDelete} onClick={() => handleDelete(student.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" style={{ ...styles.td, textAlign: 'center', padding: '20px' }}>No students found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Links */}
                    {paginationLinks.length > 3 && (
                        <div style={styles.paginationContainer}>
                            {paginationLinks.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    disabled={!link.url}
                                    style={{
                                        ...styles.paginationLink,
                                        ...(link.active ? styles.paginationActive : {}),
                                        ...(!link.url ? styles.paginationDisabled : {})
                                    }}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Shadow Modal Form */}
            {isModalOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalBox}>
                        <h2 style={{ color: '#0056b3', marginTop: 0, marginBottom: '20px' }}>
                            {formMode === 'add' ? 'Add New Student' : formMode === 'quick-edit' ? 'Quick Edit Student' : 'Edit Student Details'}
                        </h2>
                        <form onSubmit={handleFormSubmit}>
                            <div style={styles.modalInputGroup}>
                                <label style={styles.label}>Name</label>
                                <input type="text" name="name" required style={styles.input} value={formData.name} onChange={handleInputChange} />
                            </div>
                            <div style={styles.modalInputGroup}>
                                <label style={styles.label}>Email</label>
                                <input type="email" name="email" required style={styles.input} value={formData.email} onChange={handleInputChange} />
                            </div>
                            <div style={styles.modalInputGroup}>
                                <label style={styles.label}>Age</label>
                                <input type="number" name="age" required style={styles.input} value={formData.age} onChange={handleInputChange} />
                            </div>
                            <div style={styles.modalInputGroup}>
                                <label style={styles.label}>Date of Birth {formMode === 'quick-edit' && '(Locked)'}</label>
                                <input type="date" name="date_of_birth" required={formMode !== 'quick-edit'} disabled={formMode === 'quick-edit'} style={{ ...styles.input, backgroundColor: formMode === 'quick-edit' ? '#e2e8f0' : '#fff' }} value={formData.date_of_birth} onChange={handleInputChange} />
                            </div>
                            <div style={styles.modalInputGroup}>
                                <label style={styles.label}>Gender {formMode === 'quick-edit' && '(Locked)'}</label>
                                <select name="gender" disabled={formMode === 'quick-edit'} style={{ ...styles.select, backgroundColor: formMode === 'quick-edit' ? '#e2e8f0' : '#fff' }} value={formData.gender} onChange={handleInputChange}>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div style={styles.modalInputGroup}>
                                <label style={styles.label}>Score {formMode === 'quick-edit' && '(Locked)'}</label>
                                <input type="number" step="0.01" name="score" required={formMode !== 'quick-edit'} disabled={formMode === 'quick-edit'} style={{ ...styles.input, backgroundColor: formMode === 'quick-edit' ? '#e2e8f0' : '#fff' }} value={formData.score} onChange={handleInputChange} />
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                                <button type="button" style={styles.btnReset} onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" style={styles.btnApply}>
                                    {formMode === 'add' ? 'Submit' : 'Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <footer style={styles.footer}>
                © 2026 My Website. All rights reserved.
            </footer>
        </div>
    );
}

const styles = {
    container: { display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', position: 'relative' },
    navbar: { backgroundColor: '#0056b3', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 40px', color: '#fff', position: 'relative' },
    navLinks: { display: 'flex', gap: '25px' },
    navLink: { color: '#e2e8f0', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' },
    activeNavLink: { color: '#fff', borderBottom: '2px solid #fff' },
    
    // 🔹 
    navUserContainer: { position: 'relative' },
    navUserButton: { background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '4px' },
    arrow: { fontSize: '12px' },
    dropdownMenu: { position: 'absolute', top: '35px', right: 0, backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '160px', zIndex: 1000, padding: '5px 0', overflow: 'hidden' },
    dropdownItem: { display: 'block', padding: '10px 16px', color: '#334155', textDecoration: 'none', fontSize: '14px', transition: 'background 0.2s', fontWeight: '500' },
    dropdownItemBtn: { display: 'block', width: '100%', textAlign: 'left', padding: '10px 16px', color: '#dc3545', background: 'none', border: 'none', fontSize: '14px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.2s' },
    divider: { border: 0, borderTop: '1px solid #e2e8f0', margin: '4px 0' },

    mainLayout: { display: 'flex', flex: 1 },
    sidebar: { width: '240px', backgroundColor: '#f1f5f9', padding: '30px 20px', borderRight: '1px solid #e2e8f0' },
    sidebarTitle: { color: '#0056b3', fontSize: '22px', marginBottom: '20px', marginTop: 0 },
    sidebarMenu: { listStyle: 'none', padding: 0, margin: 0 },
    sidebarItem: { marginBottom: '12px' },
    sidebarBtnActive: { background: 'none', border: 'none', color: '#0056b3', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', padding: 0, textAlign: 'left', width: '100%' },
    sidebarBtn: { background: 'none', border: 'none', color: '#334155', cursor: 'pointer', fontSize: '15px', padding: 0, textAlign: 'left', width: '100%' },
    content: { flex: 1, padding: '40px' },
    pageTitle: { color: '#0056b3', textAlign: 'center', fontSize: '28px', marginBottom: '25px', marginTop: 0 },
    filterBox: { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '25px' },
    filterRow: { display: 'flex', gap: '20px', marginBottom: '15px' },
    inputGroup: { display: 'flex', flexDirection: 'column', flex: 1 },
    label: { fontWeight: 'bold', fontSize: '14px', marginBottom: '6px', color: '#334155' },
    input: { padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px' },
    select: { padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', backgroundColor: '#fff' },
    btnRow: { display: 'flex', alignItems: 'flex-end', gap: '12px', marginLeft: 'auto' },
    btnReset: { backgroundColor: '#6c757d', color: '#fff', border: 'none', padding: '9px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    btnApply: { backgroundColor: '#0056b3', color: '#fff', border: 'none', padding: '9px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    actionRow: { display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' },
    btnAddStudent: { backgroundColor: '#198754', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
    tableContainer: { backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    tableHeaderRow: { backgroundColor: '#0056b3', color: '#fff' },
    th: { padding: '12px 15px', fontWeight: 'bold', border: '1px solid #004b9b' },
    tableRow: { borderBottom: '1px solid #cbd5e1' },
    td: { padding: '12px 15px', fontSize: '14px', color: '#334155', border: '1px solid #cbd5e1' },
    btnEdit: { backgroundColor: '#ffc107', border: 'none', padding: '5px 12px', borderRadius: '4px', marginRight: '6px', cursor: 'pointer', fontWeight: 'bold' },
    btnQuickEdit: { backgroundColor: '#0dcaf0', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', marginRight: '6px', cursor: 'pointer', fontWeight: 'bold' },
    btnDelete: { backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    footer: { backgroundColor: '#003366', color: '#fff', textAlign: 'center', padding: '15px', fontSize: '14px', marginTop: 'auto' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalBox: { backgroundColor: '#fff', padding: '30px', borderRadius: '8px', width: '450px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' },
    modalInputGroup: { display: 'flex', flexDirection: 'column', marginBottom: '15px' },
    toast: { position: 'fixed', top: '20px', right: '20px', color: '#fff', padding: '15px 25px', borderRadius: '5px', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 2000, minWidth: '200px', textAlign: 'center', transition: 'all 0.3s ease-in-out' },
    paginationContainer: { display: 'flex', justifyContent: 'center', gap: '5px', marginTop: '25px' },
    paginationLink: { padding: '8px 14px', border: '1px solid #cbd5e1', borderRadius: '4px', textDecoration: 'none', color: '#334155', fontSize: '14px', backgroundColor: '#fff', transition: 'all 0.2s' },
    paginationActive: { backgroundColor: '#0056b3', color: '#fff', borderColor: '#0056b3', fontWeight: 'bold' },
    paginationDisabled: { color: '#cbd5e1', pointerEvents: 'none', backgroundColor: '#f1f5f9' }
};
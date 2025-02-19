import React, { useEffect, useState } from 'react';
import { ConfigProvider, Dropdown, Table, Tag, Modal as AntModal, message } from 'antd';
import { EditOutlined, DeleteOutlined, EllipsisOutlined, SearchOutlined, DownloadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useForm, Controller } from "react-hook-form";
import students from './StudentList.module.css';
import classNames from 'classnames/bind';
import { useParams, useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import { toast } from 'react-toastify';
import { Spinner } from '../../Spinner/Spinner';
import useAuth from '../../../hooks/useAuth';
import { GetAllStudentOfProject, RemoveStudentFromClass } from '../../../services/StudentApi';

const cx = classNames.bind(students);

export const StudentList = () => {
    const { user } = useAuth();
    const { projectId } = useParams();

    const [pageNumber, setPageNumber] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [studentList, setStudentList] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [totalItem, setTotalItem] = useState(0);
    const [openDetail, setOpenDetail] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { handleSubmit, control, register, reset, formState: { errors } } = useForm();

    const fetchAllStudent = async () => {
        setIsLoading(true);
        const response = await GetAllStudentOfProject(projectId, searchValue, pageNumber, rowsPerPage);
        const responseData = await response.json();

        if (response.ok) {
            setStudentList(responseData.result.memberProjectDTOs);
            setTotalItem(responseData.result.totalCount);
            setPageNumber(responseData.result.currentPage);
        } else {
            setStudentList([]);
            setTotalItem(0);
            setPageNumber(1);
            console.log("Error fetching member");
        }

        setIsLoading(false);
    };

    const handleInputSearch = debounce((e) => {
        setSearchValue(e.target.value);
        setPageNumber(1);
    }, 500);

    useEffect(() => {

        fetchAllStudent();
    }, [pageNumber, searchValue, projectId]);

    const handleDetailOpen = (student) => {
        setSelectedStudent(student);
        setOpenDetail(true);
    };

    const handleDetailClose = () => {
        setOpenDetail(false);
        setSelectedStudent(null);
    };


    const handleDeleteOpen = (student) => {
        setSelectedStudent(student);
        setOpenDelete(true);
    };

    const handleDeleteClose = () => {
        setOpenDelete(false);
        setSelectedStudent(null);
    };

    const onConfirmDelete = async () => {
        if (!selectedStudent) return;

        setIsLoading(true);
        const response = await RemoveStudentFromClass(selectedStudent.memberId);
        const responseData = await response.json();
        if (response.ok) {
            toast.success("Xóa sinh viên thành công!");
            fetchAllStudent();
            handleDeleteClose();
        } else {
            toast.error(responseData.message);
        }
        setIsLoading(false);
    };

    const getMenuItems = (student) => [
        {
            key: '1',
            label: (
                <button style={{ color: "blue" }} onClick={() => handleDetailOpen(student)}>
                    <InfoCircleOutlined style={{ marginRight: '8px' }} /> Chi tiết
                </button>
            ),
        },
        {
            key: '2',
            label: (
                <button style={{ color: "red" }} onClick={() => handleDeleteOpen(student)}>
                    <DeleteOutlined style={{ marginRight: '8px' }} /> Xóa
                </button>
            ),
        }
    ];

    const columns = [
        {
            title: 'ID',
            dataIndex: 'accountCode',
            key: 'accountCode',
            align: 'center',
        },
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',
            key: 'fullName',
            align: 'center',
        },
        {
            title: 'Lớp',
            dataIndex: 'classCode',
            key: 'classCode',
            align: 'center',
        },
        {
            title: 'Nhóm hỗ trợ',
            dataIndex: 'groupSupportNo',
            key: 'groupSupportNo',
            align: 'center',
        },
        {
            title: '',
            key: 'action',
            align: 'center',
            render: (record) => (
                <Dropdown menu={{ items: getMenuItems(record) }} placement="bottomRight" trigger={['click']}>
                    <EllipsisOutlined style={{ fontSize: "18px", color: 'black' }} />
                </Dropdown>
            ),
        },
    ];

    if (!user || !projectId) {
        return <Spinner />
    }

    return (
        <div>
            <div className={cx('student-table-container')}>
            <p className='text-3xl'>Quản lý sinh viên</p>
                <div className={cx('project-detail-search')}>
                    <div className='flex w-full justify-between items-center'>
                        <div className={cx('search-box-container')}>
                            <div className={cx('search-box')}>
                                <SearchOutlined color='#285D9A' size={20} />
                                <input
                                    type="search"
                                    placeholder="Tìm kiếm sinh viên"
                                    className={cx('search-input')}
                                    onChange={(e) => handleInputSearch(e)}
                                />
                            </div>
                            <button className={cx('search-button')}>
                                <SearchOutlined color='white' size={20} style={{ marginRight: '5px' }} />
                                Tìm kiếm
                            </button>
                        </div>
                    </div>
                </div>
                <ConfigProvider
                    theme={{
                        components: {
                            Table: {
                                headerBg: '#474D57',
                                headerColor: 'white',
                            },
                        },
                    }}
                >
                    <Table
                        size='large'
                        columns={columns}
                        dataSource={studentList.map((student) => ({
                            key: student.memberId,
                            memberId: student.memberId,
                            accountCode: student.account.accountCode,
                            fullName: student.account.fullName,
                            classCode: student.classCode,
                            groupSupportNo: student.groupSupportNo,
                            email: student.account.email,
                            phone: student.account.phone,
                            gender: student.account.gender,
                            birthdate: student.account.dateOfBirth,
                            avatar: student.account.avatarLink,
                        }))}
                        pagination={{
                            position: ['bottomCenter'],
                            current: pageNumber,
                            pageSize: rowsPerPage,
                            total: totalItem,
                            onChange: (page, pageSize) => {
                                setPageNumber(page);
                                setRowsPerPage(pageSize);
                            },
                        }}
                    />
                </ConfigProvider>
            </div>

            <Dialog open={openDetail} onClose={handleDetailClose} maxWidth="sm" fullWidth>
                <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }}>Thông tin chi tiết</DialogTitle>
                <DialogContent>
                    {selectedStudent && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: 25 }}>
                            <div className='flex'>
                                <div className='w-1/2' style={{marginRight: 5}}>
                                    <img src={selectedStudent.avatar} alt="Avatar" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
                                </div>
                                <div className='w-1/2'  style={{ flex: 1}}>
                                    <TextField style={{ marginBottom: 18}} label="ID" fullWidth value={selectedStudent.accountCode} variant="outlined" />
                                    <TextField label="Họ và tên" fullWidth value={selectedStudent.fullName} variant="outlined" />
                                </div>
                            </div>
                            <div className='flex mt-2'>
                                <TextField style={{marginRight: 10}} label="Email" fullWidth value={selectedStudent.email} variant="outlined" />
                                <TextField label="Số điện thoại" fullWidth value={selectedStudent.phone} variant="outlined" />
                            </div>
                            <div className='flex mt-2'>
                                <TextField style={{marginRight: 10}} label="Ngày sinh" fullWidth value={selectedStudent.birthdate} variant="outlined" />
                                <TextField label="Giới tính" fullWidth value={selectedStudent.gender} variant="outlined" />
                            </div>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDetailClose} sx={{ textTransform: "none" }}>Đóng</Button>
                </DialogActions>
            </Dialog>


            {/* Dialog Xóa */}
            <Dialog open={openDelete} onClose={handleDeleteClose}>
                <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }}>Vô hiệu hóa tài khoản</DialogTitle>
                <DialogContent>
                    <p className='pt-3 pb-3'>Bạn có chắc muốn xóa sinh viên này ra khỏi dự án?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose} sx={{ textTransform: "none" }}>Hủy</Button>
                    <Button variant="contained" color="error" sx={{ textTransform: "none" }} onClick={onConfirmDelete}>Xác nhận</Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

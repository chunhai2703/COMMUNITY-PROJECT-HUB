import React, { useCallback, useEffect, useState } from 'react';
import { ConfigProvider, Dropdown, Table, Tag, Modal as AntModal, message } from 'antd';
import { EditOutlined, DeleteOutlined, EllipsisOutlined, SearchOutlined, DownloadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useForm, Controller } from "react-hook-form";
import lecturers from './LecturerList.module.css';
import classNames from 'classnames/bind';
import { useParams, useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import { toast } from 'react-toastify';
import { Spinner } from '../../Spinner/Spinner';
import useAuth from '../../../hooks/useAuth';
import { GetAllLecturerOfProject, RemoveLecturerFromClass } from '../../../services/LecturerApi';
import { ChangeClassLecturer } from '../../Popup/Members/ChangeClassLecturer';

const cx = classNames.bind(lecturers);

export const LecturerList = (props) => {
    const { user } = useAuth();
    const { projectId } = useParams();
    const [pageNumber, setPageNumber] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [lecturerList, setLecturerList] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [totalItem, setTotalItem] = useState(0);
    const [openDetail, setOpenDetail] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedLecturer, setSelectedLecturer] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { handleSubmit, control, register, reset, formState: { errors } } = useForm();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    };

    const fetchAllLecturer = useCallback(async () => {
        setIsLoading(true);
        const response = await GetAllLecturerOfProject(projectId, searchValue, pageNumber, rowsPerPage);
        const responseData = await response.json();

        if (response.ok) {
            setLecturerList(responseData.result.lecturerProjectDTOs);
            setTotalItem(responseData.result.totalCount);
            setPageNumber(responseData.result.currentPage);
        } else {
            setLecturerList([]);
            setTotalItem(0);
            setPageNumber(1);
            console.log("Error fetching member");
        }

        setIsLoading(false);
    }, [searchValue, pageNumber, rowsPerPage, projectId]);

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchAllLecturer();
        }, 1000);

        return () => clearTimeout(delaySearch);
    }, [searchValue, pageNumber, rowsPerPage, fetchAllLecturer]);


    const handleDetailOpen = (lecturer) => {
        setSelectedLecturer(lecturer);
        setOpenDetail(true);
    };

    const handleDetailClose = () => {
        setOpenDetail(false);
        setSelectedLecturer(null);
    };


    const handleDeleteOpen = (lecturer) => {
        setSelectedLecturer(lecturer);
        setOpenDelete(true);
    };

    const handleDeleteClose = () => {
        setOpenDelete(false);
        setSelectedLecturer(null);
    };

    const handleSearch = () => {
        setPageNumber(1);
        fetchAllLecturer();
    };

    const onConfirmDelete = async () => {
        if (!selectedLecturer) return;

        setIsLoading(true);
        const response = await RemoveLecturerFromClass(selectedLecturer.lecturerId, selectedLecturer.classId);
        const responseData = await response.json();
        if (response.ok) {
            toast.success("Xóa giảng viên thành công!");
            fetchAllLecturer();
            handleDeleteClose();
        } else {
            toast.error(responseData.message);
        }
        setIsLoading(false);
    };

    const getMenuItems = (lecturer) => [
        {
            key: '1',
            label: (
                <button style={{ color: "#00879E", fontWeight: "600" }} onClick={() => handleDetailOpen(lecturer)}>
                    <InfoCircleOutlined style={{ marginRight: '8px' }} /> Chi tiết
                </button>
            ),
        },
        ...(props.project.status === 'Sắp diễn ra'
            ? [
                {
                    key: '2',
                    label: (
                        <button style={{ color: "#D70654", fontWeight: "600" }} onClick={() => handleDeleteOpen(lecturer)}>
                            <DeleteOutlined style={{ marginRight: '8px' }} /> Xóa
                        </button>
                    ),
                },
            ]
            : []),

        ...(props.project.status === 'Đang diễn ra'
            ? [
                {
                    key: '3',
                    label: (
                        <ChangeClassLecturer lecturer={lecturer} refresh={fetchAllLecturer} projectId={projectId} />
                    )
                }
            ]
            : []),
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
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            align: 'center',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
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
            <div className={cx('lecturer-table-container')}>
                <p className='text-3xl'>Quản lý giảng viên</p>
                <div className={cx('project-detail-search')}>
                    <div className='flex w-full justify-between items-center'>
                        <div className={cx('search-box-container')}>
                            <div className={cx('search-box')}>
                                <SearchOutlined color='#285D9A' size={20} />
                                <input
                                    type="search"
                                    placeholder="Tìm kiếm giảng viên"
                                    className={cx('search-input')}
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                />
                            </div>
                            <button className={cx('search-button')} onClick={handleSearch}>
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
                        rowKey={(record) => record.classId}
                        dataSource={lecturerList.map((lecturer) => ({
                            key: lecturer.memberId,
                            lecturerId: lecturer.account.accountId,
                            accountCode: lecturer.account.accountCode,
                            fullName: lecturer.account.fullName,
                            classId: lecturer.classId,
                            classCode: lecturer.classCode,
                            email: lecturer.account.email,
                            phone: lecturer.account.phone,
                            gender: lecturer.account.gender,
                            birthdate: lecturer.account.dateOfBirth,
                            avatar: lecturer.account.avatarLink,
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
                    {selectedLecturer && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: 25 }}>
                            <div className='flex'>
                                <div className='w-1/2' style={{ marginRight: 5 }}>
                                    <img src={selectedLecturer.avatar} alt="Avatar" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
                                </div>
                                <div className='w-1/2' style={{ flex: 1 }}>
                                    <TextField style={{ marginBottom: 18 }} label="ID" fullWidth value={selectedLecturer.accountCode} variant="outlined" />
                                    <TextField label="Họ và tên" fullWidth value={selectedLecturer.fullName} variant="outlined" />
                                </div>
                            </div>
                            <div className='flex mt-2'>
                                <TextField style={{ marginRight: 10 }} label="Email" fullWidth value={selectedLecturer.email} variant="outlined" />
                                <TextField label="Số điện thoại" fullWidth value={selectedLecturer.phone} variant="outlined" />
                            </div>
                            <div className='flex mt-2'>
                                <TextField style={{ marginRight: 10 }} label="Ngày sinh" fullWidth value={formatDate(selectedLecturer.birthdate)} variant="outlined" />
                                <TextField label="Giới tính" fullWidth value={selectedLecturer.gender} variant="outlined" />
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
                    <p className='pt-3 pb-3'>Bạn có chắc muốn xóa giảng viên này ra khỏi dự án?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose} sx={{ textTransform: "none" }}>Hủy</Button>
                    <Button variant="contained" color="error" sx={{ textTransform: "none" }} onClick={onConfirmDelete}>
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Xác nhận"}
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

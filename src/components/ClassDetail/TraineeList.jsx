import React, { useCallback, useEffect, useState } from 'react';
import { ConfigProvider, Dropdown, Table, Tag, Modal as AntModal, message } from 'antd';
import { EditOutlined, DeleteOutlined, EllipsisOutlined, SearchOutlined, DownloadOutlined, InfoCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, CircularProgress, debounce, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useForm, Controller } from "react-hook-form";
import trainees from './TraineeList.module.css';
import classNames from 'classnames/bind';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import { Spinner } from '../Spinner/Spinner';
import { GetAllTraineeOfClass } from '../../services/TraineeApi';
import { AddTrainee } from '../Popup/Class/AddTrainee';
import { AddNewTrainee } from '../Popup/Class/AddNewTrainee';

const cx = classNames.bind(trainees);

const TraineeList = (props) => {
    const { user } = useAuth();
    const { classId } = useParams();

    const [pageNumber, setPageNumber] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [traineeList, setTraineeList] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [totalItem, setTotalItem] = useState(0);
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedTrainee, setSelectedTrainee] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [sortColumn, setSortColumn] = useState("");
    const [sortOrder, setSortOrder] = useState("");

    const { handleSubmit, control, register, reset, formState: { errors } } = useForm();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    };

    const fetchAllTrainee = useCallback(async () => {
        setIsLoading(true);
        const response = await GetAllTraineeOfClass(classId, searchValue, pageNumber, rowsPerPage, sortColumn, sortOrder);
        const responseData = await response.json();

        if (response.ok) {
            setTraineeList(responseData.result.getAllTraineeOfClassDTOs);
            setTotalItem(responseData.result.totalCount);
            setPageNumber(responseData.result.currentPage);
        } else {
            setTraineeList([]);
            setTotalItem(0);
            setPageNumber(1);
            console.log("Error fetching trainee");
        }

        setIsLoading(false);
    }, [classId, searchValue, pageNumber, rowsPerPage, sortColumn, sortOrder]);

    const handleTableChange = (pagination, filters, sorter) => {
        if (sorter.order) {
            setSortColumn(sorter.field);
            setSortOrder(sorter.order === 'ascend' ? 'ASC' : 'DESC');
        } else {
            setSortColumn("");
            setSortOrder("");
        }
    };

    useEffect(() => {
        fetchAllTrainee();
    }, [fetchAllTrainee]);

    const handleDetailOpen = (trainee) => {
        setSelectedTrainee(trainee);
        setOpenDetail(true);
    };

    const handleDetailClose = () => {
        setOpenDetail(false);
        setSelectedTrainee(null);
    };

    const handleSearch = () => {
        fetchAllTrainee();
    };

    const getMenuItems = (trainee) => [
        {
            key: '1',
            label: (
                <button style={{ color: "blue" }} onClick={() => handleDetailOpen(trainee)}>
                    <InfoCircleOutlined style={{ marginRight: '8px' }} /> Chi tiết
                </button>
            ),
        },
    ];

    const columns = [
        {
            title: 'ID',
            dataIndex: 'accountCode',
            key: 'accountCode',
            align: 'center',
            sorter: true
        },
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',
            key: 'fullName',
            align: 'center',
            sorter: true
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            align: 'center',
            sorter: true
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            align: 'center',
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
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

    if (!user || !classId || isLoading) {
        return <Spinner />
    }

    return (
        <div>
            <div className={cx('trainee-table-container')}>
                <p className='text-3xl'>Quản lý học viên</p>
                <div className={cx('trainee-detail-search')}>
                    <div className='flex w-full justify-between items-center'>
                        <div className={cx('search-box-container')}>
                            <div className={cx('search-box')}>
                                <SearchOutlined color='#285D9A' size={20} />
                                <input
                                    type="search"
                                    placeholder="Tìm kiếm học viên"
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
                        {user?.accountId === props.dataClass.projectManagerId && props.dataClass.projectStatus === 'Lên kế hoạch' && (<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <AddTrainee classId={classId} refresh={fetchAllTrainee} />
                            <AddNewTrainee classId={classId} refresh={fetchAllTrainee} />
                        </div>)}
                    </div>
                </div>
                <ConfigProvider
                    theme={{
                        components: {
                            Table: {
                                headerBg: '#474D57',
                                headerColor: 'white',
                                headerSortActiveBg: 'gray',
                                headerSortHoverBg: 'gray',
                            },
                        },
                    }}
                >
                    <Table
                        size='large'
                        columns={columns}
                        dataSource={traineeList.map((trainee) => ({
                            key: trainee.traineeId,
                            traineeId: trainee.account.accountId,
                            accountCode: trainee.account.accountCode,
                            fullName: trainee.account.fullName,
                            email: trainee.account.email,
                            phone: trainee.account.phone,
                            gender: trainee.account.gender,
                            birthdate: trainee.account.dateOfBirth,
                            avatar: trainee.account.avatarLink,
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
                        onChange={handleTableChange}
                    />
                </ConfigProvider>
            </div>

            <Dialog open={openDetail} onClose={handleDetailClose} maxWidth="sm" fullWidth>
                <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }}>Thông tin chi tiết</DialogTitle>
                <DialogContent>
                    {selectedTrainee && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: 25 }}>
                            <div className='flex'>
                                <div className='w-1/2' style={{ marginRight: 5 }}>
                                    <img src={selectedTrainee.avatar} alt="Avatar" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
                                </div>
                                <div className='w-1/2' style={{ flex: 1 }}>
                                    <TextField style={{ marginBottom: 18 }} label="ID" fullWidth value={selectedTrainee.accountCode} variant="outlined" />
                                    <TextField label="Họ và tên" fullWidth value={selectedTrainee.fullName} variant="outlined" />
                                </div>
                            </div>
                            <div className='flex mt-2'>
                                <TextField style={{ marginRight: 10 }} label="Email" fullWidth value={selectedTrainee.email} variant="outlined" />
                                <TextField label="Số điện thoại" fullWidth value={selectedTrainee.phone} variant="outlined" />
                            </div>
                            <div className='flex mt-2'>
                                <TextField style={{ marginRight: 10 }} label="Ngày sinh" fullWidth value={formatDate(selectedTrainee.birthdate)} variant="outlined" />
                                <TextField label="Giới tính" fullWidth value={selectedTrainee.gender} variant="outlined" />
                            </div>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDetailClose} sx={{ textTransform: "none" }}>Đóng</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default TraineeList;
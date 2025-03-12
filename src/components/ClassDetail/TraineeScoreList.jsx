import React, { useEffect, useState } from 'react';
import { ConfigProvider, Dropdown, Table, Tag, Modal as AntModal, message } from 'antd';
import { EditOutlined, DeleteOutlined, EllipsisOutlined, SearchOutlined, DownloadOutlined, InfoCircleOutlined, ExportOutlined } from '@ant-design/icons';
import { Button, CircularProgress, debounce, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useForm, Controller } from "react-hook-form";
import trainees from './TraineeScoreList.module.css';
import classNames from 'classnames/bind';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import { Spinner } from '../Spinner/Spinner';
import { ExportTraineeList, GetAllTraineeOfClass, GetAllTraineeScoreList, UpdateScoreTraineeList } from '../../services/TraineeApi';

const cx = classNames.bind(trainees);

const TraineeScoreList = ({ dataClass }) => {
    const { user } = useAuth();
    const { classId } = useParams();

    const [traineeList, setTraineeList] = useState([]);
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedTrainee, setSelectedTrainee] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [scores, setScores] = useState({});
    const [openErrorDialog, setOpenErrorDialog] = useState(false);
    const [errorList, setErrorList] = useState([]);

    const { handleSubmit, control, register, reset, formState: { errors } } = useForm();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    };

    const fetchAllTraineeScoreList = async () => {
        setIsLoading(true);
        const response = await GetAllTraineeScoreList(classId);
        const responseData = await response.json();

        if (response.ok) {
            setTraineeList(responseData.result);
        } else {
            setTraineeList([]);
            console.log("Error fetching trainee");
        }

        setIsLoading(false);
    };

    const hasNullScore = traineeList.some(trainee => trainee.score === null);

    useEffect(() => {
        fetchAllTraineeScoreList();
    }, [classId]);

    const handleDetailOpen = (trainee) => {
        setSelectedTrainee(trainee);
        setOpenDetail(true);
    };

    const handleDetailClose = () => {
        setOpenDetail(false);
        setSelectedTrainee(null);
    };

    const handleErrorClose = () => {
        setOpenErrorDialog(false)
        setErrorList([])
    };

    const handleEditClick = () => {
        setEditing(true);
    };

    const handleCancelEdit = () => {
        setScores({});
        setEditing(false);
    };

    const handleExport = async () => {
        setIsLoading(true);
        const response = await ExportTraineeList(classId);
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "DanhSachHocVien.xlsx";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            toast.success("Export dữ liệu thành công")
        } else {
            toast.error("Export dữ liệu thất bại")
        }
        setIsLoading(false);
    };

    const handleSaveScores = async () => {
        const invalidTrainees = traineeList.filter(
            (trainee) => trainee.score !== null && scores[trainee.traineeId] === null
        );

        if (invalidTrainees.length > 0) {
            toast.error("Không thể xóa điểm của học viên đã có điểm!");
            return;
        }

        const scoreTrainees = traineeList.map((trainee) => ({
            traineeId: trainee.traineeId,
            score: scores[trainee.traineeId] ?? trainee.score,
        }));

        const payload = {
            scoreTrainees,
            classId,
        };

        setIsLoading(true);
        const response = await UpdateScoreTraineeList(payload)
        const responseData = await response.json();
        if (response.ok) {
            toast.success("Cập nhật điểm thành công");
            setEditing(false)
            fetchAllTraineeScoreList();
            setScores({})
        } else {
            console.error("Lỗi khi cập nhật điểm:", responseData.result ? responseData.result : responseData.message);
            toast.error(responseData.result ? responseData.result : responseData.message);
            if (responseData.result) {
                setErrorList(responseData.result);
                setOpenErrorDialog(true);
            }
        }
        setIsLoading(false);
    };

    const handleScoreChange = (traineeId, value) => {
        const decimalValue = value ? parseFloat(value) : null;

        setScores((prevScores) => ({
            ...prevScores,
            [traineeId]: decimalValue,
        }));
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
        },
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',
            key: 'fullName',
            align: 'center',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            align: 'center',
        },
        {
            title: 'Điểm', key: 'score', align: 'center',
            render: (record) => (
                <TextField
                    value={scores[record.traineeId] !== undefined ? scores[record.traineeId] : record.score ?? ""}
                    onChange={(e) => handleScoreChange(record.traineeId, e.target.value)}
                    disabled={!editing}
                    variant="outlined"
                    size="small"
                    style={{ width: 80 }}
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                />
            )
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <p className='text-3xl'>Đánh giá kết quả học viên</p>
                    <div>
                        {(user.accountId === dataClass.lecturerId
                            || user.accountId === dataClass.projectManagerId
                            || user.roleId === 4
                        ) && dataClass.projectStatus === 'Đang diễn ra' && (
                                <button className={cx('export-button')} onClick={handleExport}>
                                    <ExportOutlined color='white' size={20} style={{ marginRight: '5px' }} />
                                    Export
                                </button>
                            )}

                        {user.accountId === dataClass.lecturerId && dataClass.projectStatus === "Đang diễn ra" && (
                            editing ? (
                                <div>
                                    <Button sx={{ backgroundColor: "#D45B13", color: "white" }} onClick={handleCancelEdit} color="secondary" variant="outlined">Hủy</Button>
                                    <Button sx={{ backgroundColor: "#2F903F" }} onClick={handleSaveScores} color="primary" variant="contained" style={{ marginLeft: 8 }}>Lưu</Button>
                                </div>
                            ) : (
                                <Button sx={{ backgroundColor: "#2F903F" }} onClick={handleEditClick} color="primary" variant="contained" disabled={hasNullScore}>Cập nhật</Button>
                            )
                        )}
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
                        dataSource={traineeList.map((trainee) => ({
                            key: trainee.traineeId,
                            traineeId: trainee.traineeId,
                            accountCode: trainee.account.accountCode,
                            fullName: trainee.account.fullName,
                            email: trainee.account.email,
                            phone: trainee.account.phone,
                            gender: trainee.account.gender,
                            birthdate: trainee.account.dateOfBirth,
                            avatar: trainee.account.avatarLink,
                            score: trainee.score
                        }))}
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

            <Dialog open={openErrorDialog} onClose={handleErrorClose} maxWidth="sm" fullWidth>
                <DialogTitle style={{ backgroundColor: "red", color: "white" }}>Lỗi khi cập nhật điểm</DialogTitle>
                <DialogContent>
                    {errorList && errorList.map((error) => (
                        <p className='m-4'>• {error}</p>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleErrorClose} sx={{ textTransform: "none" }}>Đóng</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default TraineeScoreList;
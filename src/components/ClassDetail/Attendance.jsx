import React, { useEffect, useState } from 'react';
import { ConfigProvider, Dropdown, Table, Tag, Modal as AntModal, message, Button } from 'antd';
import { EditOutlined, DeleteOutlined, EllipsisOutlined, SearchOutlined, DownloadOutlined, InfoCircleOutlined, ExportOutlined } from '@ant-design/icons';
import { CircularProgress, debounce, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useForm, Controller } from "react-hook-form";
import trainees from './Attendance.module.css';
import classNames from 'classnames/bind';
import { useParams, } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import { Spinner } from '../Spinner/Spinner';
import { ExportTraineeList } from '../../services/TraineeApi';


import { ImportAttendance } from '../Popup/Class/ImportAttendance';
import { exportTraineeAttendance, getAllTraineesAttendance } from '../../services/AttendanceApi';

const cx = classNames.bind(trainees);

const Attendance = ({ dataClass }) => {
  const { user } = useAuth();
  const { classId } = useParams();
  const [traineeAttendanceList, setTraineeAttendanceList] = useState([]);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedTrainee, setSelectedTrainee] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const fetchAllTraineeAttendance = async () => {
    setIsLoading(true);
    const response = await getAllTraineesAttendance(classId);
    const responseData = await response.json();


    if (response.ok) {
      setTraineeAttendanceList(responseData.result);
    } else {
      setTraineeAttendanceList([]);
      console.log("Lỗi khi lấy danh sách điểm danh");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchAllTraineeAttendance();
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


  const handleExportAttendance = async () => {
    setIsLoading(true);
    const response = await exportTraineeAttendance(classId);
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Danhsachdiemdanh.xlsx";
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





  const getMenuItems = (trainee) => [
    {
      key: '1',
      label: (
        <button style={{ fontWeight: "600" }} onClick={() => handleDetailOpen(trainee)}>
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
      title: 'Số buổi đi học', key: 'attendance', align: 'center',
      render: (record) => (
        <p><span style={{ fontStyle: 'italic', fontWeight: '600' }}>{record.totalPresentLesson}</span> / <span>{record.totalLesson}</span></p>
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
          <p className='text-3xl'>Điểm danh của học viên</p>
          <div>
            {user.roleId === 5
              && dataClass.projectStatus === 'Đang diễn ra' && (
                <Button size='large' color="primary" variant="contained" style={{ backgroundColor: "#d45b13", color: "white", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", marginRight: "8px" }} onClick={handleExportAttendance}>
                  <ExportOutlined color='white' size={20} style={{ marginRight: '5px' }} />
                  Export
                </Button>
              )}
            {user.roleId === 5 && dataClass.projectStatus === 'Đang diễn ra' && (
              <ImportAttendance classId={classId} refresh={fetchAllTraineeAttendance} />
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
            dataSource={traineeAttendanceList.map((trainee) => ({
              key: trainee.traineeId,
              traineeId: trainee.traineeId,
              accountCode: trainee.account.accountCode,
              fullName: trainee.account.fullName,
              email: trainee.account.email,
              phone: trainee.account.phone,
              gender: trainee.account.gender,
              birthdate: trainee.account.dateOfBirth,
              avatar: trainee.account.avatarLink,
              score: trainee.score,
              totalPresentLesson: trainee.totalPresentLesson,
              totalLesson: trainee.totalLesson,
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
          <Button onClick={handleDetailClose} style={{ textTransform: "none" }} type='primary' size='large'>Đóng</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openErrorDialog} onClose={handleErrorClose} maxWidth="sm" fullWidth>
        <DialogTitle style={{ backgroundColor: "red", color: "white" }}>Lỗi khi cập nhật điểm danh</DialogTitle>
        <DialogContent>
          {errorList && errorList.map((error) => (
            <p className='m-4'>• {error}</p>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleErrorClose} style={{ textTransform: "none" }}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Attendance;
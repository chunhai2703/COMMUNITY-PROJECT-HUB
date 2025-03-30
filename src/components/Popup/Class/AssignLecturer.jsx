import React, { useState } from 'react'
import classes from './AssignLecturer.module.css'
import classNames from 'classnames/bind'
import {
  TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  Autocomplete, CircularProgress
} from '@mui/material';
import { } from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import { UserAddOutlined } from '@ant-design/icons';
import { assignLecturerStudentToProject, searchLeturers } from '../../../services/AssignApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { message } from 'antd';


const cx = classNames.bind(classes)

export const AssignLecturer = (props) => {
  const [open, setOpen] = useState(false);
  const [lecturers, setLecturers] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const { handleSubmit, control, reset, formState: { errors } } = useForm({});


  const handleSearchLecturer = async (searchTerm) => {
    if (!searchTerm) return;
    setLoading(true);
    try {
      const data = await searchLeturers(searchTerm);
      console.log("Danh sách giảng viên từ API:", data); // Kiểm tra dữ liệu trả về
      setLecturers(data.result);
    } catch (error) {
      console.error(error.message);
    }
    setLoading(false);
  };



  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset()
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const sent = {
        classId: props.classId,
        accountId: data.lecturer.accountId,
        roleId: 2
      }
      await assignLecturerStudentToProject(sent);
      setLoading(false);
      toast.success("Giảng viên đã được phân công thành công!");
      handleClose();
      reset();
      if (user && (user?.roleId === 2)) {
        navigate(`/home-lecturer/project-detail/${props.project.projectId}`);
      } else if (user && (user?.roleId === 4)) {
        navigate(`/home-department-head/project-detail/${props.project.projectId}`);
      }

    } catch (error) {
      setLoading(false);
      console.error("Lỗi khi phân công giảng viên:", error);
      if (error.result && error.result.length > 0) {
        messageApi.open({
          type: 'error',
          title: 'Thông báo lỗi',
          content: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-start' }}>
              {error.result.split(',').map((error, index) => (
                <p key={index} >{error}</p>
              ))}
            </div>
          ),
        });
      } else {
        toast.error(error.message);
      }
    }

  };


  return (
    <React.Fragment>
      <button className={cx('class-assign-lecturer')} onClick={handleClickOpen}>
        <UserAddOutlined style={{ marginRight: '8px' }} /> Phân công giảng viên
      </button>
      {contextHolder}
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }} >Phân công giảng viên</DialogTitle>
        <DialogContent>
          <form className={cx('assign-lecturer-form')}>
            {/* Giảng viên */}
            <Controller
              name="lecturer"
              control={control}
              rules={{
                required: 'Vui lòng chọn giảng viên để phân công'
              }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={lecturers} // Danh sách từ API
                  getOptionLabel={(option) => option.fullName && option.accountName ? `${option.fullName} - ${option.accountName}` : option.fullName}
                  isOptionEqualToValue={(option, value) => option.accountId === value?.accountId}
                  onInputChange={(event, newInputValue) => handleSearchLecturer(newInputValue)}
                  onChange={(event, newValue) => {
                    console.log("Người giảng viên được chọn:", newValue);
                    field.onChange(newValue);
                  }}
                  loading={loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Giảng viên"
                      variant="outlined"
                      fullWidth
                      required
                      margin="normal"
                      defaultValue={field.value?.fullName ? `${field.value.fullName} - ${field.value.accountName}` : ''}
                      error={!!errors.lecturer}
                      helperText={errors.lecturer?.message}
                      slotProps={{
                        input: {
                          ...params.InputProps,
                        },
                        endAdornment: (
                          <>
                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              )}
            />

          </form>

        </DialogContent>
        <DialogActions>
          <button onClick={handleClose} className={cx('cancel-button')}>Hủy</button>
          <button type="submit" onClick={handleSubmit(onSubmit)} className={cx('create-button')} disabled={loading}>
            {loading ? <CircularProgress color="inherit" size={20} /> : 'Phân công'}
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );

}

import React, { useEffect, useState } from 'react'
import {
  TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
  InputLabel,
  FormControl
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { PlusCircleOutlined } from '@ant-design/icons';
import { message } from 'antd';
import classes from './AddNewTrainee.module.css'
import classNames from 'classnames/bind';
import { addNewTraineeToClass, } from '../../../services/AssignApi';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';



const cx = classNames.bind(classes);

export const AddNewTrainee = (props) => {
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [errorMessages, setErrorMessages] = useState([]); // ✅ Lưu lỗi vào state
  const [loading, setLoading] = useState(false);
  const { projectId, classId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();


  const { handleSubmit, control, reset, formState: { errors } } = useForm({
  });





  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const maxDate = getTodayDate();



  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset()
  };

  useEffect(() => {
    if (errorMessages.length > 0) {
      messageApi.open({
        type: 'error',
        title: 'Thông báo lỗi',
        content: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-start' }}>
            {errorMessages.map((error, index) => (
              <p key={index} >{error}</p>
            ))}
          </div>
        ),
      });
    }
  }, [errorMessages, messageApi]);


  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const formData = new FormData();
      formData.append("accountName", data.accountName);
      formData.append("fullName", data.fullName);
      formData.append("avatarLink", null);
      formData.append("phone", data.phone);
      formData.append("address", data.address);
      formData.append("email", data.email);
      formData.append("dateOfBirth", data.dateOfBirth);
      formData.append("gender", data.gender);
      formData.append("classId", classId);


      console.log("Dữ liệu formData trước khi gửi:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": ", pair[1]);
      }
      await addNewTraineeToClass(formData);

      toast.success("Học viên đã được tạo và thêm vào lớp thành công!");
      setLoading(false);
      handleClose();
      props.refresh();
      reset();
      setLoading(false);
      // if (user && (user?.roleId === 2)) {
      //   navigate(`/home-lecturer/class-detail/${projectId}/${props.classId}`);
      // } else if (user && (user?.roleId === 4)) {
      //   navigate(`/home-department-head/class-detail/${projectId}/${props.classId}`);
      // }

    } catch (error) {
      setLoading(false)
      console.error("Lỗi tạo học viên:", error);
      toast.error(error.message);

      console.log(error.result)
      const messages = Array.isArray(error.result)
        ? error.result
        : error.result
          ? [error.result]
          : typeof error.message === "string"
            ? error.message
            : [error.message];

      setErrorMessages(messages);

    }
  };



  return (
    <React.Fragment>
      <button className={cx('add-new-trainee-button')} onClick={handleClickOpen}>
        <PlusCircleOutlined color='white' size={20} style={{ marginRight: '5px' }} />
        Tạo học viên
      </button>
      {contextHolder}
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }} >
          Tạo mới học viên
        </DialogTitle>
        <DialogContent>

          <form className={cx('add-new-trainee-form')}>
            {/* Tên tài khoản */}
            <Controller
              name="accountName"
              control={control}
              defaultValue=""
              rules={{
                required: 'Vui lòng nhập tên tài khoản',
                minLength: {
                  value: 5,
                  message: 'Tên tài khoản phải có ít nhất 5 ký tự'
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tên tài khoản"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.accountName}
                  helperText={errors.accountName?.message}
                />
              )}
            />
            {/* Họ và tên */}
            <Controller
              name="fullName"
              control={control}
              defaultValue=""
              rules={{
                required: 'Vui lòng nhập họ và tên',
                minLength: {
                  value: 8,
                  message: 'Họ và tên phải có ít nhất 8 ký tự'
                },
                pattern: {
                  value: /^[\p{L}]+([\s\p{L}]+)*$/u,
                  message: 'Họ và tên không hợp lệ',
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Họ và tên"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.fullName}
                  helperText={errors.fullName?.message}
                />
              )}
            />
            {/* Số điện thoại */}
            <Controller
              name="phone"
              control={control}
              defaultValue=""
              rules={{
                required: 'Vui lòng nhập số điện thoại',
                pattern: {
                  value: /^0\d{9}$/,
                  message: 'Số điện thoại không hợp lệ',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Số điện thoại"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              )}
            />
            {/* Địa chỉ */}
            <Controller
              name="address"
              control={control}
              defaultValue=""
              rules={{
                required: 'Vui lòng nhập địa chỉ'
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Địa chỉ"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              )}
            />

            {/* Email */}
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: 'Vui lòng nhập email',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Email không hợp lệ',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />

            {/* Ngày sinh */}
            <Controller
              name="dateOfBirth"
              control={control}
              defaultValue=""
              rules={{
                required: 'Vui lòng nhập ngày sinh',
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Ngày sinh"
                  type="date"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={!!errors.dateOfBirth}
                  helperText={errors.dateOfBirth?.message}
                  inputProps={{
                    max: maxDate,
                  }}
                />
              )}
            />
            {/* Giới tính */}
            <FormControl fullWidth margin="normal">
              <InputLabel shrink>
                Giới tính
              </InputLabel>
              <Controller
                name="gender"
                control={control}
                defaultValue="Nam"
                render={({ field }) => (
                  <RadioGroup {...field} row>
                    <FormControlLabel value="Nam" control={<Radio />} label="Nam" />
                    <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
                  </RadioGroup>
                )}
              />
            </FormControl>

          </form>

        </DialogContent>
        <DialogActions>
          <button onClick={handleClose} className={cx('cancel-button')}>Hủy</button>
          <button type="submit" onClick={handleSubmit(onSubmit)} className={cx('create-button')} disabled={loading}>
            {loading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CircularProgress size={24} sx={{ color: "white" }} />
              </div>
            ) : (
              "Tạo mới"
            )}
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Controller, useForm } from 'react-hook-form';
import { ContainerOutlined } from '@ant-design/icons';
import classes from './RegisterClassForm.module.css'
import classNames from 'classnames/bind';
import useAuth from '../../../hooks/useAuth';
import { createRegistration } from '../../../services/RegistrationApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const cx = classNames.bind(classes);
export const RegisterClassForm = (props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const { handleSubmit, control,reset, formState: { errors } } = useForm();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = async (data) => {
    try {
    
      console.log("Dữ liệu gửi lên:", data);
      setLoading(true);
      // Tạo payload đúng định dạng API yêu cầu
      const payload = {
        accountId: user.accountId,
        classId: props.classId,
        description: data.description
      };
      console.log(payload);
      await createRegistration(payload);
      setLoading(false);
      toast.success("Đã đăng kí thành công vào dự án!");
      handleClose();
      reset();
      navigate(`/home-lecturer/my-registration`);
    } catch (error) {
      setLoading(false);
      console.error("Lỗi khi đăng kí dự án :", error);
      toast.error(error.message); // Hiển thị danh sách lỗi từ `result`
    }
  }

  return (
    <React.Fragment>
      <button className={cx('register-class-button')} onClick={handleClickOpen}>
        <ContainerOutlined style={{ marginRight: '8px' }} /> Đăng ký
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }} >Đăng ký lớp</DialogTitle>
        <DialogContent>
          <form className={cx('register-class-form')}>
            {/* Mô tả dự án */}
            <Controller
              name="description"
              id="description"
              control={control}
              defaultValue=""
              rules={{
                required: 'Vui lòng nhập mô tả bản thân',
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mô tả bản thân"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type='text'
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
          </form>

        </DialogContent>
        <DialogActions>
          <button onClick={handleClose} className={cx('cancel-button')}>Hủy</button>
          <button type="submit" className={cx('register-button')} onClick={handleSubmit(onSubmit)} disabled={loading}>  {loading ? <CircularProgress color="inherit" size={20} /> : 'Đăng ký'}</button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

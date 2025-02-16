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

const cx = classNames.bind(classes);
export const RegisterClassForm = () => {
  const [open, setOpen] = useState(false);

  const { handleSubmit, control, register, reset, formState: { errors } } = useForm();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  return (
    <React.Fragment>
      <button className={cx('detail-register', 'detail-button')} onClick={handleClickOpen}>
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
          <button type="submit" className={cx('register-button')}>Đăng ký</button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

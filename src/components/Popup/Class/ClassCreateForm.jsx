import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Controller, useForm } from 'react-hook-form';
import { PlusCircleOutlined } from '@ant-design/icons';
import classes from './ClassCreateForm.module.css'
import classNames from 'classnames/bind';

const cx = classNames.bind(classes);

export const ClassCreateForm = () => {
  const [open, setOpen] = useState(false);

  const { handleSubmit, control, register, reset, formState: { errors } } = useForm();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <button className={cx('create-class-button')} onClick={handleClickOpen}>
        <PlusCircleOutlined color='white' size={20} style={{ marginRight: '5px' }} />
        Tạo lớp
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }} >Tạo mới lớp</DialogTitle>
        <DialogContent>
          <form className={cx('create-class-form')}>
            <Controller
              name="className"
              id="className"
              control={control}
              defaultValue=""
              rules={{
                required: 'Vui lòng nhập tên lớp',
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tên lớp"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type='text'
                  error={!!errors.className}
                  helperText={errors.className?.message}
                />
              )}
            />
            <Controller
              name="classCode"
              id="classCode"
              control={control}
              defaultValue=""
              rules={{
                required: 'Vui lòng nhập mã lớp',
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mã lớp"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type='text'
                  error={!!errors.projectCode}
                  helperText={errors.projectCode?.message}
                />
              )}
            />
            <Controller
              name="Thời lượng khóa học (ngày)"
              id="duration"
              control={control}
              defaultValue="0"
              rules={{
                required: 'Vui lòng nhập tổng số ngày học'
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Thời lượng khóa học (ngày)"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type='number'
                  error={!!errors.duration}
                  helperText={errors.duration?.message}
                />
              )}
            />
          </form>

        </DialogContent>
        <DialogActions>
          <button onClick={handleClose} className={cx('cancel-button')} >Hủy</button>
          <button type="submit" className={cx('create-button')} >Tạo mới</button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

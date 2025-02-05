import React, { useState } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Controller, useForm } from 'react-hook-form';
import { PlusCircleOutlined } from '@ant-design/icons';
import classes from './CourseCreateForm.module.css'
import classNames from 'classnames/bind';

const cx = classNames.bind(classes);
export const CourseCreateForm = () => {
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
      <button className={cx('create-project-button')} onClick={handleClickOpen}>
        <PlusCircleOutlined color='white' size={20} style={{ marginRight: '5px' }} />
        Tạo dự án
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }} >Tạo Mới Dự Án</DialogTitle>
        <DialogContent>
          <form className={cx('create-project-form')}>
            <Controller
              name="projectName"
              id="projectName"
              control={control}
              defaultValue=""
              rules={{
                required: 'Vui lòng nhập tên dự án',
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tên dự án"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type='text'
                  error={!!errors.projectName}
                  helperText={errors.projectName?.message}
                />
              )}
            />
            <Controller
              name="projectCode"
              id="projectCode"
              control={control}
              defaultValue=""
              rules={{
                required: 'Vui lòng nhập mã dự án',
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mã dự án"
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
          {/* <Button onClick={handleClose}>Hủy</Button>
          <Button type="submit">Tạo mới</Button> */}
          <button onClick={handleClose} className={cx('cancel-button')} >Hủy</button>
          <button type="submit" className={cx('create-button')} >Tạo mới</button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

import React, { useState } from 'react'
import classes from './ProjectUpdateForm.module.css'
import classNames from 'classnames/bind'
import {
  TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  Autocomplete, CircularProgress
} from '@mui/material';
import { } from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import { EditOutlined } from '@ant-design/icons';
import { searchLeturers } from '../../../services/AssignApi';
import { updateProject } from '../../../services/ProjectsApi';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';


const cx = classNames.bind(classes)

export const ProjectUpdateForm = (props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { projectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  console.log(props.project);

  const { handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      lessonList: [''] // Khởi tạo một input mặc định
    }
  });

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Định dạng YYYY-MM-DD
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
      console.log("Dữ liệu projectManager trước khi gửi:", data.projectManager);


      const formData = new FormData();
      formData.append('projectId', props.project.projectId);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("startDate", data.startDate);
      formData.append("endDate", data.endDate);
      formData.append("applicationStartDate", data.applicationStartDate);
      formData.append("applicationEndDate", data.applicationEndDate);
      formData.append("address", data.address);


      console.log("Dữ liệu formData trước khi gửi:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": ", pair[1]);
      }
      await updateProject(formData);
      toast.success("Dự án đã được cập nhật thành công!");
      handleClose();
      reset();
      if (user && (user?.roleId === 2)) {
        navigate(`/home-lecturer/project-detail/${projectId}`);
      } else if (user && (user?.roleId === 4)) {
        navigate(`/home-department-head/project-detail/${projectId}`);
      }
    } catch (error) {
      console.error("Lỗi khi tạo dự án:", error);
      toast.error(error.message); // Hiển thị danh sách lỗi từ `result`
    }
  };




  return (
    <React.Fragment>
      <button className={cx('project-detail-update')} onClick={handleClickOpen}>
        <EditOutlined style={{ marginRight: '8px' }} /> Cập nhật
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }} >Cập nhật dự án</DialogTitle>
        <DialogContent>
          <form className={cx('update-project-form')}>

            {/* Tên dự án */}
            <Controller
              name="title"
              id="title"
              control={control}
              defaultValue={props.project.title}
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
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />

            {/* Mô tả dự án */}
            <Controller
              name="description"
              id="description"
              control={control}
              defaultValue={props.project.description}
              rules={{
                required: 'Vui lòng nhập mô tả dự án',
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mô tả dự án"
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


            {/* Ngày bắt đầu đăng ký */}
            <Controller
              name="applicationStartDate"
              id="applicationStartDate"
              control={control}
              defaultValue={props.project.applicationStartDate ? props.project.applicationStartDate.split('T')[0] : ''}
              rules={{
                required: 'Vui lòng chọn ngày bắt đầu đăng ký'
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Ngày bắt đầu đăng ký"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type='date'
                  slotProps={{
                    inputLabel: { shrink: true }, // Thay thế InputLabelProps
                  }}
                  inputProps={{ min: getTodayDate() }}
                  error={!!errors.applicationStartDate}
                  helperText={errors.applicationStartDate?.message}
                />
              )}
            />

            {/* Ngày kết thúc đăng ký */}
            <Controller
              name="applicationEndDate"
              id="applicationEndDate"
              control={control}
              defaultValue={props.project.applicationEndDate ? props.project.applicationEndDate.split('T')[0] : ''}
              rules={{
                required: 'Vui lòng chọn ngày kết thúc đăng ký'
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Ngày kết thúc đăng ký"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type='date'
                  slotProps={{
                    inputLabel: { shrink: true }, // Thay thế InputLabelProps
                  }}
                  inputProps={{ min: getTodayDate() }}
                  error={!!errors.applicationEndDate}
                  helperText={errors.applicationEndDate?.message}
                />
              )}
            />

            {/* Ngày bắt đầu dự án */}
            <Controller
              name="startDate"
              id="startDate"
              control={control}
              defaultValue={props.project.startDate ? props.project.startDate.split('T')[0] : ''}
              rules={{
                required: 'Vui lòng chọn ngày bắt đầu dự án'
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Ngày bắt đầu"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type='date'
                  slotProps={{
                    inputLabel: { shrink: true }, // Thay thế InputLabelProps
                  }}
                  inputProps={{ min: getTodayDate() }}
                  error={!!errors.startDate}
                  helperText={errors.startDate?.message}
                />
              )}
            />

            {/* Ngày kết thúc dự án */}
            <Controller
              name="endDate"
              id="endDate"
              control={control}
              defaultValue={props.project.endDate ? props.project.endDate.split('T')[0] : ''}
              rules={{
                required: 'Vui lòng chọn ngày kết thúc dự án'
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Ngày kết thúc"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type='date'
                  slotProps={{
                    inputLabel: { shrink: true }, // Thay thế InputLabelProps
                  }}
                  inputProps={{ min: getTodayDate() }}
                  error={!!errors.endDate}
                  helperText={errors.endDate?.message}
                />
              )}
            />


            {/* Địa chi dự án */}
            <Controller
              name="address"
              id="address"
              control={control}
              defaultValue={props.project.address}
              rules={{
                required: 'Vui lòng nhập địa chỉ',
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Địa chỉ"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type='text'
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              )}
            />
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
              "Cập nhật"
            )}
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

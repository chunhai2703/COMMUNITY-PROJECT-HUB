import React, { useState } from 'react'
import classes from './ProjectUpdateForm.module.css'
import classNames from 'classnames/bind'
import {
  TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  Autocomplete, CircularProgress
} from '@mui/material';
import { } from '@mui/icons-material';
import { Controller, useForm} from 'react-hook-form';
import { EditOutlined } from '@ant-design/icons';
import { searchLeturers } from '../../../services/LeturerApi';
import { updateProject } from '../../../services/ProjectsApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const cx = classNames.bind(classes)

export const ProjectUpdateForm = (props) => {
  const [open, setOpen] = useState(false);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();



  const { handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      lessonList: [''] // Khởi tạo một input mặc định
    }
  });

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const maxDate = getTodayDate();

  const handleSearchManager = async (searchTerm) => {
    if (!searchTerm) return;
    setLoading(true);
    try {
      const data = await searchLeturers(searchTerm);
      console.log("Danh sách giảng viên từ API:", data); // Kiểm tra dữ liệu trả về
      setManagers(data);
    } catch (error) {
      console.error("Lỗi tìm kiếm giảng viên:", error);
    }
    setLoading(false);
  };



  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
      formData.append("numberTraineeEachGroup", data.numberTraineeEachGroup);


      // Đảm bảo `projectManagerId` hợp lệ
      console.log("Dữ liệu projectManager account ID:", data.projectManager.accountId);
      // formData.append("projectManagerId", String(data.projectManager.accountId) );
      formData.append("projectManagerId", data?.projectManager?.accountId ? String(data.projectManager.accountId) : '');


      console.log("Dữ liệu formData trước khi gửi:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": ", pair[1]);
      }
      await updateProject(formData);
      toast.success("Dự án đã được cập nhật thành công!");
      handleClose();
      reset();
      navigate(`/home-department-head/project-detail/${props.project.projectId}`);
    } catch (error) {
      console.error("Lỗi khi cập nhật dự án:", error);
      toast.error("Không thể cập nhật dự án. Vui lòng thử lại sau!");
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
                    input: { max: maxDate } // Thay thế inputProps
                  }}
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
                    input: { max: maxDate } // Thay thế inputProps
                  }}
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

            {/* Tổng số sinh viên hố trợ (mỗi nhóm) */}
            <Controller
              name="numberTraineeEachGroup"
              id="numberTraineeEachGroup"
              control={control}
              defaultValue={props.project.numberTraineeEachGroup}
              rules={{
                required: 'Vui lòng nhập số sinh viên hỗ trợ cho mỗi nhóm',
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tổng số sinh viên hố trợ (mỗi nhóm)"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type='number'
                  error={!!errors.numberTraineeEachGroup}
                  helperText={errors.numberTraineeEachGroup?.message}
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
                    inputLabel: { shrink: true },
                    input: { max: maxDate }
                  }}
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
                    inputLabel: { shrink: true },
                    input: { max: maxDate }
                  }}
                  error={!!errors.applicationEndDate}
                  helperText={errors.applicationEndDate?.message}
                />
              )}
            />

            {/* Quản lý dự án */}
            <Controller
              name="projectManager"
              control={control}
              defaultValue={
                props.project?.projectManagerId && props.project?.projectManagerName
                  ? { accountId: props.project.projectManagerId, fullName: props.project.projectManagerName }
                  : null
              }
              rules={{ required: "Vui lòng chọn người quản lý dự án" }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={managers} // Danh sách từ API
                  getOptionLabel={(option) => option.fullName || ""}
                  isOptionEqualToValue={(option, value) => option.accountId === value?.accountId}
                  onInputChange={(event, newInputValue) => handleSearchManager(newInputValue)}
                  onChange={(event, newValue) => {
                    console.log("Người quản lý được chọn:", newValue);
                    field.onChange(newValue);
                  }}
                  loading={loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Quản lý dự án"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      defaultValue={field.value?.fullName}
                      error={!!errors.projectManager}
                      helperText={errors.projectManager?.message}
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
          <button type="submit" onClick={handleSubmit(onSubmit)} className={cx('create-button')}>
            Cập nhật
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

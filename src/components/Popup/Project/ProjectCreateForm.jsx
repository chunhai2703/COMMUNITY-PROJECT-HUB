import React, { useState } from 'react'
import {
  TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Box, Typography, Autocomplete, CircularProgress
} from '@mui/material';
import { RemoveCircleOutline, AddCircleOutline } from '@mui/icons-material';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import { PlusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import classes from './ProjectCreateForm.module.css'
import classNames from 'classnames/bind';
import { searchLeturers } from '../../../services/LeturerApi';
import { createProject } from '../../../services/ProjectsApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const cx = classNames.bind(classes);
export const ProjectCreateForm = () => {
  const [open, setOpen] = useState(false);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const { handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      lessonList: [''] // Khởi tạo một input mặc định
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lessonList"
  });



  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Định dạng YYYY-MM-DD
  };


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
    reset()
  };

  const onSubmit = async (data) => {
    try {
      console.log("Dữ liệu projectManager trước khi gửi:", data.projectManager);

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("startDate", data.startDate);
      formData.append("endDate", data.endDate);
      formData.append("applicationStartDate", data.applicationStartDate);
      formData.append("applicationEndDate", data.applicationEndDate);
      formData.append("address", data.address);
      formData.append("numberTraineeEachGroup", data.numberTraineeEachGroup);

      data.lessonList.forEach((lesson) => {
        if (lesson.value) {
          formData.append("lessonList", lesson.value);
        }
      });

      formData.append("projectManagerId", data?.projectManager?.accountId ? String(data.projectManager.accountId) : '');

      if (data.trainees?.length > 0) {
        const file = data.trainees[0]?.originFileObj;
        if (file) {
          formData.append("trainees", file);
        }
      }

      console.log("Dữ liệu formData trước khi gửi:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": ", pair[1]);
      }

      await createProject(formData);
      toast.success("Dự án đã được tạo thành công!");
      handleClose();
      reset();
      navigate('/home-department-head/projects');

    } catch (error) {
      console.error("Lỗi khi tạo dự án:", error);
      toast.error(error.message); // Hiển thị danh sách lỗi từ `result`
    }
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
        <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }} >Tạo mới dự án</DialogTitle>
        <DialogContent>
          <form className={cx('create-project-form')}>
            {/* Tên dự án */}
            <Controller
              name="title"
              id="title"
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
              defaultValue=""
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
              defaultValue=""
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
              defaultValue=""
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
              defaultValue=""
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
              defaultValue="1"
              rules={{
                required: 'Vui lòng nhập số học viên mỗi nhóm',
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Số học viên mỗi nhóm"
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
              defaultValue=""
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
              defaultValue=""
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

            {/* Quản lý dự án */}
            <Controller
              name="projectManager"
              control={control}
              defaultValue={null}
              rules={{ required: "Vui lòng chọn người quản lý dự án" }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={managers} // Danh sách từ API
                  getOptionLabel={(option) => `${option.fullName} - ${option.accountName}` || ""}
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

            {/* Upload File */}
            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Trainees</Typography>
            <Controller
              name="trainees"
              control={control}
              defaultValue={[]}
              rules={{
                required: 'Vui lòng chọn file để import',
              }}
              render={({ field }) => (
                <div>
                  <Upload
                    name="file"
                    accept=".xls,.xlsx"
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    headers={{ authorization: 'authorization-text' }}
                    fileList={field.value}
                    onChange={(info) => {
                      field.onChange(info.fileList);
                    }}
                    beforeUpload={() => false}
                  >
                    <Button icon={<UploadOutlined />} type='primary'>Click to Upload</Button>
                  </Upload>
                  {errors.trainees && <p style={{ color: "red" }}>{errors.trainees.message}</p>}
                </div>
              )}
            />

            {/* Danh sách bài học */}
            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Danh sách bài học</Typography>

            {fields.map((field, index) => (
              <Box key={field.id} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Controller
                  name={`lessonList.${index}.value`}
                  value={field.value || ""}
                  control={control}
                  defaultValue=""  // ✅ Đảm bảo giá trị mặc định là chuỗi rỗng
                  // rules={{ required: "Vui lòng nhập bài học" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={`Bài học ${index + 1}`}
                      fullWidth
                      error={!!errors.lessonList?.[index]}
                      helperText={errors.lessonList?.[index]?.message}
                    />
                  )}
                />
                <IconButton onClick={() => remove(index)} color="error">
                  <RemoveCircleOutline />
                </IconButton>
              </Box>
            ))}

            <Button
              variant="outlined"
              icon={<AddCircleOutline />}
              onClick={() => append({ value: "" })}
            >
              Thêm bài học
            </Button>


          </form>

        </DialogContent>
        <DialogActions>
          <button onClick={handleClose} className={cx('cancel-button')}>Hủy</button>
          <button type="submit" onClick={handleSubmit(onSubmit)} className={cx('create-button')}>
            Tạo mới
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

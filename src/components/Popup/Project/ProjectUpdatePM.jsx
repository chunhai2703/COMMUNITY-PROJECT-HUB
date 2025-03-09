import React, { useState, useEffect } from 'react'
import classes from './ProjectUpdatePM.module.css'
import classNames from 'classnames/bind'
import {
  TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  Autocomplete, CircularProgress
} from '@mui/material';
import { } from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import { UserSwitchOutlined } from '@ant-design/icons';
import { assignPMToProject, searchLecturersForPM } from '../../../services/AssignApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { Button, Tooltip } from 'antd';


const cx = classNames.bind(classes)


export const ProjectUpdatePM = (props) => {
  const [open, setOpen] = useState(false);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { project } = props;

  const { handleSubmit, control, reset, formState: { errors } } = useForm({});


  const handleSearchManager = async (searchTerm) => {
    if (!searchTerm) return;
    setLoading(true);
    try {
      const data = await searchLecturersForPM(searchTerm, props.project.projectId);
      console.log("Danh sách giảng viên từ API:", data); // Kiểm tra dữ liệu trả về
      setManagers(data.result);
    } catch (error) {
      console.error(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (project) {
      handleSearchManager('');
      reset({
        projectManager: project.projectManagerId && project.projectManagerName
          ? {
            accountId: project.projectManagerId,
            fullName: project.projectManagerName,
            accountName: project.accountName
          }
          : null
      });
    }
  }, [project]);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset()
  };

  const onSubmit = async (data) => {
    try {
      await assignPMToProject(props.project.projectId, data?.projectManager?.accountId ? String(data.projectManager.accountId) : '');
      toast.success("Quản lý dự án đã được cập nhật thành công!");
      handleClose();
      reset();
      if (user && (user?.roleId === 2)) {
        navigate(`/home-lecturer/project-detail/${props.project.projectId}`);
      } else if (user && (user?.roleId === 4)) {
        navigate(`/home-department-head/project-detail/${props.project.projectId}`);
      }

    } catch (error) {
      console.error("Lỗi khi tạo dự án:", error);
      toast.error(error.message);
    }
  };


  return (
    <React.Fragment>
      {/* <button className={cx('project-update-pm')} onClick={handleClickOpen}>
      <UserSwitchOutlined  style={{ marginRight: '8px' }} /> Thay đổi
      </button> */}
      <Tooltip title={<p style={{ fontSize: '14px', color: 'black' }}>Nhấn vào để cập nhật</p>} placement="right" color='white' >
        <Button icon={<UserSwitchOutlined style={{ fontSize: '18px' }} />} color='primary' variant='text' onClick={handleClickOpen} style={{ marginLeft: '8px' }} />
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }} >Bổ nhiệm quản lý dự án</DialogTitle>
        <DialogContent>
          <form className={cx('update-pm-form')}>
            {/* Quản lý dự án */}
            <Controller
              name="projectManager"
              control={control}
              defaultValue={
                project?.projectManagerId && project?.projectManagerName
                  ? { accountId: project.projectManagerId, fullName: project.projectManagerName, accountName: project.accountName }
                  : null
              }
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={managers} // Danh sách từ API
                  getOptionLabel={(option) => option.fullName && option.accountName ? `${option.fullName} - ${option.accountName}` : option.fullName}
                  isOptionEqualToValue={(option, value) => option.accountId === value?.accountId}
                  onInputChange={(event, newInputValue) => handleSearchManager(newInputValue)}
                  onChange={(event, newValue) => {
                    console.log("Người quản lý được chọn:", newValue);
                    field.onChange(newValue);
                  }}
                  loading={loading}
                  rules = {{
                    required: 'Vui lòng chọn quản lý dự án',
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Quản lý dự án"
                      variant="outlined"
                      fullWidth
                      required
                      margin="normal"
                      defaultValue={field.value?.fullName ? `${field.value.fullName} - ${field.value.accountName}` : ''}
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
            Bổ nhiệm
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );

}

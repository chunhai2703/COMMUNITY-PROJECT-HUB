import React, { useState } from 'react'
import classes from './ChangeClassStudent.module.css'
import classNames from 'classnames/bind'
import { Autocomplete, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { Controller, useForm } from 'react-hook-form';
import { searchStudents } from '../../../services/AssignApi';
import { toast } from 'react-toastify';
import { UserSwitchOutlined } from '@ant-design/icons';
import { ChangeLecturerStudentToClass } from '../../../services/LecturerApi';


const cx = classNames.bind(classes)

export const ChangeClassStudent = (props) => {
  const [open, setOpen] = useState(false);
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { projectId } = useParams();
  console.log(props.lecturer);


  const { handleSubmit, control, reset, formState: { errors } } = useForm({});


  const handleSearchStudent = async (searchTerm) => {
    if (!searchTerm) return;
    setLoading(true);
    try {
      const data = await searchStudents(searchTerm);
      console.log("Danh sách sinh viên hỗ trợ từ API:", data); // Kiểm tra dữ liệu trả về
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
        removedAccountId: props.student.studentId,
        classId: props.student.classId,
        accountId: data.student.accountId,
        roleId: 1
      }
      await ChangeLecturerStudentToClass(sent);
      setLoading(false);
      props.refresh();
      toast.success("Sinh viên đã được thay đổi thành công!");
      handleClose();
      reset();
      if (user && (user?.roleId === 2)) {
        navigate(`/home-lecturer/project-detail/${projectId}/member-list`);
      } else if (user && (user?.roleId === 4)) {
        navigate(`/home-department-head/project-detail/${projectId}/member-list`);
      }

    } catch (error) {
      setLoading(false);
      console.error("Lỗi khi thay đổi sinh viên:", error);
      if (error.result && error.result.length > 0) {
        toast.error(error.result);
      } else {
        toast.error(error.message);
      }
    }

  };


  return (
    <React.Fragment>
      <button className={cx('class-change-student')} onClick={handleClickOpen}>
        <UserSwitchOutlined style={{ marginRight: '8px' }} /> Thay đổi sinh viên
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }} >Thay đổi sinh viên hỗ trợ</DialogTitle>
        <DialogContent>
          <p style={{
            fontSize: '16px',
            marginTop: '15px'
          }}>Vui lòng chọn sinh viên bên dưới để thay thế sinh viên <span style={{ fontStyle: 'italic', fontWeight: '600' }}>{props.student.fullName} - {props.student.accountCode}</span> : </p>
          <form className={cx('change-lecturer-form')}>

            {/* Sinh viên thay thế */}
            <Controller
              name="student"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={lecturers} // Danh sách từ API
                  getOptionLabel={(option) => option.fullName && option.accountName ? `${option.fullName} - ${option.accountName}` : option.fullName}
                  isOptionEqualToValue={(option, value) => option.accountId === value?.accountId}
                  onInputChange={(event, newInputValue) => handleSearchStudent(newInputValue)}
                  onChange={(event, newValue) => {
                    console.log("Người sinh viên được chọn:", newValue);
                    field.onChange(newValue);
                  }}
                  loading={loading}
                  rules={{
                    required: 'Vui lòng chọn sinh viên thay thế'
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Sinh viên hỗ trợ"
                      variant="outlined"
                      fullWidth
                      required
                      margin="normal"
                      defaultValue={field.value?.fullName ? `${field.value.fullName} - ${field.value.accountName}` : ''}
                      error={!!errors.lecturers}
                      helperText={errors.lecturers?.message}
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
            {loading ? <CircularProgress color="inherit" size={20} /> : 'Thay đổi'}
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

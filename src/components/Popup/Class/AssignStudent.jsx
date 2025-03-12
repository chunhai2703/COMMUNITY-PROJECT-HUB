import React, { useState } from 'react'
import classes from './AssignStudent.module.css'
import classNames from 'classnames/bind'
import {
  TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  Autocomplete, CircularProgress
} from '@mui/material';
import { } from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import { UserAddOutlined } from '@ant-design/icons';
import { assignLecturerStudentToProject, searchStudents } from '../../../services/AssignApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';


const cx = classNames.bind(classes)
export const AssignStudent = (props) => {
  const [open, setOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const { handleSubmit, control, reset, formState: { errors } } = useForm({});


  const handleSearchStudent = async (searchTerm) => {
    if (!searchTerm) return;
    setLoading(true);
    try {
      const data = await searchStudents(searchTerm);
      console.log("Danh sách sinh viên từ API:", data); // Kiểm tra dữ liệu trả về
      setStudents(data.result);
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

      const sent = {
        classId: props.classId,
        accountId: data.student.accountId,
        roleId: 1
      }
      await assignLecturerStudentToProject(sent);
      toast.success("Sinh viên hỗ trợ đã được phân công thành công!");
      handleClose();
      reset();
      if (user && (user?.roleId === 2)) {
        navigate(`/home-lecturer/project-detail/${props.project.projectId}`);
      } else if (user && (user?.roleId === 4)) {
        navigate(`/home-department-head/project-detail/${props.project.projectId}`);
      }

    } catch (error) {
      // console.error("Lỗi khi phân công sinh viên:", error);
      // if (error.result) {
      //   toast.error(
      //     <div>
      //       {error.result.map((msg, index) => (
      //         <p key={index} style={{ margin: 0 }}>{msg}</p>
      //       ))}
      //     </div>
      //   );
      // } else {
      //   toast.error(error.message);
      // }
      console.error("Lỗi khi phân công sinh viên:", error);
      if (error.result && error.result.length > 0) {
        toast.error(error.result);
      } else {
        toast.error(error.message);
      }
    }

  };


  return (
    <React.Fragment>
      <button className={cx('class-assign-student')} onClick={handleClickOpen}>
        <UserAddOutlined style={{ marginRight: '8px' }} /> Phân công sinh viên
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }} >Phân công sinh viên hỗ trợ</DialogTitle>
        <DialogContent>
          <form className={cx('assign-student-form')}>
            {/* Sinh viên hỗ trợ */}
            <Controller
              name="student"
              control={control}
              rules={{
                required: 'Vui lòng chọn sinh viên hỗ trợ để phân công'
              }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={students} // Danh sách từ API
                  getOptionLabel={(option) => option.fullName && option.accountName ? `${option.fullName} - ${option.accountName}` : option.fullName}
                  isOptionEqualToValue={(option, value) => option.accountId === value?.accountId}
                  onInputChange={(event, newInputValue) => handleSearchStudent(newInputValue)}
                  onChange={(event, newValue) => {
                    console.log("Người sinh viên được chọn:", newValue);
                    field.onChange(newValue);
                  }}
                  loading={loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Sinh viên hỗ trợ"
                      variant="outlined"
                      fullWidth
                      required
                      margin="normal"
                      defaultValue={field.value?.fullName ? `${field.value.fullName} - ${field.value.accountName}` : ''}
                      error={!!errors.student}
                      helperText={errors.student?.message}
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
            Phân công
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

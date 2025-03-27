import React, { useState, useEffect } from 'react';
import classes from './TraineeChangeClass.module.css';
import classNames from 'classnames/bind';
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  MenuItem, Select, CircularProgress, Box
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { InteractionOutlined } from '@ant-design/icons';
import { changeClassOfTrainee } from '../../../services/AssignApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { searchClassTrainees } from '../../../services/TraineeApi';
import { Spinner } from '../../Spinner/Spinner';
import { Typography } from 'antd';

const cx = classNames.bind(classes);

export const TraineeChangeClass = (props) => {
  const [open, setOpen] = useState(false);
  const [classList, setClassList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const { handleSubmit, control, reset, formState: { errors }, setValue, watch } = useForm({});

  // Lấy giá trị classId từ react-hook-form
  const selectedClassId = watch("classId");

  const handleSearchClass = async () => {
    if (!user.accountId || !props.classId) return;
    setLoading(true);
    try {
      const data = await searchClassTrainees(props.classId, user.accountId);
      console.log("Danh sách lớp từ API:", data);
      setClassList(data.result);
    } catch (error) {
      setErrorMessage(error.message);
      console.error(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      handleSearchClass();
    }
  }, [open]);

  // Xử lý khi chọn lớp
  useEffect(() => {
    const selectedClass = classList.find((cls) => cls.classId === selectedClassId);
    setLessons(selectedClass ? selectedClass.lessons : []);
  }, [selectedClassId, classList]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const formatDateTimeRange = (startISO, endISO) => {
    const startDate = new Date(startISO);
    const endDate = new Date(endISO);

    // Format ngày tháng năm
    const datePart = startDate.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    // Format giờ phút
    const startTime = startDate.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Định dạng 24h
    });

    const endTime = endDate.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return `${datePart}: từ ${startTime} - ${endTime}`;
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const sent = {
        accountId: user.accountId,
        newClassId: data.classId, // Lấy đúng classId từ form
      };
      await changeClassOfTrainee(sent);
      setLoading(false);
      toast.success("Học viên chuyển lớp thành công!");
      props.refresh();
      handleClose();
      reset();
      navigate('/home-trainee/change-class');
    } catch (error) {
      setLoading(false);
      console.error("Lỗi khi chuyển lớp:", error);
      toast.error(error.message || "Lỗi không xác định!");
    }
  };
  if (!user) {
    return <Spinner />
  }

  return (
    <React.Fragment>
      <InteractionOutlined style={{ fontSize: 20, color: "steelblue" }} onClick={handleClickOpen} />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }}>Chuyển lớp</DialogTitle>
        <DialogContent>
          <form className={cx('change-class-form')}>
            {/* Select danh sách lớp */}
            {props.projectStatus === 'Lên kế hoạch' && <p className={cx('change-class-description')}>Bạn hiện không thể chuyển lớp vào lúc này vì chưa đến hạn chuyển lớp. Vui lòng quay lại sau !</p>}
            {props.projectStatus !== 'Sắp diễn ra' && props.projectStatus !== 'Lên kế hoạch' && <p className={cx('change-class-description')}>Bạn hiện không thể chuyển lớp vào lúc này vì đã quá hạn chuyển lớp!</p>}
            {errorMessage && errorMessage !== 'Dự án này hiện không thể đổi lớp' && <p className={cx('change-class-description')}>{errorMessage}</p>}
            <Controller
              name="classId"
              control={control}
              defaultValue=""
              rules={{ required: "Vui lòng chọn lớp để chuyển" }}
              render={({ field }) => (
                <Select
                  {...field}
                  fullWidth
                  displayEmpty
                  error={!!errors.classId}
                  helperText={errors.classId?.message}
                  value={field.value || ""}
                  onChange={(event) => {
                    field.onChange(event.target.value);
                    setValue("classId", event.target.value); // Đảm bảo cập nhật vào form
                  }}
                >
                  <MenuItem value="" disabled>
                    -- Chọn lớp --
                  </MenuItem>
                  {classList.length > 0 ? (
                    classList.map((cls) => (
                      <MenuItem key={cls.classId} value={cls.classId}>
                        {cls.classCode} - {cls.lecturerName}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>Không có lớp nào</MenuItem>
                  )}
                </Select>
              )}
            />
            {/* Hiển thị danh sách lessons của lớp được chọn */}
            {lessons.length > 0 && (
              <Box sx={{ marginTop: 3 }}>
                <p style={{ fontSize: 16, fontWeight: 500 }}>Lịch học</p>
                <Box

                  sx={{
                    padding: 2,
                    marginBottom: 1,
                    border: "1px solid #ccc",
                    borderRadius: 2,
                  }}
                >
                  {lessons.map((lesson) => (
                    <Typography key={lesson.lessonId}>
                      <strong>Phòng học:</strong> {lesson.room},  <strong>Thời gian:</strong> {formatDateTimeRange(lesson.startTime, lesson.endTime)}
                    </Typography>
                  ))}
                </Box>

              </Box>
            )}
          </form>
        </DialogContent>
        <DialogActions>
          <button onClick={handleClose} className={cx('cancel-button')}>Hủy</button>
          <button type="submit" onClick={handleSubmit(onSubmit)} className={cx('create-button')} disabled={loading}>
            {loading ? <CircularProgress color="inherit" size={20} /> : 'Chuyển lớp'}
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

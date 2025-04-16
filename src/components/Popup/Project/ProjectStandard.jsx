import React, { useEffect, useState } from 'react'
import classes from './ProjectStandard.module.css'
import classNames from 'classnames/bind'
import {
  TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  Autocomplete, CircularProgress,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  FormHelperText,
  FormControl
} from '@mui/material';
import { } from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import { EditOutlined } from '@ant-design/icons';
import { searchAssociate } from '../../../services/AssignApi';
import { updateProject, updateProjectStandard } from '../../../services/ProjectsApi';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { message } from 'antd';


const cx = classNames.bind(classes)

export const ProjectStandard = (props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { project } = props
  const { projectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  console.log(props.project);

  const { handleSubmit, control, reset, formState: { errors } } = useForm({

  });
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset()
  };


  useEffect(() => {
    reset({
      maxAbsent: props.project?.maxAbsentPercentage,
      failingScore: props.project?.failingScore
    });
  }, [props.project, reset]);
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const sent = {
        projectId: projectId,
        maxAbsentPercentage: data.maxAbsent,
        failingScore: data.failingScore
      }
      await updateProjectStandard(sent)
      setLoading(false);
      toast.success("Tiêu chuẩn đánh giá kết quả đã được cập nhật thành công!");
      handleClose();
      reset();
      props.refresh();
      props.refreshMaterial();
      navigate(`/home-department-head/project-detail/${projectId}/material`)
    } catch (error) {
      setLoading(false);
      console.error("Lỗi khi cập nhật tiêu chuẩn đánh giá kết quả:", error);
      if (error.result && error.result.length > 0) {
        messageApi.open({
          type: 'error',
          title: 'Thông báo lỗi',
          content: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-start' }}>
              {Array.isArray(error.result) ? (
                error.result.map((err, index) => <p key={index}>{err}</p>)
              ) : (
                <p>{error.result}</p>
              )}
            </div>
          ),
        });
      } else {
        toast.error(error.message);
      }
    }
  };




  return (
    <React.Fragment>
      <Button variant='contained' type='primary' onClick={handleClickOpen}>
        <EditOutlined style={{ marginRight: '8px' }} /> Chỉnh sửa
      </Button>
      {contextHolder}
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }} >Cập nhật tiêu chuẩn đánh giá kết quả</DialogTitle>
        <DialogContent>
          <form className={cx('standard-project-form')}>

            {/* Phần trăm tối đa được vắng */}
            <Controller
              name="maxAbsent"
              control={control}
              defaultValue={props.project?.maxAbsentPercentage}
              rules={{
                required: 'Vui lòng chọn phần trăm tối đa được vắng',
              }}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="maxAbsent-label"
                  id="maxAbsent"
                  displayEmpty
                  required
                  fullWidth
                >
                  <MenuItem value="" disabled>Chọn phần trăm tối đa được vắng (%)</MenuItem>
                  <MenuItem value={5}>5%</MenuItem>
                  <MenuItem value={10}>10%</MenuItem>
                  <MenuItem value={15}>15%</MenuItem>
                  <MenuItem value={20}>20%</MenuItem>
                  <MenuItem value={25}>25%</MenuItem>
                  <MenuItem value={30}>30%</MenuItem>
                  <MenuItem value={35}>35%</MenuItem>
                </Select>
              )}
            />
            {errors.maxAbsent && <FormHelperText>{errors.maxAbsent.message}</FormHelperText>}


            {/* Điểm tiêu chuẩn */}
            <Controller
              name="failingScore"
              control={control}
              defaultValue={props.project?.failingScore}
              rules={{
                required: 'Vui lòng nhập điểm tiêu chuẩn',
                min: { value: 0, message: 'Điểm không thể nhỏ hơn 0' },
                max: { value: 10, message: 'Điểm không thể lớn hơn 10' },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Điểm tiêu chuẩn"
                  variant="outlined"
                  fullWidth
                  required
                  margin="normal"
                  type="number"
                  inputProps={{ min: 0, max: 10 }}
                  error={!!errors.failingScore}
                  helperText={errors.failingScore?.message}
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

import React, { useState } from 'react'
import classes from './SubmitReport.module.css'
import classNames from 'classnames/bind'
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  CircularProgress
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { FormOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { Button, Tooltip, Typography, Upload } from 'antd';
import { UploadOutlined } from '@mui/icons-material';
import { submitReportTrainee } from '../../../services/TraineeApi';


const cx = classNames.bind(classes)
const { Title } = Typography;

export const SubmitReport = (props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const { handleSubmit, control, reset, formState: { errors } } = useForm({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset()
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const formData = new FormData();
      if (data.report?.length > 0) {
        const file = data.report[0]?.originFileObj;
        if (file) {
          formData.append("file", file);
        }
      }

      console.log("Dữ liệu formData trước khi gửi:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": ", pair[1]);
      }

      await submitReportTrainee(user.accountId, props.classId, formData);
      toast.success("Nộp báo cáo thành công!");
      handleClose();
      reset();
      setLoading(false);
      props.onRefresh();
      navigate('/home-trainee/my-classes');

    } catch (error) {
      setLoading(false);
      console.error("Lỗi khi nộp báo cáo:", error);
      if (error.result && error.result.length > 0) {
        toast.error(error.result[0]);
      } else {
        toast.error(error.message);
      }
    }

  };


  return (
    <React.Fragment>
      <span><Tooltip title={props.traineeReportContent !== null ? 'Cập nhật báo cáo' : 'Tạo báo cáo'}><FormOutlined className={cx('report-icon')} onClick={handleClickOpen} /></Tooltip></span>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }} >Báo cáo lớp học</DialogTitle>
        <DialogContent>
          <form className={cx('submit-report-form')}>

            {/* Upload File */}
            <Title level={3} style={{ marginTop: "10px", marginBottom: "10px" }}>Báo cáo</Title>
            <Controller
              name="report"
              control={control}
              defaultValue={[]}
              rules={{
                required: 'Vui lòng chọn file báo cáo',
              }}
              render={({ field }) => (
                <div>
                  <Upload
                    name="file"
                    accept='.doc, .docx, .pdf'
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    headers={{ authorization: 'authorization-text' }}
                    fileList={field.value}
                    onChange={(info) => {
                      field.onChange(info.fileList);
                    }}
                    beforeUpload={() => false}
                  >
                    <Button icon={<UploadOutlined />} type='primary' disabled={loading}>  {loading ? (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CircularProgress size={24} sx={{ color: "white" }} />
                      </div>
                    ) : (
                      "Nhấp vào để upload"
                    )}</Button>
                  </Upload>
                  {errors.trainees && <p style={{ color: "red" }}>{errors.trainees.message}</p>}
                </div>
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
              "Nộp"
            )}
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

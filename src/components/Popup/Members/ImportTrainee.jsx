import React, { useEffect, useState } from 'react'
import {
  TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Box, Typography, Autocomplete, CircularProgress
} from '@mui/material';
import { RemoveCircleOutline, AddCircleOutline, EditOutlined } from '@mui/icons-material';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import { PlusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Upload, message } from 'antd';
import classes from './ProjectCreateForm.module.css'
import classNames from 'classnames/bind';
import { searchAssociate, searchLeturers } from '../../../services/AssignApi';
import { createProject } from '../../../services/ProjectsApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';



const cx = classNames.bind(classes);
export const ProjectCreateForm = (props) => {
  const [open, setOpen] = useState(false);
  const [managers, setManagers] = useState([]);
  const [associates, setAssociates] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  // const [errorMessages, setErrorMessages] = useState([]); // ✅ Lưu lỗi vào state
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
      setManagers(data.result);
    } catch (error) {
      console.error("Lỗi tìm kiếm giảng viên:", error);
    }
    setLoading(false);
  };

  const handleSearchAssociate = async (searchTerm) => {
    if (!searchTerm) return;
    setLoading(true);
    try {
      const data = await searchAssociate(searchTerm);
      console.log("Danh sách đối tác từ API:", data); // Kiểm tra dữ liệu trả về
      setAssociates(data.result);
    } catch (error) {
      console.error("Lỗi tìm kiếm đối tác:", error);
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
      setLoading(true)
      console.log("Dữ liệu projectManager trước khi gửi:", data.projectManager);

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("startDate", data.startDate);
      formData.append("endDate", data.endDate);
      formData.append("applicationStartDate", data.applicationStartDate);
      formData.append("applicationEndDate", data.applicationEndDate);
      formData.append("address", data.address);



      formData.append("projectManagerId", data?.projectManager?.accountId ? String(data.projectManager.accountId) : '');

      if (data.trainees?.length > 0) {
        const file = data.trainees[0]?.originFileObj;
        if (file) {
          formData.append("trainees", file);
        }
      }

      formData.append("associateId", data?.associate?.accountId ? String(data.associate.accountId) : '');

      data.lessonList.forEach((lesson) => {
        if (lesson.value) {
          formData.append("lessonList", lesson.value);
        }
      });

      console.log("Dữ liệu formData trước khi gửi:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": ", pair[1]);
      }
      await createProject(formData);

      toast.success("Dự án đã được tạo thành công!");
      setLoading(false);
      handleClose();
      reset();
      props.refresh();
      navigate('/home-department-head/projects');

    } catch (error) {
      setLoading(false)
      console.error("Lỗi khi tạo dự án:", error);
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
      <button className={cx('project-detail-update')} onClick={handleClickOpen}>
        <EditOutlined style={{ marginRight: '8px' }} /> Import danh sách học viên
      </button>
      {contextHolder}
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }} >
          Tạo mới dự án
        </DialogTitle>
        <DialogContent>

          <form className={cx('import-trainee-form')}>
          

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
                    <Button icon={<UploadOutlined />} type='primary'>Nhấn vào để upload</Button>
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
              "Thêm vào"
            )}
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

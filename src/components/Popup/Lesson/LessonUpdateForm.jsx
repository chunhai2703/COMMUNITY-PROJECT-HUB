import React, { useState, useEffect } from "react";
import {
  TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Box, Typography,
  CircularProgress
} from "@mui/material";
import { RemoveCircleOutline, AddCircleOutline } from "@mui/icons-material";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { EditOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import classes from "./LessonUpdateForm.module.css";
import classNames from "classnames/bind";
import { updateLesson } from "../../../services/LessonApi";

const cx = classNames.bind(classes);

export const LessonUpdateForm = (props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
   const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const { handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      lessonList: props.project.lessons.map(lesson => ({
        value: lesson.lessonContent
      }))
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lessonList"
  });

  // Khi props.project.lessons thay đổi, cập nhật lại form
  useEffect(() => {
    if (props.project.lessons) {
      reset({
        lessonList: props.project.lessons.map(lesson => ({
          value: lesson.lessonContent,  // Chỉ lấy lessonContent để hiển thị
        }))
      });
    }
  }, [props.project.lessons, reset]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      console.log("Dữ liệu gửi lên:", data);

      // Tạo payload đúng định dạng API yêu cầu
      const payload = {
        projectId: props.project.projectId,
        lessonOfProject: data.lessonList.map(lesson => lesson.value)
      };

      console.log("Payload trước khi gửi:", JSON.stringify(payload, null, 2));

      await updateLesson(payload);
      setLoading(false);
      toast.success("Nội dung dự án đã được cập nhật!");
      handleClose();
      reset();
      navigate(`/home-department-head/project-detail/${props.project.projectId}`);
    } catch (error) {
      setLoading(false);
      console.error("Lỗi khi cập nhật nội dung dự án :", error);
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
      <button className={cx("update-lesson-button")} onClick={handleClickOpen}>
        <EditOutlined color="white" size={20} style={{ marginRight: "5px" }} />
        Chỉnh sửa
      </button>
      {contextHolder}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }}>
          Cập nhật nội dung dự án
        </DialogTitle>
        <DialogContent>
          <form className={cx("update-lesson-form")}>
            {/* Danh sách nội dung */}
            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
              Danh sách nội dung
            </Typography>

            {fields.map((field, index) => (
              <Box key={field.id} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Controller
                  name={`lessonList.${index}.value`}
                  control={control}
                  defaultValue={field.value} // ✅ Gán giá trị mặc định
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={`Nội dung ${index + 1}`}
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
              Thêm nội dung
            </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <button onClick={handleClose} className={cx("cancel-button")}>
            Hủy
          </button>
          <button type="submit" onClick={handleSubmit(onSubmit)} className={cx("create-button")} disabled={loading}>
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
};

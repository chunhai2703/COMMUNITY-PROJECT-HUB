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
import classes from "./FeedbackUpdateForm.module.css";
import classNames from "classnames/bind";
import { updateLesson } from "../../../services/LessonApi";
import { updateQuestionOfProject } from "../../../services/FeedbackApi";

const cx = classNames.bind(classes);

export const FeedbackUpdateForm = (props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  console.log(props.question);


  const { handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      answerList: props.question?.anwserList?.map(answer => ({
        answerId: answer.answerId,
        value: answer.answerContent
      }))
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "answerList"
  });


  const handleClickOpen = () => {
    setOpen(true);
    if (props.question.answerList) {
      reset({
        question: props.question.questionContent,
        answerList: props.question.anwserList.map(answer => ({
          answerId: answer.answerId,
          value: answer.answerContent
        }))
      });
    }
  };
  const handleClose = () => {
    setOpen(false);
    if (props.question.answerList) {
      reset({
        question: props.question.questionContent,
        answerList: props.question.anwserList.map(answer => ({
          answerId: answer.answerId,
          value: answer.answerContent
        }))
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      console.log("Dữ liệu gửi lên:", data);

      await updateQuestionOfProject(props.question.questionId, data.question, data.answerList.map(answer =>
        answer.value
      ));
      setLoading(false);
      toast.success("Nội dung câu hỏi đã được cập nhật!");
      handleClose();
      reset();
      props.refresh()
      navigate(`/home-business-relation/feedback-management`);
    } catch (error) {
      setLoading(false);
      console.error("Lỗi khi cập nhật nội dung câu hỏi :", error);
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
      <button className={cx("update-feedback-button")} onClick={handleClickOpen}>
        <EditOutlined color="white" size={20} style={{ marginRight: "5px" }} />
        Chỉnh sửa
      </button>
      {contextHolder}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }}>
          Tạo câu hỏi
        </DialogTitle>
        <DialogContent>
          <form className={cx("update-feedback-form")}>

            {/* Câu hỏi */}
            <Controller
              name="question"
              id="question"
              control={control}
              defaultValue={props.question.questionContent}
              rules={{
                required: 'Vui lòng nhập câu hỏi',
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Câu hỏi"
                  variant="outlined"
                  fullWidth
                  required
                  margin="normal"
                  type='text'
                  multiline
                  rows={2}
                  error={!!errors.question}
                  helperText={errors.question?.message}
                />
              )}
            />
            {/* Danh sách đáp án */}
            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Các đáp án</Typography>

            {fields.map((field, index) => (
              <Box key={field.answerId} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Controller
                  name={`answerList.${index}.value`}
                  control={control}
                  rules={{ required: "Vui lòng nhập đáp án" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={`Đáp án ${index + 1}`}
                      fullWidth
                      error={!!errors.answerList?.[index]}
                      helperText={errors.answerList?.[index]?.message}
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
              Thêm đáp án
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

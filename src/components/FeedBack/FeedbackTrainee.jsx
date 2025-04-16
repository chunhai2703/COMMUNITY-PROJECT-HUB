import React, { useCallback, useEffect, useState } from 'react'
import classes from './FeedbackTrainee.module.css'
import classNames from 'classnames/bind'
import useAuth from '../../hooks/useAuth'
import { createQuestionOfProject, getAllQuestionOfProject, TraineeFeedbackOfProject } from '../../services/FeedbackApi'
import { message, Radio } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { TextField } from '@mui/material'
import { Spinner } from '../Spinner/Spinner'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const cx = classNames.bind(classes)

export const FeedbackTraineeForm = (props) => {
  const [questionList, setQuestionList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const { user } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();


  const { handleSubmit, control, reset, formState: { errors } } = useForm({
  });



  const onChange = e => {
    setValue(e.target.value);
  };

  const fetchAllQuestionOfProject = useCallback(async () => {
    setLoading(true);
    const response = await getAllQuestionOfProject("");
    if (response.isSuccess) {
      setQuestionList(response.result);
      setLoading(false);
    } else {
      setLoading(false);
      setQuestionList([]);
      console.error("Lỗi khi lấy các câu hỏi:", response.message);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchAllQuestionOfProject();
    }
  }, [fetchAllQuestionOfProject, user]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      console.log("Dữ liệu gửi lên:", data);

      // Lấy danh sách answerId từ các key không phải 'extraFeedback'
      const selectedAnswers = Object.entries(data)
        .filter(([key]) => key !== 'extraFeedback')
        .map(([_, value]) => value); // value chính là answerId

      // Gọi API
      await TraineeFeedbackOfProject(
        user?.accountId,
        "4B704C77-7D8C-4C1A-A4ED-412B3908187A",
        data.extraFeedback,
        selectedAnswers
      );

      setLoading(false);
      toast.success("Đánh giá của bạn đã được ghi nhận!");
      reset();
    } catch (error) {
      setLoading(false);
      console.error("Lỗi khi gửi đánh giá :", error);
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



  if (!user || loading || !questionList) {

    return <Spinner />
  }

  return (
    <div className={cx('feedback-trainee-container')}>
      <h2 className={cx('feedback-trainee-title')}>Đánh giá dự án</h2>
      {contextHolder}
      <div className={cx('feedback-trainee-content')}>
        <form className={cx('feedback-form')}>
          {questionList?.map((question, index) => (
            <div key={question.questionId} className={cx('feedback-question-list')}>
              <p className={cx('feedback-question')}>
                <span>{index + 1}. </span>
                {question.questionContent}
              </p>
              <Controller
                name={String(question.questionId)}
                control={control}
                rules={{ required: 'Vui lòng chọn một đáp án' }}
                render={({ field }) => (
                  <Radio.Group
                    {...field}
                    className={cx('feedback-option')}
                    style={{ fontSize: '18px' }}
                    size='large'
                    options={question.anwserList.map(answer => ({
                      label: answer.answerContent,
                      value: answer.answerId
                    }))}
                  />
                )}
              />
              {errors[question.questionId] && (
                <p className={cx('error-text')}>
                  * {errors[question.questionId]?.message}
                </p>
              )}
            </div>
          ))}

          {/* Extra feedback */}
          <Controller
            name="extraFeedback"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Ý kiến khác (nếu có)"
                multiline
                fullWidth
                rows={3}
                margin="normal"
              />
            )}
          />
        </form>

      </div>

      <div className={cx('feedback-trainee-footer')}>
        <button
          className={cx('submit-button')}
          onClick={handleSubmit(onSubmit)}
        >
          Gửi đánh giá
        </button>
        <button
          className={cx('reset-button')}
          type="button"
          onClick={() => reset()}
        >
          Tải lại
        </button>
      </div>
    </div>
  )
}

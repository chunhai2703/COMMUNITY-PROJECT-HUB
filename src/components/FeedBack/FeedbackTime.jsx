import React, { useEffect, useState, useCallback } from "react";
import { Button, Space } from "antd";
import { CircularProgress, InputLabel } from "@mui/material";
import { useForm, Controller, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import classNames from "classnames/bind";
import classes from "./FeedbackTime.module.css";
import useAuth from "../../hooks/useAuth";
import { Spinner } from "../Spinner/Spinner";
import {
  getFeedbackTime,
  updateFeedbackTime,
} from "../../services/FeedbackApi";
import { InputNumber } from "antd";

const cx = classNames.bind(classes);

export const FeedbackTime = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [displayedFeedbackTime, setDisplayedFeedbackTime] = useState(null);
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const fetchFeedbackTime = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getFeedbackTime();
      if (response.isSuccess) {
        setValue("maxFeedbackTime", response.result);
        setDisplayedFeedbackTime(response.result);
      } else {
        console.error("Lỗi khi lấy thời gian:", response.message);
      }
    } catch (err) {
      console.error("Lỗi khi gọi API:", err);
    } finally {
      setLoading(false);
    }
  }, [setValue]);

  useEffect(() => {
    fetchFeedbackTime();
  }, [fetchFeedbackTime]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await updateFeedbackTime(data.maxFeedbackTime);
      toast.success("Cập nhật thời gian đánh giá thành công!");
      setDisplayedFeedbackTime(data.maxFeedbackTime);
      fetchFeedbackTime();
    } catch (error) {
      toast.error(error.message || "Đã xảy ra lỗi!");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Spinner />;

  return (
    <div className={cx("feedback-time-container")}>
      <h2 className={cx("feedback-time-title")}>Thời gian đánh giá dự án</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cx("feedback-time-form")}
      >
        <p className={cx("feedback-time-description")}>
          *Thời gian cho phép thực hiện đánh giá sau ngày kết thúc dự án là:
          <br />
          <span className={cx("feedback-time-value")}>
            {displayedFeedbackTime} ngày
          </span>
        </p>
        <div className={cx("input-group")}>
          <label className={cx("input-label")}>Thời gian: </label>
          <Controller
            name="maxFeedbackTime"
            control={control}
            defaultValue=""
            rules={{
              required: "Vui lòng nhập thời gian!",
              validate: (value) =>
                value > 0 && value < 91
                  ? true
                  : "Thời gian phải trong khoảng từ 1 đến 90 ngày",
            }}
            render={({ field }) => (
              <div className={cx("input-container")}>
                <InputNumber
                  {...field}
                  step={1}
                  placeholder="Đơn vị: ngày"
                  className={cx("feedback-time-input")}
                  size="large"
                />
              </div>
            )}
          />
        </div>
        {errors.maxFeedbackTime && (
          <p className={cx("error-message")}>
            {errors.maxFeedbackTime.message}
          </p>
        )}

        <Space style={{ marginTop: 16 }} className={cx("button-group")}>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Cập nhật"
            )}
          </Button>
          <Button
            size="large"
            onClick={() => fetchFeedbackTime()}
            disabled={loading}
          >
            Hủy
          </Button>
        </Space>
      </form>
    </div>
  );
};

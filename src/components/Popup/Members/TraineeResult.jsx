import React, { useState } from 'react';
import { Button, Divider, Modal, Progress } from 'antd';
import classes from './TraineeResult.module.css'
import classNames from 'classnames/bind';
import { BarChartOutlined } from '@ant-design/icons';

const cx = classNames.bind(classes);
export const TraineeResult = (props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const showLoading = () => {
    setOpen(true);
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    // Cleanup function
    return () => clearTimeout(timer);
  };

  return (
    <>
      <Button icon={<BarChartOutlined />} size='small' color='gold' variant='solid' style={{ fontSize: '12px' }} onClick={showLoading}>
        Xem kết quả
      </Button>
      <Modal
        title={<p className={cx('trainee-result-title')}>Báo cáo kết quả</p>}
        footer={
          <Button type="primary" size='large' onClick={showLoading}>
            Tải lại
          </Button>
        }
        // footer={null}
        loading={loading}
        open={open}
        onCancel={() => setOpen(false)}
      >
        <div className={cx('trainee-result-container')}>
          <div className={cx('trainee-result-content')}>

            <p className={cx('trainee-result')}>
              <span className={cx('label')}>Điểm danh: </span>
              <span className={cx('attendance-value')}><span style={{ fontWeight: '600' }}>{props.traineeTotalPresentSlot}</span> / {props.traineeTotalSlot} buổi</span>
            </p>
            <p className={cx('trainee-result')}>
              <span className={cx('label')}>Điểm số báo cáo: </span>
              <span className={cx('score-value')} style={{ fontWeight: '600' }}>{props.traineeScore.toFixed(1)}</span>
            </p>

            {props.traineeReportContent === null && (
              <p className={cx('trainee-result-noti')}>* Học viên chưa hoàn thành bài báo cáo bài học trước thời hạn</p>
            )}
          </div>


          <Divider />
          <div className={cx('trainee-result-progress')}>
            <span className={cx('progress-label')}>Đánh giá: </span>
            <Progress type="circle" percent={100} status={props.traineeResult ? "success" : "exception"} strokeWidth={9} size={"default"} format={() => (
              <span style={{ fontSize: '20px' }}>
                {props.traineeResult ? "Đã đạt" : "Chưa đạt"}
              </span>)} />
          </div>
        </div>
      </Modal>
    </>
  );
};

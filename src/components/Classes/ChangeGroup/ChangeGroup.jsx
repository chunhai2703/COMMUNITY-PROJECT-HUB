import React, { useState, useEffect, useCallback } from 'react';
import { Button, ConfigProvider, Form, Input, Select, Space } from 'antd';
import classes from './ChangeGroup.module.css';
import classNames from 'classnames/bind';
import useAuth from '../../../hooks/useAuth';
import { Spinner } from '../../Spinner/Spinner';
import { toast } from 'react-toastify';
import { searchGroupTrainees } from '../../../services/TraineeApi';
import { CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { changeGroupOfTrainee } from '../../../services/AssignApi';

const cx = classNames.bind(classes);

export const ChangeGroup = (props) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [groupList, setGroupList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const { handleSubmit, control, reset, formState: { errors }, setValue, watch } = useForm({});

  const selectedGroup = watch("groupNo");

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };


  const handleSearchGroup = useCallback(async () => {
    if (!user.accountId || !props.dataClass.classId) return;
    setLoading(true);
    try {
      const data = await searchGroupTrainees(props.dataClass.classId, user.accountId);
      console.log("Danh sách nhóm từ API:", data);

      // Xử lý dữ liệu: Nếu chỉ có số nhóm, tạo danh sách phù hợp
      const formattedGroups = data.result?.map((groupNo) => ({
        value: groupNo,
        label: `Nhóm ${groupNo}`,
      })) || [];

      setGroupList(formattedGroups);
    } catch (error) {
      console.error(error.message);
      setErrorMessage(error.message);
    }
    setLoading(false);
  }, [user.accountId, props.dataClass.classId]);

  useEffect(() => {
    if (user.accountId && props.dataClass.classId) {
      handleSearchGroup();
    }
  }, [user.accountId, props.dataClass.classId, handleSearchGroup]);

  const onFinish = async (data) => {
    try {
      setLoading(true);
      const sent = {
        accountId: user.accountId,
        classId: props.dataClass.classId,
        newGroupNo: data.groupNo
      };
      await changeGroupOfTrainee(sent);
      setLoading(false);
      toast.success("Học viên chuyển nhóm thành công!");
      reset();
      window.location.reload();
    } catch (error) {
      setLoading(false);
      console.error("Lỗi khi chuyển nhóm:", error);
      toast.error(error.message || "Lỗi không xác định!");
    }
  };

  if (!user) {
    return <Spinner />;
  }

  return (
    <div className={cx('change-class-container')}>
      <h2 className={cx('change-class-title')}>Đơn Xin Chuyển Nhóm</h2>
      {props.dataClass.projectStatus === 'Lên kế hoạch' &&
        <p className={cx('change-group-description')}>
          Bạn hiện không thể chuyển nhóm vào lúc này vì chưa đến hạn chuyển nhóm. Vui lòng quay lại sau!
        </p>}
      {props.dataClass.projectStatus !== 'Sắp diễn ra' && props.dataClass.projectStatus !== 'Lên kế hoạch' &&
        <p className={cx('change-group-description')}>
          Bạn hiện không thể chuyển nhóm vào lúc này vì đã quá hạn chuyển nhóm!
        </p>}
      {errorMessage && errorMessage !== 'Dự án này hiện không thể đổi nhóm' && <p className={cx('change-group-description')}>
        {errorMessage}
      </p>}

      <ConfigProvider theme={{
        components: {
          Form: {
            labelFontSize: 18,
            margin: 0,
          },
        },
      }}>
        <Form
          {...layout}
          name="change-group-form"
          onFinish={handleSubmit(onFinish)}
          size="large"
          style={{ maxWidth: 600 }}
        >
          <Form.Item label="Họ và tên">
            <Input value={user.fullName} disabled />
          </Form.Item>

          <Form.Item label="Mã học viên">
            <Input value={user.accountCode} disabled />
          </Form.Item>

          {/* Chọn nhóm từ danh sách API */}
          <Form.Item
            label="Nhóm"
            validateStatus={errors.groupNo ? "error" : ""}
            help={errors.groupNo?.message}
          >
            <Controller
              name="groupNo"
              control={control}
              rules={{ required: "Vui lòng chọn nhóm!" }}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Chọn nhóm để chuyển"
                  value={selectedGroup || null}
                  onChange={(value) => setValue("groupNo", value)}
                  loading={loading}
                  options={groupList.length > 0 ? groupList : [{ value: "", label: "Không có nhóm khả dụng", disabled: true }]}
                  error={!!errors.groupNo}
                  helperText={errors.groupNo?.message}
                />
              )}
            />
          </Form.Item>

          <Form.Item label={null}>
            <Space style={{ marginTop: '1rem' }}>
              <Button type="primary" htmlType="submit" disabled={loading || groupList.length === 0}>
                {loading ? <CircularProgress color="inherit" size={20} /> : 'Chuyển nhóm'}
              </Button>
              <Button type="default" onClick={() => reset()}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </ConfigProvider>
    </div>
  );
};

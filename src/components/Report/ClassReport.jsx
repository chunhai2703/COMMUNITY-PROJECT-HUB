import React, { useState } from 'react'
import classes from './ClassReport.module.css'
import classNames from 'classnames/bind'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { Controller, useForm } from 'react-hook-form'
import { TextField } from '@mui/material'
import { Button, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

const cx = classNames.bind(classes)

export const ClassReport = () => {
  const { control, handleSubmit, setValue, formState: { isDirty } } = useForm();
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className={cx('report-container')}>
      <div className={cx('report-header')}>
        <h2 className={cx('report-logo')}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
        <p className={cx('report-slogan')}>Độc lập - Tự do - Hạnh phúc</p>
        <p style={{ fontWeight: 'bold' }}>---------------------------</p>
      </div>
      <div className={cx('report-title')}>
        <h3 className={cx('report-title-text')}>BÁO CÁO CÔNG VIỆC</h3>
        <p className={cx('report-title-subtext')}>(Dự án: "📚 Hành trình tri thức")</p>
      </div>

      <div className={cx('report-content')}>
        <form className={cx('report-form')}>
          {[
            { label: "Kính gửi:", value: <p>Quản lý dự án <span style={{ fontStyle: 'italic' }}>Trần Minh Công</span></p> },
            { label: "Tôi tên:", value: `Nguyễn Dạ Minh Châu` },
            { label: "Mã giảng viên:", value: `LT345678` },
            { label: "Lớp:", value: `C789` },
            { label: "Vai trò:", value: `Giảng viên` },
            {
              label: "Nội dung báo cáo:",
              value: isEditing ? (
                <Controller
                  name="reportContent"
                  control={control}
                  defaultValue={' "Bếp Ăn Yêu Thương" là một dự án cộng đồng nhằm cung cấp những bữa ăn miễn phí cho người vô gia cư, lao động nghèo, trẻ em cơ nhỡ và bệnh nhân khó khăn tại các bệnh viện. Dự án không chỉ giúp đỡ về vật chất mà còn lan tỏa tinh thần nhân ái và sẻ chia trong xã hội.'}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className={cx('textarea')}
                      fullWidth
                      rows={6}
                      multiline
                      required
                    />
                  )}
                />
              ) : (
                <div className={cx('textareaNotEditing')}>
                  "Bếp Ăn Yêu Thương" là một dự án cộng đồng nhằm cung cấp những bữa ăn miễn phí cho người vô gia cư, lao động nghèo, trẻ em cơ nhỡ và bệnh nhân khó khăn tại các bệnh viện. Dự án không chỉ giúp đỡ về vật chất mà còn lan tỏa tinh thần nhân ái và sẻ chia trong xã hội.
                </div>
              ),
            },
            {
              label: "Bảng điểm:",
              value: isEditing ? (
                <Controller
                  name="score"
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
                      {/* {errors.trainees && <p style={{ color: "red" }}>{errors.trainees.message}</p>} */}
                    </div>
                  )}
                />
              ) : (
                <p className={cx('scoreTableNotEditing')}>
                  Nhấn vào để xem
                </p>
              ),
            },


          ].map((item, index) => (
            <div key={index} className={cx('infoRow')}>
              <p className={cx('label')}>{item.label}</p>
              <span className={cx('info')}>
                {item.value}
              </span>
            </div>
          ))}

        </form>
        <div className={cx('signature-container')}>
          <p className={cx('signature-date')}>Ngày 09 tháng 03 năm 2025</p>
          <p className={cx('signature-title')}>Ký tên</p>
          <p className={cx('signature-name')}>Nguyễn Dạ Minh Châu</p>
        </div>
      </div>
      <div className={cx('report-buttons')}>
        {isEditing && (
          <Button
            type="button"
            variant="contained"
            className={cx('saveButton')}
          // onClick={handleSubmit(onSubmit)}
          >
            Lưu
          </Button>
        )}

        <Button
          type="button"
          variant="contained"
          className={`${isEditing ? cx('editProfileButtonEditing') : cx('editProfileButtonNotEditing')}`}
          onClick={handleEditToggle}
        >
          {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa hồ sơ"}
        </Button>
      </div>
    </div>
  )
}

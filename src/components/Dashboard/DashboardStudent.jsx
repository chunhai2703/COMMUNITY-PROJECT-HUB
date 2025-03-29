import React, { useState, useEffect } from 'react';
import classes from './DashboardStudent.module.css';
import classNames from 'classnames/bind';
import { Banner } from '../Banner/Banner';
import dayjs from 'dayjs'; // 🟢 Import dayjs để xử lý ngày giờ
import 'dayjs/locale/vi'; // 🟢 Dùng tiếng Việt cho định dạng ngày
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'animate.css';
import { Collapse } from 'antd';
import { DownOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import useAuth from '../../hooks/useAuth';
import { Spinner } from '../Spinner/Spinner';


const cx = classNames.bind(classes);

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('vi'); // Đặt ngôn ngữ mặc định là tiếng Việt

const items = [
  {
    key: '1',
    label: (
      <span style={{ color: 'white', fontWeight: '600', fontSize: '18px' }}>
        Vai trò của sinh viên trong dự án là gì?
      </span>
    ),
    style: { backgroundColor: '#474D57' },
    children: (
      <ul style={{ listStyleType: 'disc', paddingLeft: '1rem', fontSize: '16px' }}>
        <li><span style={{ fontWeight: 600 }}>Tham gia nghiên cứu</span> và tìm hiểu các giải pháp cho dự án.</li>
        <li><span style={{ fontWeight: 600 }}>Hỗ trợ phát triển</span> các sản phẩm, giải pháp công nghệ hoặc sáng kiến của dự án.</li>
        <li><span style={{ fontWeight: 600 }}>Phối hợp làm việc nhóm</span> để hoàn thành các nhiệm vụ theo kế hoạch.</li>
      </ul>
    ),
  },
  {
    key: '2',
    label: (
      <span style={{ color: 'white', fontWeight: '600', fontSize: '18px' }}>
        Sinh viên có thể đóng góp như thế nào?
      </span>
    ),
    style: { backgroundColor: '#474D57' },
    children: (
      <ul style={{ listStyleType: 'disc', paddingLeft: '1rem', fontSize: '16px' }}>
        <li><span style={{ fontWeight: 600 }}>Đề xuất ý tưởng</span> và giải pháp sáng tạo để cải thiện dự án.</li>
        <li><span style={{ fontWeight: 600 }}>Thực hiện các nhiệm vụ</span> được giao như lập trình, thiết kế, nghiên cứu tài liệu.</li>
        <li><span style={{ fontWeight: 600 }}>Góp ý và phản hồi</span> giúp dự án hoàn thiện hơn.</li>
        <li><span style={{ fontWeight: 600 }}>Tham gia thuyết trình</span> và báo cáo tiến độ dự án.</li>
      </ul>
    ),
  },
  {
    key: '3',
    label: (
      <span style={{ color: 'white', fontWeight: '600', fontSize: '18px' }}>
        Nếu sinh viên có ít thời gian, có thể tham gia bằng cách nào?
      </span>
    ),
    style: { backgroundColor: '#474D57' },
    children: (
      <ul style={{ listStyleType: 'disc', paddingLeft: '1rem', fontSize: '16px' }}>
        <li><span style={{ fontWeight: 600 }}>Hỗ trợ từ xa</span> bằng cách làm việc online, nghiên cứu tài liệu hoặc đóng góp ý tưởng.</li>
        <li>Tham gia vào các giai đoạn cụ thể như <span style={{ fontWeight: 600 }}>thiết kế, kiểm thử</span> hoặc <span style={{ fontWeight: 600 }}>viết báo cáo</span>.</li>
        <li><span style={{ fontWeight: 600 }}>Hỗ trợ tổ chức</span> các sự kiện, hội thảo hoặc truyền thông về dự án.</li>
      </ul>
    ),
  },
  {
    key: '4',
    label: (
      <span style={{ color: 'white', fontWeight: '600', fontSize: '18px' }}>
        Dự án mang lại lợi ích gì cho sinh viên?
      </span>
    ),
    style: { backgroundColor: '#474D57' },
    children: (
      <ul style={{ listStyleType: 'disc', paddingLeft: '1rem', fontSize: '16px' }}>
        <li><span style={{ fontWeight: 600 }}>Phát triển kỹ năng</span> chuyên môn và làm việc nhóm.</li>
        <li><span style={{ fontWeight: 600 }}>Tích lũy kinh nghiệm</span> thực tế, giúp ích cho công việc sau này.</li>
        <li><span style={{ fontWeight: 600 }}>Cơ hội kết nối</span> với giảng viên, doanh nghiệp và các chuyên gia trong ngành.</li>
        <li><span style={{ fontWeight: 600 }}>Chứng nhận tham gia</span> dự án, hỗ trợ trong việc xin việc hoặc học bổng.</li>
      </ul>
    ),
  },
];



export const DashboardStudent = () => {
  const [currentTime, setCurrentTime] = useState(dayjs().tz('Asia/Ho_Chi_Minh'));
  const { user } = useAuth();
  console.log(user);

  useEffect(() => {
    // 🕒 Cập nhật thời gian mỗi giây
    const interval = setInterval(() => {
      setCurrentTime(dayjs().tz('Asia/Ho_Chi_Minh'));
    }, 1000);

    return () => clearInterval(interval); // 🛑 Dọn dẹp interval khi component unmount
  }, []);

  const onChange = (key) => {
    console.log(key);
  };
  const customExpandIcon = ({ isActive }) => (
    <DownOutlined style={{ color: 'white', fonWWeight: '600', transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
  );

  if (!user) return <Spinner />

  return (
    <div className={cx('dashboard-container')}>
      <div className={cx('greeting-container')}>
        <h2 className={cx('greeting', 'animate__animated animate__lightSpeedInRight')}>
          <span className={cx('greeting-text')}>Xin chào, </span>
          <span className={cx('greeting-role')}>sinh viên </span>
          <span className={cx('greeting-name')}>{user?.fullName}</span> !
        </h2>

        {/* 📅 Hiển thị ngày giờ hiện tại */}
        <p className={cx('current-time', 'animate__animated animate__fadeIn')}>Hôm nay là {currentTime.format('dddd, DD/MM/YYYY HH:mm:ss')}</p>
      </div>

      <Banner />
      <div className={cx('collapse-container')}>
        <h2 className={cx('collapse-title')}>Những câu hỏi thường gặp <QuestionCircleOutlined /></h2>
        <Collapse items={items} defaultActiveKey={['1']} onChange={onChange} size='large' expandIcon={customExpandIcon} />
      </div>

    </div>
  );
};
